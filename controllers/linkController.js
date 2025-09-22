const Link = require('../models/Link');
const User = require('../models/User');
const { nanoid } = require('nanoid');

exports.createLink = async (req, res) => {
  try{
    const { name, shortUrl, longUrl } = req.body;
    const owner = req.user._id;
    let slug = shortUrl && shortUrl.trim() !== '' ? shortUrl.trim() : nanoid(7);
    try {
      const link = await Link.create({ name: name || 'Untitled', shortUrl: slug, longUrl: longUrl || '', owner });
      await User.findByIdAndUpdate(owner, { $push: { links: link._id } });
      return res.json({ ok: true, link });
    } catch (err) {
      if (err.code === 11000) return res.status(400).json({ error: 'Short URL already taken' });
      throw err;
    }
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: 'Failed to create link' });
  }
};

exports.getLinkView = async (req, res) => {
  const link = await Link.findById(req.params.id);
  if(!link) return res.status(404).send('Not found');
  if(String(link.owner) !== String(req.user._id)) return res.status(403).send('Forbidden');
  res.render('linkView', { link });
};

exports.updateLink = async (req, res) => {
  try{
    const { name, shortUrl, longUrl } = req.body;
    const link = await Link.findById(req.params.id);
    if(!link) return res.status(404).json({ error: 'Not found' });
    if(String(link.owner) !== String(req.user._id)) return res.status(403).json({ error: 'Forbidden' });

    if(shortUrl && shortUrl !== link.shortUrl){
      const exists = await Link.findOne({ shortUrl });
      if(exists) return res.status(400).json({ error: 'Short URL already taken' });
      link.shortUrl = shortUrl;
    }
    if(name) link.name = name;
    if(longUrl !== undefined) link.longUrl = longUrl;
    await link.save();
    return res.json({ ok: true, link });
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: 'Update failed' });
  }
};

exports.deleteLink = async (req, res) => {
  const link = await Link.findById(req.params.id);
  if(!link) return res.status(404).json({ error: 'Not found' });
  if(String(link.owner) !== String(req.user._id)) return res.status(403).json({ error: 'Forbidden' });
  await Link.deleteOne({ _id: req.params.id });
  await User.findByIdAndUpdate(req.user._id, { $pull: { links: req.params.id } });
  return res.json({ ok: true });
};

exports.redirect = async (req, res) => {
  const slug = req.params.short;
  const link = await Link.findOne({ shortUrl: slug }).lean();
  if(!link) return res.status(404).send('Short link not found');
  if(!link.longUrl || link.longUrl.trim() === '') return res.send('<h2>Something went wrong</h2>');
  Link.updateOne({ _id: link._id }, { $inc: { clicks: 1 } }).catch(e=>{});
  return res.redirect(link.longUrl);
};