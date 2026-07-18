const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

const User = mongoose.model('User', userSchema);

// Helper to convert a Mongoose doc to a plain object with id field
const toPlain = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

// Same method signatures as the old SQL-based model so controllers don't change
const UserModel = {
  async create({ username, email, hashedPassword }) {
    const user = await User.create({ username, email, password: hashedPassword });
    return user._id; // returns ObjectId — used as userId elsewhere
  },

  async findByEmail(email) {
    const doc = await User.findOne({ email }).exec();
    return toPlain(doc); // includes password for auth checks
  },

  async findById(id) {
    const doc = await User.findById(id).select('-password').exec();
    return toPlain(doc);
  },

  async updateProfile(id, { username, email }) {
    await User.findByIdAndUpdate(id, { username, email }).exec();
    return this.findById(id);
  },

  async updatePassword(id, hashedPassword) {
    await User.findByIdAndUpdate(id, { password: hashedPassword }).exec();
  },
};

module.exports = UserModel;
