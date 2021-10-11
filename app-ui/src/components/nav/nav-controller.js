import React from "react";
import AddImageRepoComponent from "../add-repo/add-img-repo";
import RepoHomeComponent from "../home-repo/home-repo";
import ImageSearchComponent from "../image-search/image-search";
import ClassifyImageComponent from "../image-test/image-test";
import VideoSearchComponent from "../video-search/video-search";


class NavController extends React.Component {
    constructor(props) {
        super(props);
        this.changeTab = this.changeTab.bind(this);
        this.state = {
            currentTab:"Repository Home",
            Components: {
                "Repository Home":<RepoHomeComponent setContentStatus={this.props.setContentStatus} setComponentTitle={this.props.setComponentTitle}/>,
                "Video Search":<VideoSearchComponent setContentStatus={this.props.setContentStatus} setComponentTitle={this.props.setComponentTitle}/>,
                "Image Search":<ImageSearchComponent setContentStatus={this.props.setContentStatus} setComponentTitle={this.props.setComponentTitle}/>,
                "Classify Image":<ClassifyImageComponent setContentStatus={this.props.setContentStatus} setComponentTitle={this.props.setComponentTitle}/>,
                "Add Images":<AddImageRepoComponent setContentStatus={this.props.setContentStatus} setComponentTitle={this.props.setComponentTitle}/>
            }
        }
    }
    changeTab(event) {
        console.log(event);
        this.setState({
            currentTab:event
        });
        this.props.setContentComponent(this.state.Components[event]);
    }
    render() {
        return (
            <div class="dropdown">
                <button
                    class="btn btn-primary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    style={{marginBottom:"10px"}}
                >
                    {this.state.currentTab}
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <DefineNavDropdown name="Repository Home" setDropdownDisplay={this.changeTab} onClick={()=>{console.log("repo page")}}/>
                    <DefineNavDropdown name="Video Search" setDropdownDisplay={this.changeTab}/>
                    <DefineNavDropdown name="Image Search" setDropdownDisplay={this.changeTab}/>
                    <DefineNavDropdown name="Classify Image" setDropdownDisplay={this.changeTab}/>
                    <DefineNavDropdown name="Add Images" setDropdownDisplay={this.changeTab}/>                   
                </div>
            </div>
        );
    }
}

function DefineNavDropdown(props) {
    return (
        <span class="dropdown-item" onClick={() => { props.setDropdownDisplay(props.name) }} style={{ cursor: "pointer" }}>
            {props.name}
        </span>
    )
}
export default NavController;

