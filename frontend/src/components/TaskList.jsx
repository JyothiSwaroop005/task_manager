import TaskCard from './TaskCard';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

export default function TaskList({ tasks, loading, onEdit, onDelete, onToggleStatus, onCreate }) {
  if (loading) return <LoadingSpinner />;

  if (!tasks.length) {
    return (
      <EmptyState
        title="No tasks found"
        message="Try adjusting your filters, or create a new task."
        actionLabel="Add task"
        onAction={onCreate}
      />
    );
  }

  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onToggleStatus={onToggleStatus} />
      ))}
    </div>
  );
}
