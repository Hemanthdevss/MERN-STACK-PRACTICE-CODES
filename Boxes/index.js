const Box = (props) => {
    let {boxes , small , medium , large} = props;
    return (
        <div className = "mainConytainer">
            <h1 className = "mainHeadingStyle"> {boxes} </h1>
            <div className = "boxesContainer">
                <p className = "smallBoxStyle"> {small} </p>
                <p className = "mediumBoxStyle"> {medium} </p>
                <p className = "largeBoxStyle"> {large} </p>
           </div>
        </div>
    )
    
}

const element = (
    <Box boxes = "Boxes" small = "Small" medium = "Medium" large = "Large"/>
)
  
  ReactDOM.render(element, document.getElementById("root"));
  