const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: null },
    priority:    { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium', index: true },
    status:      { type: String, enum: ['Pending', 'Completed'], default: 'Pending', index: true },
    due_date:    { type: Date, default: null, index: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const Task = mongoose.model('Task', taskSchema);

// Helper to convert a Mongoose doc to a plain object with id field
const toPlain = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

const toPlainArray = (docs) => docs.map(toPlain);

// Same method signatures as the old SQL-based model so controllers don't change
const TaskModel = {
  async create(userId, { title, description, priority, status, due_date }) {
    const task = await Task.create({
      user_id: new mongoose.Types.ObjectId(userId),
      title,
      description: description || null,
      priority: priority || 'Medium',
      status: status || 'Pending',
      due_date: due_date || null,
    });
    return toPlain(task);
  },

  async findAll(userId) {
    const uid = new mongoose.Types.ObjectId(userId);
    const docs = await Task.find({ user_id: uid }).sort({ created_at: -1 }).exec();
    return toPlainArray(docs);
  },

  async findById(id, userId) {
    try {
      const uid = new mongoose.Types.ObjectId(userId);
      const doc = await Task.findOne({ _id: id, user_id: uid }).exec();
      return toPlain(doc);
    } catch {
      return null;
    }
  },

  async update(id, userId, { title, description, priority, status, due_date }) {
    const uid = new mongoose.Types.ObjectId(userId);
    await Task.findOneAndUpdate(
      { _id: id, user_id: uid },
      { title, description: description || null, priority, status, due_date: due_date || null }
    ).exec();
    return this.findById(id, userId);
  },

  async updateStatus(id, userId, status) {
    const uid = new mongoose.Types.ObjectId(userId);
    await Task.findOneAndUpdate({ _id: id, user_id: uid }, { status }).exec();
    return this.findById(id, userId);
  },

  async delete(id, userId) {
    try {
      const uid = new mongoose.Types.ObjectId(userId);
      const result = await Task.deleteOne({ _id: id, user_id: uid }).exec();
      return result.deletedCount > 0;
    } catch {
      return false;
    }
  },
};

module.exports = TaskModel;
