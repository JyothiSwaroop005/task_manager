const StatCard = ({ icon, label, value, colorClass }) => {
  return (
    <div className={`stat-card ${colorClass || ''}`}>
      <div className="stat-icon">{icon}</div>
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
