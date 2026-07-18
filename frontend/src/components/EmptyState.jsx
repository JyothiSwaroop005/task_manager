import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ message = 'No tasks found', action }) => {
  return (
    <div className="empty-state">
      <FiInbox size={48} />
      <p>{message}</p>
      {action}
    </div>
  );
};

export default EmptyState;
