const element = (
    <div className="bg_image">
      <h1 className="headingStyle">Congratulations</h1>
      <div className="innerContainer">
        <img
          src="https://assets.ccbp.in/frontend/react-js/congrats-card-profile-img.png"
          alt="Profile"
          className="imageStyle"
        />
        <h3> Kiran V</h3>
        <p className="paraStyle">
          Vishnu institute of computer Education and Technology, Bhimavaram{" "}
        </p>
  
        <img
          src="https://assets.ccbp.in/frontend/react-js/congrats-card-watch-img.png"
          alt="Watch"
          className="imageStyle"
        />
      </div>
    </div>
  );
  
  ReactDOM.render(element, document.getElementById('root'));
  