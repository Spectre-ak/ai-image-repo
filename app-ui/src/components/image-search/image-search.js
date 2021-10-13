import React from "react";
import { CustomAlertComponent } from "../../App";
import { Loader } from "../home-repo/home-repo";
import ImageComponent from "../image-container/image";
import { ClassifyImageTitleComponent, ImgUploadAndProcessStatus, Status } from "../image-test/image-test";
import ContentFunctionalityStatus from "../nav/status";
import { VideoProcessingDone } from "../video-search/video-search";


class ImageSearchComponent extends React.Component{
    constructor(props){
        super(props);
        this.state={
            imgUploadAndProcessStatus:"",
            renderAddImagesToRepo:[],
            messageSuccess:"",
            alertMessage:"",
            buttonDisabled:false,

        }
        this.onFormSubmit=this.onFormSubmit.bind(this);
        this.showPopupMessage=this.showPopupMessage.bind(this);
        this.updateUserErrorMessage=this.updateUserErrorMessage.bind(this);
    }
    componentDidMount(){
        this.props.setContentStatus(<ContentFunctionalityStatus status={Status} />);
        this.props.setComponentTitle(<ClassifyImageTitleComponent message={"Search in the repository using image"}/>);
    }
    onFormSubmit(event){
        event.preventDefault();
        console.log(event);
        console.log(event.target[0].files);
        console.log(event.target[0].files.length);

        const files=event.target[0].files;
        const filesLength=files.length;

        if(filesLength>1){
            this.showPopupMessage("Max 10 images can be processed at a time");
            return;
        }
        for(let index=0;index<filesLength;index++){
            let size = files[index].size / 1024 / 1024;
            size = parseInt(size);
            if(!files[index].type.includes("image") || size>=10){
                this.showPopupMessage("Files must be of type image(png or jpg) and size less than 10MB");
                return;
            }
        }
        const reqData =new FormData(event.target);
        this.setState({
            buttonDisabled:true,
            renderAddImagesToRepo:<Loader/>,
            imgUploadAndProcessStatus:<ImgUploadAndProcessStatus message="Uploading and searching for similar images in the repo"/>
        });

        fetch('http://localhost:5000/search_image', {
            method: 'POST',
            body: reqData,
        }).then(res=>res.json()).then(res=>{
            console.log(res);
            if(!res.error){
                const processDataForImageComponent=[];
                res.obj.forEach(element=>{
                    processDataForImageComponent.push(
                        {
                            "img":Object.keys(element)[0],
                            "tags":element[Object.keys(element)[0]].objs
                        }
                    )
                });
                console.log(processDataForImageComponent);
                if(processDataForImageComponent.length!==0)
                    this.setState({
                        buttonDisabled:false,
                        renderAddImagesToRepo:<ImageComponent data={processDataForImageComponent}/>,
                        messageSuccess:"Similar images found",
                        imgUploadAndProcessStatus:<VideoProcessingDone/>
                    });
                else
                    this.setState({
                        buttonDisabled:false,
                        renderAddImagesToRepo:[],
                        messageSuccess:"No images found with the provided search image",
                        imgUploadAndProcessStatus:"",
                    });
            }
            else{
                this.updateUserErrorMessage();
            }
        }).catch(err=>{
            console.log(err);
            this.updateUserErrorMessage();
        });

    }
    updateUserErrorMessage(){
        this.setState({
            buttonDisabled:false,
            messageSuccess:"Some error occued while saving processing you image. Try again later.",
            imgUploadAndProcessStatus:"",
            renderAddImagesToRepo:[]
        });
    }
    showPopupMessage(message){
        this.setState({
            alertMessage:message
        },()=>{
            document.getElementById("custom-alert-msg-modal").click();
        });

    }
    render(){
        return(
            <div>
                <b>Image  search component is here</b>
                <br /><br />
                <form onSubmit={this.onFormSubmit}>
                    Select image: &nbsp; &nbsp;
                    <input type="file" name="file" required accept="image/*" />
                    <br /><br />
                    <button type="submit" class="btn btn-outline-primary" disabled={this.state.buttonDisabled}>
                        <i class="fa fa-upload" aria-hidden="true"></i> Upload Image
                    </button>
                    <span>
                        {this.state.imgUploadAndProcessStatus}
                    </span>
                </form>
                <br/>
                <h5>{this.state.messageSuccess}</h5>
                {this.state.renderAddImagesToRepo}

                <br />
                <CustomAlertComponent message={this.state.alertMessage} />
            </div>
        )
    }
}


export default ImageSearchComponent;
