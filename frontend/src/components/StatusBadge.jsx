const StatusBadge = ({ status }) => {
  return (
    <span className={`badge ${status === 'Completed' ? 'badge-completed' : 'badge-pending'}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
