import React from "react";
import "./styles.css"

class ImageComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    

    render() {
        return (
            <div class="row">
                <ImageColDefComponent />
                <ImageColDefComponent />
                <ImageColDefComponent />
                <ImageColDefComponent />
                <ImageColDefComponent />
                <ImageColDefComponent />
            </div>
        )
    }
}

function ImageColDefComponent(props) {
    return (
        <div className="col-md-3 col-sm-4">
            <div className="thumbnail" href="#">
                <span>
                    <img className="img-fluid" src="http://placehold.it/175x266" alt="" />
                </span>
                <div class="caption">
                    tags goes here
                </div>
            </div>
        </div>
    )
};

export default ImageComponent;
