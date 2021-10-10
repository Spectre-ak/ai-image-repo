import React from "react";

class NavController extends React.Component {
    constructor(props) {
        super(props);4
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
                    Dropdown button
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="#">
                        Action
                    </a>
                    <a class="dropdown-item" href="#">
                        Another action
                    </a>
                    <a class="dropdown-item" href="#">
                        Something else here
                    </a>
                </div>
            </div>
        );
    }
}

export default NavController;

