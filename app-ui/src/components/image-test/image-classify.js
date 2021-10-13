import React from "react";
import { CustomAlertComponent } from "../../App";
import ContentFunctionalityStatus from "../nav/status";

import ImageComponent from "../image-container/image";
import { Loader } from "../home-repo/home-repo";
import { VideoProcessingDone } from "../video-search/video-search";

const Status = <span>Working <i class="fa fa-check" aria-hidden="true" style={{ color: "lime" }}></i></span>;

const ImgUploadAndProcessStatus = (props) => {
    return (
        <span> &nbsp;{props.message?props.message:"Uploading and classifying your images"} &nbsp;
            <span class="spinner-border spinner-border-sm" style={{ color: "#FF9800!important" }} role="status" aria-hidden="true"></span></span>
    )
};
export {Status, ImgUploadAndProcessStatus};
class ClassifyImageComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUploadAndProcessStatus:"",
            alertMessage:"",

        }
        this.onFormSubmit=this.onFormSubmit.bind(this);
        
        this.showPopupMessage=this.showPopupMessage.bind(this);
    }
    componentDidMount() {
        this.props.setContentStatus(<ContentFunctionalityStatus status={Status} />);
        this.props.setComponentTitle(<ClassifyImageTitleComponent />);

    }
    updateUserErrorMessage(){
        this.setState({
            buttonDisabled:false,
            messageSuccess:"Some error occued while saving processing you images and saving. Try again later.",
            imgUploadAndProcessStatus:"",
            renderAddImagesToRepo:[]
        });
    }
    onFormSubmit(event){
        event.preventDefault();
        console.log(event);
        console.log(event.target[0].files);
        console.log(event.target[0].files.length);

        const files=event.target[0].files;
        const filesLength=files.length;

        if(filesLength>10){
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
            imgUploadAndProcessStatus:<ImgUploadAndProcessStatus/>
        });
        // fetch('http://localhost:5000/upload', {
        fetch('http://aiimgrepov5-env.eba-vk4ybdys.us-east-1.elasticbeanstalk.com/upload', {
            method: 'POST',
            body: reqData,
        }).then(res=>res.json()).then(res=>{
            console.log(res);
            if(!res.error){
                this.setState({
                    buttonDisabled:false,
                    renderAddImagesToRepo:<ImageComponent data={res.obj}/>,
                    messageSuccess:"Images with detected objects in it",
                    imgUploadAndProcessStatus:<VideoProcessingDone/>
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
    showPopupMessage(message){
        this.setState({
            alertMessage:message
        },()=>{
            document.getElementById("custom-alert-msg-modal").click();
        });

    }
    render() {
        return (
            <div>
                <b>Upload image and get detected objects </b>
                <br /><br />
                <form onSubmit={this.onFormSubmit}>
                    Select images: &nbsp; &nbsp;
                    <input type="file" name="file" required accept="image/*" multiple/>
                    <br /><br />
                    <button type="submit" class="btn btn-outline-primary" disabled={this.state.buttonDisabled}>
                        <i class="fa fa-upload" aria-hidden="true"></i> Upload Images
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

function ClassifyImageTitleComponent(props) {
    return (
        <div class="d-flex justify-content-center">
            <big>
                <b>{props.message?props.message:"Perform Object detection on Images"}</b>
            </big>
        </div>
    )
}

export {ClassifyImageTitleComponent};

export default ClassifyImageComponent;
