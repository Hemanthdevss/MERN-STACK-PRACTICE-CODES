const Notification = (props) => {
    const {mainHeading , firstBox , secondBox , thirdBox , lastBox } = props;
    return (
        <div className = "bg_conatainer">
            <h1 class = "headingStyle"> {mainHeading} </h1>


            <div class = "firstContainer">
                <img src = "https://assets.ccbp.in/frontend/react-js/primary-icon-img.png" className = "firstImg"/>
                <p className = "firstBoxStyle"> {firstBox} </p>
            </div>

            <div class = "secondContainer">
                <img src = "https://assets.ccbp.in/frontend/react-js/success-icon-img.png" className = "secondImg"/>
                <p className = "secondBoxStyle"> {secondBox} </p>
            </div>

            <div class = "thirdContainer">
                <img src = "https://assets.ccbp.in/frontend/react-js/warning-icon-img.png" className = "thirdImg"/>
                <p className = "thirdBoxStyle"> {thirdBox} </p>
            </div>

            <div class = "lastContainer">
                <img src = "https://assets.ccbp.in/frontend/react-js/danger-icon-img.png" className = "lastImg"/>
                <p className = "lastBoxStyle"> {lastBox} </p>
            </div>
            
            

        </div>
    )
}
  
const element = (
   <Notification mainHeading = "Notification" firstBox = "Information Message" secondBox = "Success Message" thirdBox = "Warning Message" lastBox = "Error Message"/>   
)
  
  ReactDOM.render(element, document.getElementById('root'))
  