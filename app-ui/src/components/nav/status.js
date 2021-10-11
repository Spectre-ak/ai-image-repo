import "./style.css";

function ContentFunctionalityStatus(props) {
    return (
      <div class="dropdown">
        <button 
          class="btn btn-primary"
          type="button"
          style={{marginBottom:"10px"}}
        >
          {props.status}
        </button>
      </div>
    );
  }

  export default ContentFunctionalityStatus;