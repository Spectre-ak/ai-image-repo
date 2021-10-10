import React from "react";

import StatusDropdown from "./status";
import NavController from "./nav-controller";
import TextSearchComponent from "../search-text/TextSearch";

export default function Navbar() {
  
  return (

    <div>
      <div className="container">
        <nav class="navbar navbar-expand-md navbar-dark bg-dark">
          <div class="navbar-collapse collapse w-60 order-1 order-md-0 dual-collapse2">
            <ul class="navbar-nav mr-auto">
              <NavController />
            </ul>
          </div>
          <div
            class="mx-auto order-0 w-100"
            style={{ paddingLeft: "20px", paddingRight: "20px" }}
          >
            <TextSearchComponent />

            <button
              class="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target=".dual-collapse2"
              style={{ float: "left" }}
            >
              <i class="fa fa-chevron-circle-down" aria-hidden="true"></i>
            </button>

          </div>
          <div class="navbar-collapse collapse w-60 order-3 dual-collapse2">
            <ul class="navbar-nav ml-auto">
              <StatusDropdown />
            </ul>
          </div>
        </nav>

      </div>

    </div>


  );
}


