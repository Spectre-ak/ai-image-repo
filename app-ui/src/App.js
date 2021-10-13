import './App.css';
import React from 'react';
import Navbar from './components/nav/Navbar';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Navbar />
      </div>
    )
  }
}

function CustomAlertComponent(props) {
  return (
    <div>
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" style={{ display: 'none' }} id="custom-alert-msg-modal">
        Launch demo modal
      </button>
      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel" >Error</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              {props.message}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



function CustomAlertComponentSec(props) {
  return (
    <div>
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg" style={{ display: 'none' }} id="custom-alert-msg-modal1">Large modal</button>
      <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" style={{ display: "none" }}>
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">

            <div class="modal-header">
              <h5 class="modal-title h4" id="myLargeModalLabel">How it works</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="modal-body">
                <h4><i>Welcome to this AI powered image repository</i></h4>
                <p>The backbone of the repository is <a href="https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/tf1_detection_zoo.md">faster_rcnn_inception_v2_coco </a>
                  object detection model from tensorflow model zoo. The model is trained on COCO (Common Objects in Context) dataset, which covers around 90 day to day basis objects.</p>

                <p>How to use this site:</p>

                <p>Basically there are 5 tabs, Available on left side and right side indicates the status (its working or not currently)</p>

                <p>1. Repository Home</p>
                <p>This tab displays all available images and their corresponding tags which are stored in the repository. You can also use the search bar to filter across the repository</p>

                <br />

                <p>2. Video Search</p>
                <p>Let's say you have a video(long one) and for some purpose you want to retrieve all images/frames from this video which resemble a property/object (maybe car).</p>
                <p>You can use this video search component to do that task.</p>
                <p>Just upload a video and select what objects you want in the extracted frames. You can also use an image for searching in the video.</p>
                <p>After uploading the video, the backend will start extracting frames from your video and then passing them to the object detection model for processing.</p>
                <p>Once processing is done you'll see the result in bottom, and also you'll be allowed to download the extracted frames as a zip file</p>

                <br />

                <p>3. Image Search</p>
                <p>Using the Image search component, you can search for similar images in the repository just by using an image.</p>

                <br />

                <p>4. Classify Image</p>
                <p>This might be interesting for you.</p>
                <p>Using this component, you can see how a deep nueral network(faster_rcnn_inception_v2_coco), works on images.</p>
                <p>This component directly outputs the detected objects in an image. Upload a bunch of images and wait for the model to process it and once done you'll
                  see detected objects with their respective labels drawn over them.
                </p>

                <br />

                <p>5. Add Images</p>
                <p>This component is for contributing images to the repository. If you want you can upload images, they'll be classified/tagged by the model
                  and stored in the repository.
                </p>

                <h6>Thanks, Hope you love this site.</h6>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}
export { CustomAlertComponent, CustomAlertComponentSec };

export default App;
