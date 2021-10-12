import React from "react";
import { Loader } from "../home-repo/home-repo";
import "./styles.css"

class ImageComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderData:<Loader/>
        };
    }

    componentDidMount(){
        console.log(this.props.data);
        const processedComps=[];
        this.props.data.forEach(element => {
            const tags=[];
            element.tags.forEach(elementTag => {
                tags.push(<ImageTagsComponent tag={elementTag}/>);
            });
            processedComps.push(<ImageColDefComponent src={element.img} tags={tags}/>)
        });
        this.setState({
            renderData:processedComps
        });
    }
    render() {
        return (
            <div class="row">
                {this.state.renderData}
            </div>
        )
    }
}

function ImageColDefComponent(props) {
    return (
        <div className="col-md-3 col-sm-4">
            <div className="thumbnail" href="#">
                <span>
                    <img className="img-fluid" src={props.src} alt="" />
                </span>
                <div class="caption">
                    {props.tags}
                </div>
            </div>
        </div>
    )
};

function ImageTagsComponent(props){
    return(
        <span style={{paddingRight:"2px", paddingLeft:"2px"}}>
            <span class="badge badge-primary" >{props.tag}</span>
        </span>
        
    )
}
export default ImageComponent;
