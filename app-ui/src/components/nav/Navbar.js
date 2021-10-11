import React, { useState } from "react";

import ContentFunctionalityStatus from "./status";

import NavController from "./nav-controller";
import RepoHomeComponent from "../home-repo/home-repo";

const Loader = <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>

export default function Navbar() {

  const [contentFuncStatus, setContentStatus] = useState(<ContentFunctionalityStatus status={Loader} />);
  const [componentTitle, setComponentTitle] = useState(Loader);
  const [contentComponent, setContentComponent] = useState(<RepoHomeComponent setContentStatus={setContentStatus} setComponentTitle={setComponentTitle}/>);
  
  return (
    <div className="container">
      <div className="container">
        <nav class="navbar navbar-expand-md navbar-dark bg-dark">
          <div class="navbar-collapse collapse w-60 order-1 order-md-0 dual-collapse2">
            <ul class="navbar-nav mr-auto">
              <NavController setContentComponent={setContentComponent} setContentStatus={setContentStatus} setComponentTitle={setComponentTitle}/>
            </ul>
          </div>
          <div
            class="mx-auto order-0 w-100"
            style={{ paddingLeft: "20px", paddingRight: "20px" }}
          >
            {componentTitle}
            <button
              class="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target=".dual-collapse2"
              style={{ float: "right", marginTop: "10px" }}
            >
              <i class="fa fa-chevron-circle-down" aria-hidden="true"></i>
            </button>
          </div>
          <div class="navbar-collapse collapse w-60 order-3 dual-collapse2">
            <ul class="navbar-nav ml-auto">
              {contentFuncStatus}
            </ul>
          </div>
        </nav>

      </div>

      <hr />
      <hr />

      <div>
        {contentComponent}
      </div>
    </div>

  );

}

