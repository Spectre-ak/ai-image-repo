import React from "react";
import { Loader } from "../home-repo/home-repo";
import ImageComponent from "../image-container/image";
import { CustomAlertComponent } from "../../App";
import ContentFunctionalityStatus from "../nav/status";
import { VideoProcessingDone } from "../video-search/video-search";
import {base_url} from "../util_access";

const AddImagesToRepoTitle = () => {
    return (
        <div class="d-flex justify-content-center">
            <big>
                <b>Contribute images to AI Image Repository</b>
            </big>
        </div>
    )
}
const workingStatus = <span>Working <i class="fa fa-check" aria-hidden="true" style={{ color: "lime" }}></i></span>;
const ImgUploadAndProcessStatus = () => {
    return (
        <span> &nbsp;Uploading and classifying your images &nbsp;
            <span class="spinner-border spinner-border-sm" style={{ color: "#FF9800!important" }} role="status" aria-hidden="true"></span></span>
    )
};


class AddImageRepoComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAvailableStatus: <span style={{ color: "#fff" }}>Pending <span class="spinner-border spinner-border-sm" style={{ color: "#FF9800!important" }} role="status" aria-hidden="true"></span></span>,
            buttonDisabled:false,
            renderAddImagesToRepo:[],
            messageSuccess:"",
            imgUploadAndProcessStatus:"",
            alertMessage:"",
        }
        this.updateContentStatus = this.updateContentStatus.bind(this);
        this.onFormSubmit=this.onFormSubmit.bind(this);
        
        this.showPopupMessage=this.showPopupMessage.bind(this);
    }
    componentDidMount() {
        this.props.setContentStatus(<ContentFunctionalityStatus status={this.state.isAvailableStatus} />);
        this.props.setComponentTitle(<AddImagesToRepoTitle />);
        fetch(base_url+"/upload_and_store_status")
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.status.status) {
                    this.props.setContentStatus(<ContentFunctionalityStatus status={workingStatus} />);
                }
                else{
                    this.updateContentStatus();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
    updateContentStatus() {
        const intervalIdForCheckingUploadStatus = setInterval(async () => {
            console.log("executing inteval");
            await fetch(base_url+"/upload_and_store_status")
                .then(res => res.json())
                .then(res => {
                    console.log(res);
                    if (res.status) {
                        console.log("clearing interval");
                        this.props.setContentStatus(<ContentFunctionalityStatus status={workingStatus} />);
                        clearInterval(intervalIdForCheckingUploadStatus);
                    }
                })
                .catch(err => {
                    console.log(err);
                    console.log("clearing interval");
                    clearInterval(intervalIdForCheckingUploadStatus);
                });

        }, 10000);
    }
    onFormSubmit(event){
        event.preventDefault();
        console.log(event);
        console.log(event.target[0].files);
        console.log(event.target[0].files.length);

        const files=event.target[0].files;
        const filesLength=files.length;

        if(filesLength>30){
            this.showPopupMessage("Max 30 images allowed at a time");
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
        fetch(base_url+'/upload_and_store', {
            method: 'POST',
            body: reqData,
        }).then(res=>res.json()).then(res=>{
            console.log(res);
            if(!res.error){
                this.setState({
                    buttonDisabled:false,
                    renderAddImagesToRepo:<ImageComponent data={res.obj}/>,
                    messageSuccess:"Added following images successfully",
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
    updateUserErrorMessage(){
        this.setState({
            buttonDisabled:false,
            messageSuccess:"Some error occued while saving processing you images and saving. Try again later.",
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
    render() {
        return (
            <div className="container">
                <b>Select images to add to repo</b>
                <br/><br/>
                <form onSubmit={this.onFormSubmit}>
                    Select images: &nbsp; &nbsp;
                    <input type="file" name="file" required accept="image/*" multiple/>
                    <br/><br/>
                    <button type="submit" class="btn btn-outline-primary" disabled={this.state.buttonDisabled}>
                        <i class="fa fa-upload" aria-hidden="true"></i> Save Images
                    </button>
                    <span>
                        {this.state.imgUploadAndProcessStatus}
                    </span>
                </form>

                <br/>
                <h5>{this.state.messageSuccess}</h5>
                <br/>
                {this.state.renderAddImagesToRepo}


                <CustomAlertComponent message={this.state.alertMessage} />
            </div>
        )
    }
}

export default AddImageRepoComponent;
