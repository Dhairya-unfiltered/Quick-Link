const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const dbConnect = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const linkRoutes = require('./routes/linkRoutes');
const redirectRoutes = require('./routes/redirectRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const linkController = require('./controllers/linkController');

const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// connect DB
dbConnect();

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// attach logged-in user to res.locals
app.use(async (req, res, next) => {
  try {
    const token = req.cookies[process.env.COOKIE_NAME || 'auth_token'];
    if (!token) { res.locals.user = null; return next(); }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.locals.user = user || null;
    next();
  } catch (e) {
    res.locals.user = null;
    next();
  }
});




app.get('/:short', linkController.redirect);
app.use('/', authRoutes);
app.use('/links', linkRoutes);

// error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
