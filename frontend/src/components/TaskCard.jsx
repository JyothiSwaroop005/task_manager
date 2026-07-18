import { FiEdit2, FiTrash2, FiCalendar, FiCheckCircle, FiCircle } from 'react-icons/fi';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

const formatDate = (dateStr) => {
  if (!dateStr) return 'No due date';
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const isOverdue =
    task.due_date && task.status !== 'Completed' && new Date(task.due_date) < new Date();

  return (
    <div className={`task-card ${task.status === 'Completed' ? 'task-card-completed' : ''}`}>
      <div className="task-card-header">
        <button
          className="status-toggle"
          onClick={() => onToggleStatus(task)}
          title="Toggle status"
        >
          {task.status === 'Completed' ? (
            <FiCheckCircle className="icon-completed" />
          ) : (
            <FiCircle />
          )}
        </button>
        <h3 className="task-title">{task.title}</h3>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-meta">
        <PriorityBadge priority={task.priority} />
        <StatusBadge status={task.status} />
        <span className={`task-due ${isOverdue ? 'task-overdue' : ''}`}>
          <FiCalendar size={14} /> {formatDate(task.due_date)}
        </span>
      </div>

      <div className="task-actions">
        <button className="btn-icon" onClick={() => onEdit(task)} aria-label="Edit task">
          <FiEdit2 />
        </button>
        <button className="btn-icon btn-danger" onClick={() => onDelete(task)} aria-label="Delete task">
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
