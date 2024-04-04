import "./SetTimer.css";

const SetTimer = () => {
  const testing = () => {
    console.log("30");
  };

  return (
    <div className="timerContainer">
      <button onClick={testing}>30</button>
      <button>60</button>
      <button>90</button>
    </div>
  );
};

export default SetTimer;
