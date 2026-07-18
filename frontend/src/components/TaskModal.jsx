import { useState, useEffect } from 'react';

const EMPTY = { title: '', description: '', priority: 'Medium', status: 'Pending', due_date: '' };

export default function TaskModal({ open, onClose, onSubmit, initialTask }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialTask) {
      setForm({
        title: initialTask.title || '',
        description: initialTask.description || '',
        priority: initialTask.priority || 'Medium',
        status: initialTask.status || 'Pending',
        due_date: initialTask.due_date ? initialTask.due_date.slice(0, 10) : '',
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [initialTask, open]);

  if (!open) return null;

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({ ...form, due_date: form.due_date || null });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initialTask ? 'Edit Task' : 'Add New Task'}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input id="title" type="text" value={form.title} onChange={handleChange('title')} placeholder="e.g. Finish deployment guide" autoFocus />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" rows={3} value={form.description} onChange={handleChange('description')} placeholder="Optional details..." />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select id="priority" value={form.priority} onChange={handleChange('priority')}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" value={form.status} onChange={handleChange('status')}>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="due_date">Due Date</label>
            <input id="due_date" type="date" value={form.due_date} onChange={handleChange('due_date')} />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : initialTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
