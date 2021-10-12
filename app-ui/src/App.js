import logo from './logo.svg';
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
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" style={{display:'none'}} id="custom-alert-msg-modal">
        Launch demo modal
      </button>
      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Error</h5>
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

export {CustomAlertComponent};

export default App;
