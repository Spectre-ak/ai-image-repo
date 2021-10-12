import React, { useState } from "react";
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
        let uniqueId=Math.floor(Math.random() * 100);
        this.props.data.forEach(element => {
            uniqueId++;
            const tags=[];
            element.tags.forEach(elementTag => {
                uniqueId++;
                tags.push(<ImageTagsComponent tag={elementTag} key={uniqueId*2789}/>);
            });
            processedComps.push(<ImageColDefComponent src={element.img} tags={tags} key={uniqueId/123}/>)
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
    const [loaderImage,setLoaderImage] = useState(<Loader/>);
    return (
        <div className="col-md-3 col-sm-4">
            <div className="thumbnail" href="#">
                <span>
                    {loaderImage}
                    <img className="img-fluid" src={props.src} alt="" onLoad={()=>{setLoaderImage(null);}}/>
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
