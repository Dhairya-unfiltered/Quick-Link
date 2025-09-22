const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

async function protect(req, res, next){
  try{
    const token = req.cookies[process.env.COOKIE_NAME || 'auth_token'];
    if(!token) return res.redirect('/?next=' + encodeURIComponent(req.originalUrl));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if(!user) {
      res.clearCookie(process.env.COOKIE_NAME || 'auth_token');
      return res.redirect('/');
    }

    req.user = user;
    next();
  }catch(err){
    console.error('auth error', err);
    res.clearCookie(process.env.COOKIE_NAME || 'auth_token');
    return res.redirect('/');
  }
}

module.exports = { protect };
