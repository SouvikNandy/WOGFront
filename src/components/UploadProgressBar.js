import React, { Component } from 'react';
import "../assets/css/uploadprogressbar.css";

export class UploadProgressBar extends Component {
    // upload progress bar indicator which is dragable.
    // also contain cancel upload function  

    componentDidMount(){
        let elmnt = document.getElementById("p-container")
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "-header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
          }
        
          function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
          }
        
          function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
          }

    }
    getPercentage = ()=>{
        let {loaded, total} = this.props.progressEvent;
        let percent = Math.floor((loaded* 100)/ total)
        return percent
    }
    render() {
        // let uploadPercent = this.getPercentage()
        let uploadPercent = 100;
        return (
            <div className="p-container" id="p-container">
                <div id="p-container-header">Uploading ... <span>(drag to move)</span></div>
                <div className="progress-status">
                    <div className="p-bar-identity">
                        <ProgressBar completed={uploadPercent} />
                    </div>
                    <button className="btn cancel-upload"> cancel</button>
                </div>
                
            </div>
        )
    }
}


const ProgressBar = (props) => {
    const { completed } = props;
    const containerStyles = {
        // height: 20,
        width: '100%',
        backgroundColor: "#e0e0de",
        borderRadius: '0.5rem',
    }
    
    const fillerStyles = {
        height: '100%',
        width: `${completed}%`,
        background: 'linear-gradient(315deg, #726cf8 0%, #e975a8 74%)',
        borderRadius: 'inherit',
        textAlign: 'right',
        transition: 'width 1s ease-in-out',
      }
    
    const labelStyles = {
        padding: '0.1rem 0.5rem',
        color: 'white',
        fontSize: '0.7rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    }

    return (
        <div style={containerStyles}>
            <div style={fillerStyles}>
                <span style={labelStyles}>{`${completed}%`}</span>
            </div>
        </div>
    );
}

export default UploadProgressBar
