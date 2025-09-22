const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LinkSchema = new Schema({
  name: { type: String, default: 'Untitled' },
  shortUrl: { type: String, required: true, unique: true, index: true },
  longUrl: { type: String, default: '' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  clicks: { type: Number, default: 0 },
}, { timestamps: true });

LinkSchema.index({ shortUrl: 1 });

module.exports = mongoose.model('Link', LinkSchema);
