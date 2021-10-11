import React from "react";
import ContentFunctionalityStatus from "../nav/status";
import TextSearchComponent from "../search-text/TextSearch";

const Status =<span>Working <i class="fa fa-check" aria-hidden="true"></i></span>;

class RepoHomeComponent extends React.Component{
    constructor(props){
        super(props);
        this.selectedListFromSearch=this.selectedListFromSearch.bind(this);
    }
    selectedListFromSearch(selectedList){
        console.log(selectedList);
    }
    componentDidMount(){
        this.props.setContentStatus(<ContentFunctionalityStatus status={Status} />);
        this.props.setComponentTitle(<TextSearchComponent selectedList={this.selectedListFromSearch}/>);

    }
    
    render(){
        return(
            <h1>home repo component is here</h1>
        )
    }
}

export default RepoHomeComponent;
