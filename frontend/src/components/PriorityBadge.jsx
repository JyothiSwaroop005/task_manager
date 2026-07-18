const colorMap = {
  High: 'badge-high',
  Medium: 'badge-medium',
  Low: 'badge-low',
};

const PriorityBadge = ({ priority }) => {
  return <span className={`badge ${colorMap[priority] || ''}`}>{priority}</span>;
};

export default PriorityBadge;
