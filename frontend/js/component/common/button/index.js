import React, {Component} from 'react';
import ToolTip from 'react-tooltip';
import './index.css';

export default class Button extends Component {

  createToolTip() {
    return this.props.tipMessage && this.props.tipFor ?
      <ToolTip id={this.props.tipFor} className='project-button-tooltip' type='success' effect='solid'/> : null
  }

  render() {
    return (
      <div className='project-button'>
          <span data-tip={this.props.tipMessage} data-for={this.props.tipFor}>
          <button className={this.props.className} onClick={this.props.onClick}>{this.props.label}</button>
          </span>
        {this.createToolTip()}
      </div>
    )
  }
}

