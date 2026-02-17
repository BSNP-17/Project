import './Spinner.css';

const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-circle"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Spinner;