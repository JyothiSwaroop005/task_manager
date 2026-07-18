const Spinner = ({ fullScreen = false }) => {
  return (
    <div className={fullScreen ? 'spinner-fullscreen' : 'spinner-wrapper'}>
      <div className="spinner" />
    </div>
  );
};

export default Spinner;
