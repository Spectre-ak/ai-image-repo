import logo from './logo.svg';
import './App.css';
import React from 'react';
import Navbar from './components/nav/Navbar';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state ={};
  }
  render(){
    return(
      <div><Navbar/></div>
    )
  }
}

export default App;
