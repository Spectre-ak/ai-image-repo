import React, { useState } from "react";

import ContentFunctionalityStatus from "./status";

import NavController from "./nav-controller";
import RepoHomeComponent from "../home-repo/home-repo";
import VideoSearchComponent from "../video-search/video-search";

const Loader = <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>

export default function Navbar() {

  const [contentFuncStatus, setContentStatus] = useState(<ContentFunctionalityStatus status={Loader} />);
  const [componentTitle, setComponentTitle] = useState(Loader);
  //const [contentComponent, setContentComponent] = useState(<RepoHomeComponent setContentStatus={setContentStatus} setComponentTitle={setComponentTitle}/>);
  const [contentComponent, setContentComponent] = useState(<VideoSearchComponent setContentStatus={setContentStatus} setComponentTitle={setComponentTitle}/>);
  return (
    <div className="container">
      <h4 style={{marginTop:"15px",marginBottom:"20px"}}>Welcome to AI based Image Repository</h4>
      <div className="container">
        <nav class="navbar navbar-expand-md navbar-dark bg-dark">
          <div class="navbar-collapse collapse w-60 order-1 order-md-0 dual-collapse2">
            <ul class="navbar-nav mr-auto">
              <NavController setContentComponent={setContentComponent} setContentStatus={setContentStatus} setComponentTitle={setComponentTitle}/>
            </ul>
          </div>
          <div
            class="mx-auto order-0 w-100"
            style={{ paddingLeft: "20px", paddingRight: "20px",marginTop:"-8px" }}
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

