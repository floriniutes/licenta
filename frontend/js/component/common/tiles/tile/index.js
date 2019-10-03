import React, {Component} from 'react';
import './index.css';

export default class Tile extends Component {

  constructor(props) {
    super(props);
  }

  styles = {
    backgroundImage: "url(" + this.props.background + ")",
  };

  render() {
    return (
        <div className='project-tile'>
          <a href={this.props.redirect}>
            <div className='content-wrapper'>
              <div className='content-icon' style={this.styles}>
                <i className={this.props.className}/>
              </div>
              <div className='content-description'>
                <p>
                  {this.props.description}
                </p>
              </div>
            </div>
          </a>
        </div>
    )
  }
}