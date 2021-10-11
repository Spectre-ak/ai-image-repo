function ContentFunctionalityStatus(props) {
    return (
      <div class="dropdown">
        <button
          class="btn btn-primary"
          type="button"
        >
          {props.status}
        </button>
      </div>
    );
  }

  export default ContentFunctionalityStatus;