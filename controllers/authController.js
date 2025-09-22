const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { createToken } = require('../utils/token');

exports.showIndex = (req, res) => {
  const token = req.cookies[process.env.COOKIE_NAME || 'auth_token'];
  if(token) return res.redirect('/user/dashboard');
  res.render('index', { errors: [], old: {} });
};

exports.register = async (req, res) => {
  try{
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if(existing) return res.render('index', { errors: [{ msg: 'Email already registered' }], old: req.body });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    const token = createToken({ id: user._id });
    res.cookie(process.env.COOKIE_NAME || 'auth_token', token, { httpOnly: true });
    res.redirect('/user/dashboard');
  }catch(err){
    console.error(err);
    res.render('index', { errors: [{ msg: 'Registration failed' }], old: req.body });
  }
};

exports.login = async (req, res) => {
  try{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.render('index', { errors: [{ msg: 'Invalid credentials' }], old: req.body });

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.render('index', { errors: [{ msg: 'Invalid credentials' }], old: req.body });

    const token = createToken({ id: user._id });
    res.cookie(process.env.COOKIE_NAME || 'auth_token', token, { httpOnly: true });
    res.redirect('/user/dashboard');
  }catch(err){
    console.error(err);
    res.render('index', { errors: [{ msg: 'Login failed' }], old: req.body });
  }
};

exports.logout = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || 'auth_token');
  res.redirect('/');
};

exports.dashboard = async (req, res) => {
  const user = await User.findById(req.user._id).populate('links');
  res.render('dashboard', { user });
};
