const Button = (props) => {
    const { mainHeading , like , comment , share } = props
    return (
        <div className = "bgStyle">
            <h1 className = "headingStyle"> {mainHeading} </h1>
            <div className = "buttonContainer">
                <button className = "likeButtonStyle"> {like}</button>
                <button className = "commentButtonStyle">{comment}</button>
                <button className = "shareButtonStyle">{share}</button>
            </div>
        </div>
    )
}

const element = (
    <Button mainHeading = "Social Buttons" like = "Like" comment = "Comment" share = "Share"/>
)

ReactDOM.render(element, document.getElementById('root'))
