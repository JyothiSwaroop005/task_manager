import { useState } from 'react';
import Modal from './Modal';
import { useToast } from '../hooks/useToast';

const emptyForm = { title: '', description: '', priority: 'Medium', status: 'Pending', due_date: '' };

const TaskFormModal = ({ task, onClose, onSubmit }) => {
  const [form, setForm] = useState(
    task
      ? {
          title: task.title,
          description: task.description || '',
          priority: task.priority,
          status: task.status,
          due_date: task.due_date ? task.due_date.slice(0, 10) : '',
        }
      : emptyForm
  );
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(form);
      showToast(task ? 'Task updated' : 'Task created', 'success');
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={task ? 'Edit Task' : 'Add Task'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="task-form">
        <label>
          Title
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>
          Description
          <textarea name="description" rows={3} value={form.description} onChange={handleChange} />
        </label>
        <div className="form-row">
          <label>
            Priority
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>
          <label>
            Status
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
        </div>
        <label>
          Due Date
          <input type="date" name="due_date" value={form.due_date} onChange={handleChange} />
        </label>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : task ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;
