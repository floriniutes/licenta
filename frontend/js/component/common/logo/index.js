import React, {Component} from 'react';
import './index.css';

export default class Logo extends Component {
  render() {
    return (
      <div className='project-logo'>
        <img src="../../../img/logo.png" onClick={this.props.onClick}/>
      </div>
    )
  }
}