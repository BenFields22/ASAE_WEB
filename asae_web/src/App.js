import React, { Component } from 'react';
import './App.css';


class Process extends Component{
  constructor(props) {
    super(props);
    this.updateHandler  =   this.props.updateProc;
    this.state ={
      show: "processData",
      number: props.number,
      processTime: 'na',
      positionType: 'na',
      downStream: 'na',
      upstream:'na'
    }
  }

  updateProcessTime = (evt) =>{
    this.setState({
      processTime: evt.target.value
    });
  }
  
  updatePos = (evt) => {
    this.setState({
      positionType: evt.target.value
    });
  }

  updateDownstream = (evt) => {
    this.setState({
      downStream: evt.target.value
    });
  }

  updateUpstream = (evt) => {
    this.setState({
      upstream: evt.target.value
    });
  }

addToProcesses = () =>{
  var p = {
    number:this.state.number,
    time:this.state.processTime,
    pos:this.state.positionType,
    up:this.state.upstream,
    down:this.state.downStream
  };
  this.setState({
    show:"hidden"
  });
  this.updateHandler(p);
}

  render(){
    return (
      <div className={this.state.show}><h3>{"Process " + this.state.number}</h3>
      
          ProcessTime:<br/>
          <input className="data" type="text" onChange={this.updateProcessTime}></input><br/>

          Position type:<br/>
          <input className="data" type="text" onChange={this.updatePos}></input><br/> 

          DownStreamConnections:<br/>
          <input className="data" type="text" onChange={this.updateDownstream}></input><br/> 

          UpstreamConnections:<br/>
          <input className="data" type="text" onChange={this.updateUpstream}></input><br/>
      <button onClick={this.addToProcesses}>ADD</button>
    </div>
    )
  };
}

const ProcessPanel = props => (
  <div className="ProcessPanel">
    <div id="panel-pane">
      {props.children}
    </div>
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numProcesses:'na',
      numJobs:'na',
      numChildren: 0,
      processes:[]
    };
  }

  componentDidMount() {
    //example of using fetch api
    fetch('http://localhost:8080/AddView')
      .then((res) => res.json())
  }

  componentWillUnmount() {
  
  }

  getViews = () => {
    fetch('http://localhost:8080/modelCount')
      .then((res) => res.json())
      .then((mycount) => {alert('Views: '+mycount.Modelcount)});
  }

  preview = ()=>{
    var doc = document.getElementById("modelFile");
    var size = this.state.processes.length;
    doc.value = "";
    doc.value += "<MODEL>\n";
    doc.value += "<"+this.state.numJobs+">\n";
    doc.value += "<"+this.state.numProcesses+">\n";
    for(var i = 0; i<size;i++){
      doc.value += "<PROCESS "+this.state.processes[i].number + ">\n";
      doc.value += "<"+this.state.processes[i].time + ">\n";
      doc.value += "<"+this.state.processes[i].pos + ">\n";
      doc.value += "<"+this.state.processes[i].down + ">\n";
      doc.value += "<"+this.state.processes[i].up + ">\n";
      doc.value += "</PROCESS "+this.state.processes[i].number + ">\n";
      if(i<size-1){
        doc.value +="\n";
      }
    }
    doc.value += "</MODEL>\n";
  
  }

  download = ()=>{
    var text = document.getElementById("modelFile").value;
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    var filename = prompt("Please enter the filename");
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  save = ()=>{

  }

  load = ()=>{

  }

  updateProcesses = (val) => {
    this.setState({
      processes:[...this.state.processes, val]
    },()=>{
      this.preview();
    });
  }


  defineProcesses = () =>{
    var jobs = document.getElementById("numJobs").value;
    var proc = document.getElementById("numProcesses").value;
    setTimeout(() => {this.setState({numJobs: jobs,numProcesses:proc,numChildren:proc}, function(){ 
    });}, 5);
  }
  render() {
    const children = [];
    for (var i = 0; i < this.state.numChildren; i += 1) {
      children.push(<Process updateProc={this.updateProcesses} key={i} number={i} />);
    };

    return (
      <div className="App">
        <div className="TopOfPage">
          <button onClick={this.getViews}>View Count</button>
          Auto Simulation Analysis Model Creator
        </div>
        <div className="MiddleOfPage">
          <div className="leftSide">
              <div className="Seperator"><h2>Model Definition</h2></div>
              Number of jobs<br/>
              <input id="numJobs" type="text"></input><br/>

              Number of Processes<br/>
              <input id = "numProcesses" type="text"></input><br/>
              <button onClick={this.defineProcesses} >DEFINE</button><br/>
              <div className="Seperator"><h2>Process Panel</h2></div>
              <ProcessPanel >
              {children}
              </ProcessPanel>
          </div>
          <div className = "rightSide">
          <div className="FORMAT">
          <div className="Seperator"><h2>Format</h2></div>
          
              <h3>Distribution time</h3>
                 <p> N:Average:stdDev<br/>  T:Low:Avg:Upper<br/>  U:Lower:Upper<br/>  C:Value<br/></p>
                <h3>Position Type</h3>
                <p>0-FRONT 1-MIDDLE 2-TERMINAL<br/> </p>
              <h3>DownStreamConnections</h3>
              <p>number,PID(percentage)buffer_capacity,...<br/>
              X,XX(X.XX)XX,...<br/></p>
              <h3>UpstreamConnections</h3>
              <p>Number,(PID,Buffer_Index),...<br/>
              X,(XX,X),...<br/></p>
          
          </div>
            <div id="docPreview">
            <div className="Seperator"><h2>Model.txt</h2></div>
              <button onClick={this.download}>DOWNLOAD</button>
              <div className="saveandload">
              </div>
              <textarea id="modelFile" className="previewText" rows="42" placeholder="Preview of Model.txt">
              </textarea>
            </div>
          </div>
        </div>
         <div className="BottomOfPage">© Benjamin Fields 2018</div>
      </div>
    );
  }
}

export default App;
