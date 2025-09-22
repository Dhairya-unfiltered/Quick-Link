function errorHandler(err, req, res, next){
  console.error(err.stack);
  const acceptsJson = req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1);
  if(acceptsJson){
    return res.status(500).json({ error: 'Server error' });
  }
  res.status(500).send('<h2>Server error</h2>');
}

module.exports = { errorHandler };
