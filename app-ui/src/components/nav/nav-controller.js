import React from "react";
import AddImageRepoComponent from "../add-repo/add-img-repo";
import RepoHomeComponent from "../home-repo/home-repo";
import ImageSearchComponent from "../image-search/image-search";
import ClassifyImageComponent from "../image-test/image-test";
import VideoSearchComponent from "../video-search/video-search";

const Components = {
    "Repository Home":<RepoHomeComponent/>,
    "Video Search":<VideoSearchComponent/>,
    "Image Search":<ImageSearchComponent/>,
    "Classify Image":<ClassifyImageComponent/>,
    "Add Images":<AddImageRepoComponent/>
}
class NavController extends React.Component {
    constructor(props) {
        super(props);
        this.changeTab = this.changeTab.bind(this);
        this.state = {
            currentTab:"Repository Home"
        }
    }
    changeTab(event) {
        console.log(event);
        this.setState({
            currentTab:event
        });
        this.props.setContentComponent(Components[event]);
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

