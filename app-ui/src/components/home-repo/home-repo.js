import React from "react";
import ImageComponent from "../image-container/image";
import ContentFunctionalityStatus from "../nav/status";
import TextSearchComponent from "../search-text/TextSearch";
import {base_url} from "../util_access";

const Status = <span>Working <i class="fa fa-check" aria-hidden="true" style={{color:"lime"}}></i></span>;

class RepoHomeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.selectedListFromSearch = this.selectedListFromSearch.bind(this);
        this.state = {
            renderHome: <Loader />,
            rawData: []
        }
    }
    selectedListFromSearch(selectedList) {
        this.setState({
            renderHome: [<Loader/>],
        });
        
        console.log(selectedList);
        const filteredImgData = [];
        selectedList.forEach(element => {
            this.state.rawData.forEach(rawDataElement => {
                if (rawDataElement.tags.includes(element)) {
                    console.log(rawDataElement);
                    filteredImgData.push(rawDataElement);
                }
            });
        });

        console.log("filtered data is here");
        console.log(filteredImgData);
        let dataTOBe=<ImageComponent data={filteredImgData}/>;;
        if(filteredImgData.length===0){
            if(selectedList.length===0){
                dataTOBe=<ImageComponent data={this.state.rawData}/>;
            }
            else{
                dataTOBe=<div class="d-flex justify-content-center">No results with provided tags</div>;
            }
        }
        this.setState({
            renderHome: <Loader/>,
        }, ()=>{
            this.setState({
                renderHome: dataTOBe
            })
        });
    }
    componentDidMount() {
        this.props.setContentStatus(<ContentFunctionalityStatus status={Status} />);
        this.props.setComponentTitle(<TextSearchComponent selectedList={this.selectedListFromSearch} />);
        fetch(base_url+'/repo_home_data', {
            method: 'GET',
        }).then(res => res.json()).then(res => {
            console.log(res);
            const imgData = [];
            for (let key in res.data) {
                console.log(res.data[key]);
                imgData.push({
                    "img": key,
                    "tags": res.data[key]
                });
            }
            this.setState({
                renderHome: <ImageComponent data={imgData} />,
                rawData: imgData
            });
        }).catch(err=>{
            this.setState({
                renderHome: <h5>Some error occured, raise a issue at github</h5>
            });
        });
    }

    render() {
        return (
            <div id="repo-home-container">
                 {this.state.renderHome}
            </div>        
        )
    }
}

function Loader() {
    return (
        <div class="d-flex justify-content-center">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    )
}

export { Loader };
export default RepoHomeComponent;
