import React, {Component} from 'react';
import './index.css';

export default class Panel extends Component {

  render() {
    return (
      <div className={this.props.className}>
        {this.props.className === 'project-content-panel' ?
          <div className='project-panel-title'>
            {window.location.hash.split('/')[2].toUpperCase()}
          </div> : null}
        {this.props.children}
      </div>
    )
  }
}