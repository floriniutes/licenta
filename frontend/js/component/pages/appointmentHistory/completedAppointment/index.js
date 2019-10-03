import React, {Component} from 'react';
import './index.css';

export default class CompletedAppointment extends Component {

  extendComments(event) {
    let target;
    if (event.target.classList.contains('fa')) {
      target = event.target.parentElement.parentElement;
    } else {
      target = event.target.parentElement;
    }
    if (target.querySelector('.project-completed-appointment > .retracted')) {
      target.children[3].classList.remove('retracted');
      target.children[2].children[0].classList.remove('fa-chevron-right');
      target.children[2].children[0].classList.add('fa-chevron-down');
    } else {
      target.children[3].classList.add('retracted');
      target.children[2].children[0].classList.remove('fa-chevron-down');
      target.children[2].children[0].classList.add('fa-chevron-right');
    }
  }

  render() {
    return (
      <div className='project-completed-appointment'>
        <div className='project-completed-appointment-medic' onClick={this.extendComments}>
          {this.props.medic}
        </div>
        <div className='project-completed-appointment-details' onClick={this.extendComments}>
          {this.props.details}
        </div>
        {this.props.comments !== null && this.props.comments !== '' ? this.props.comments !== undefined ?
          <div className='project-completed-appointment-extend'>
            <span className='fa fa-chevron-right' onClick={this.extendComments}/>
          </div> : null : null}
        {this.props.comments !== null && this.props.comments !== '' && this.props.comments !== undefined ?
          <div className='project-completed-appointment-comments retracted' onClick={this.extendComments}>
            {this.props.comments}
          </div> : null }
      </div>
    )
  }
}