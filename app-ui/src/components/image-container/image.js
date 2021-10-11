import React from "react";
import "./styles.css"

class ImageComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="row">
                <ImageColDefComponent/>
                <ImageColDefComponent/>
                <ImageColDefComponent/>
                <ImageColDefComponent/>
                <ImageColDefComponent/>
                <ImageColDefComponent/>
                
            </div>
        )
    }
}

function ImageColDefComponent() {
    <div class="col-md-3 col-sm-4">
        <div class="thumbnail" href="#">
            <a href="#">
                <img class="img-responsive" src="http://placehold.it/175x266" alt="" />
            </a>
            <div class="caption">
                <a href="#" class="btn btn-shopping btn-responsive">
                    adfas
                </a>
            </div>
        </div>
    </div>
};

export default ImageColDefComponent;
