import React, { Component } from 'react';
import './App.css';


class Process extends Component{
  constructor(props) {
    super(props);
    this.updateHandler  =   this.props.updateProc;
    this.state ={
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
  this.updateHandler(p);
}

  render(){
    return (
      <div className="processData">{"PROCESS " + this.state.number}<br/>
      
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
    fetch('/AddView')
      .then(res => res.json())
  }

  componentWillUnmount() {
  
  }

  getViews = () => {
    fetch('/modelCount')
      .then(res => res.json())
      .then(mycount => alert('Views: '+mycount.Modelcount));
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
    this.setState({processes:[...this.state.processes, val]});
    //alert("Successfully added");
    //this.preview();
  }


  defineProcesses = () =>{
    var jobs = document.getElementById("numJobs").value;
    var proc = document.getElementById("numProcesses").value;
    setTimeout(() => {this.setState({numJobs: jobs,numProcesses:proc,numChildren:proc}, function(){
      //alert(this.state.numJobs+ ' '+this.state.numProcesses); 
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
          <h1>
          Auto Simulation Analysis Model Creator
          </h1>
        </div>
        <div className="MiddleOfPage">
          <div className="leftSide">
            <button onClick={this.getViews}>View Count</button><br/>

              <div className="Seperator"><h2>MODEL DEFINITION</h2></div>
              Number of jobs:<br/>
              <input id="numJobs" type="text"></input><br/>

              Number of Processes:<br/>
              <input id = "numProcesses" type="text"></input><br/>
              <button onClick={this.defineProcesses} >Define</button><br/>
              <div className="Seperator"><h2>Process Panel</h2></div>
              <ProcessPanel >
              {children}
              </ProcessPanel>
          </div>
          <div className = "rightSide">
              <h2>FORMAT:</h2>
              <h3>Distribution time</h3>
                  N:Average:stdDev<br/>  T:Low:Avg:Upper<br/>  U:Lower:Upper<br/>  C:Value<br/>
                <h3>Position Type</h3>
              0-FRONT 1-MIDDLE 2-TERMINAL<br/> 
              <h3>DownStreamConnections</h3>
              numberofConnection 1 digit,
              PID 2digits(percentage in three sig figs such as 0.00) buffer capacity with two digits, repeat<br/>
              <h3>UpstreamConnections</h3>
              numberofConnections 1 digit,(PID 2 digits,Connecting Position index), repeat<br/>
            <div className="Seperator"><h2>Model.txt</h2></div>
            <div id="docPreview">
              <button onClick={this.preview}>PREVIEW</button>
              <button onClick={this.download}>DOWNLOAD</button>
              <button onClick={this.save}>SAVE</button>
              <button onClick={this.load}>LOAD</button>
              <div className="saveandload">
              </div>
              <textarea id="modelFile" className="previewText" rows="50" col="100" placeholder="Preview of Model.txt">
              </textarea>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
