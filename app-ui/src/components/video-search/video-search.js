import React from "react";
import { CustomAlertComponent } from "../../App";
import ContentFunctionalityStatus from "../nav/status";
import TextSearchComponent from "../search-text/TextSearch";
import ImageComponent from "../image-container/image";
import { Loader } from "../home-repo/home-repo";
import {base_url} from "../util_access";

const Status = <span>Working <i class="fa fa-check" aria-hidden="true" style={{ color: "lime" }}></i></span>;

function SearhUsingImageComponent() {
    return (
        <div>Select an image:
            &nbsp; &nbsp;
            <input type="file" name="Imagefile" required accept="image/*" />
        </div>
    );
}


const VideoUploadingProgress = () => {
    return (
        <span> &nbsp;Uploading &nbsp;<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></span>
    );
};

const VideoProcessingProgress = () => {
    return (
        <span> &nbsp;Uploaded, Detecting objects on video frames, might take few mins depeding on video size &nbsp;
            <span class="spinner-border spinner-border-sm" style={{ color: "#FF9800!important" }} role="status" aria-hidden="true"></span></span>
    )
};

const VideoProcessingDone = () => {
    return (
        <span> &nbsp;Done &nbsp;<i class="fa fa-check-circle" style={{ color: "lime" }} aria-hidden="true"></i></span>
    );
};

const NoResultComponent = () => {
    return (
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
            No similar images found with the given image/tags in the video
        </div>
    )
}

class VideoSearchComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTypeComponent: <SearhUsingImageComponent />,
            searchTags: [],
            renderVideoSearchContent: [],
            downloadLink: [],
            buttonDisabled:false,
        };
        this.selectedListFromSearch = this.selectedListFromSearch.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.alertUser = this.alertUser.bind(this);
    }
    componentDidMount() {
        this.props.setContentStatus(<ContentFunctionalityStatus status={Status} />);
        this.props.setComponentTitle(<VideoSearchTitleComponent />);
        console.log("fetcing stired data");
        console.log(localStorage.getItem("ImageComponent"));
        console.log(localStorage.getItem("DownloadAsZipComponent"));
        const foundSimilarImages = JSON.parse(localStorage.getItem("ImageComponent"));
        const zipUrl = localStorage.getItem("DownloadAsZipComponent");

        if (foundSimilarImages && foundSimilarImages.length !== 0) {
            fetch(base_url+"/chk/"+localStorage.getItem("temp_dir_id"))
                .then(res=>res.json()).then(res=>{
                if(res.status){
                    this.setState({
                        renderVideoSearchContent: <ImageComponent data={foundSimilarImages} />,
                        downloadLink: <DownloadAsZipComponent url={zipUrl} />,
                    });
                }
            }).catch(err=>{console.log(err);})
            
        }
    }

    selectedListFromSearch(selectedList) {
        console.log(selectedList);
        this.setState({
            searchTags: selectedList,
            alertMessage: "OK",
        });
    }
    alertUser(message) {
        this.setState({
            alertMessage: message
        }, () => {
            document.getElementById("custom-alert-msg-modal").click();
        });
    }
    onFormSubmit(event) {
        event.preventDefault();
        console.log(event);
        const videoSrc = event.target[0];
        console.log(event.target[1].checked);
        console.log(event.target[2].checked);

        const requestFormData = new FormData(event.target);

        requestFormData.append("type", event.target[1].checked ? "img" : "text")
        requestFormData.append("search_text", JSON.stringify(this.state.searchTags));

        if (event.target[2].checked) {
            if (this.state.searchTags.length === 0) {
                this.alertUser("Select tags on which to be search");
                return;
            }
        }
        else {
            const imgSrc = event.target[3];
            let size = imgSrc.files[0].size / 1024 / 1024;
            size = parseInt(size);
            if (size >= 10 || !imgSrc.files[0].type.includes("image")) {
                this.alertUser("Search file type must be image(png or jpg) and size less than 10MB");
                return;
            }
        }

        let size = videoSrc.files[0].size / 1024 / 1024;
        size = parseInt(size);
        console.log('video type');
        console.log(videoSrc.files[0].type);
        if (size >= 20 || !videoSrc.files[0].type.includes("video")) {
            this.alertUser("Video file type must be video(mp4) and size less than 20MB");
            return;
        }

        console.log(videoSrc);

        this.setState({
            renderVideoSearchContent: <Loader />,
            videoProcessStatus: <VideoUploadingProgress />,
            buttonDisabled:true
        });
        fetch(base_url+'/search_video', {
            method: 'POST',
            body: requestFormData,

        }).then(res => res.json()).then(res => {
            console.log(res);
            if (res.error) {
                this.errorOccuredRaiseIssue();
                return;
            }
            const processVidData = new FormData();
            processVidData.append("json", JSON.stringify(res));

            this.setState({
                videoProcessStatus: <VideoProcessingProgress />
            });

            fetch(base_url+'/start_processing_video', {
                method: 'POST',
                body: processVidData,

            }).then(framesRes => framesRes.json()).then(framesRes => {
                if (framesRes.error) {
                    this.errorOccuredRaiseIssue();
                    return;
                }
                console.log(framesRes);
                const foundSimilarImages = []
                framesRes.data.forEach(obj => {
                    console.log(obj);
                    foundSimilarImages.push({
                        "img": base_url+"/" + obj[Object.keys(obj)[0]].frame_path,
                        "tags": obj[Object.keys(obj)[0]].similar_objs
                    });
                });
                const zipUrl = base_url+"/static/" + res.temp_dir_id + ".zip";
                localStorage.setItem("ImageComponent", JSON.stringify(foundSimilarImages));
                localStorage.setItem("DownloadAsZipComponent", zipUrl);
                localStorage.setItem("temp_dir_id", res.temp_dir_id);

                if (foundSimilarImages.length === 0) {
                    this.setState({
                        renderVideoSearchContent: <NoResultComponent />,
                        videoProcessStatus: <VideoProcessingDone />,
                        buttonDisabled:false
                    });
                }
                else {
                    this.setState({
                        renderVideoSearchContent: <ImageComponent data={foundSimilarImages} />,
                        downloadLink: <DownloadAsZipComponent url={zipUrl} />,
                        videoProcessStatus: <VideoProcessingDone />,
                        resultsInfo: "Similar Images",
                        buttonDisabled:false
                    });
                }
            }).catch(err => {
                console.log(err);
                console.log("error found in second vid fest");
                this.errorOccuredRaiseIssue();
            });

        }).catch(err => {
            console.log(err);
            this.errorOccuredRaiseIssue();
        });
    }
    errorOccuredRaiseIssue() {
        this.setState({
            renderVideoSearchContent: <h5>Some error occured, raise a issue at github</h5>,
            buttonDisabled:false
        });
    }
    render() {
        return (
            <div className="container">
                <b>Search Images inside videos using an image or tags</b>
                <br></br><br></br>

                <form onSubmit={this.onFormSubmit}>
                    Select a video: &nbsp; &nbsp;
                    <input type="file" name="Videofile" required accept="video/*" />
                    <br /><br />
                    Select search type Image or Tags: &nbsp; &nbsp;
                    <div class="form-check form-check-inline" onClick={() => { this.setState({ searchTypeComponent: <SearhUsingImageComponent /> }) }}>
                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" defaultChecked />
                        <label class="form-check-label" for="inlineRadio1" >Image</label>
                    </div> &nbsp;
                    <div class="form-check form-check-inline" onClick={() => { this.setState({ searchTypeComponent: <TextSearchComponent selectedList={this.selectedListFromSearch} /> }) }}>
                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
                        <label class="form-check-label" for="inlineRadio2" >Tags</label>
                    </div>

                    <br /><br />
                    {this.state.searchTypeComponent}
                    <br /><br />
                    <button type="submit" class="btn btn-outline-primary" disabled={this.state.buttonDisabled}>
                        <i class="fa fa-upload" aria-hidden="true"></i> Upload and start processing video
                    </button>
                    <span>
                        {this.state.videoProcessStatus}
                    </span>
                </form>

                <br />
                {this.state.downloadLink}
                <h5>
                    {this.state.resultsInfo}
                </h5>

                {this.state.renderVideoSearchContent}
                <CustomAlertComponent message={this.state.alertMessage} />
            </div>
        )
    }
}

function DownloadAsZipComponent(props) {
    return (
        <div style={{ float: "" }}>
            <a class="btn btn-outline-primary" href={props.url} role="button">
                Download as zip &nbsp;<i class="fa fa-download" aria-hidden="true"></i>
            </a>
            <p style={{ textAlign: "" }}><small>Available for next 30 mins</small></p>
        </div>
    )
}

function VideoSearchTitleComponent() {
    return (
        <div class="d-flex justify-content-center">
            <big>
                <b>Video Search</b>
            </big>
        </div>
    )
}

export {VideoProcessingDone};

export default VideoSearchComponent;

