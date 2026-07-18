const ProgressBar = ({ percentage = 0 }) => {
  return (
    <div className="progress-bar-wrapper">
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
      </div>
      <span className="progress-bar-label">{percentage}%</span>
    </div>
  );
};

export default ProgressBar;
