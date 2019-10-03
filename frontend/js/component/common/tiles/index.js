import React, {Component} from 'react';
import Tile from './tile/index';
import {tilesAssistant, tilesPacient} from '../../../scripts/index'
import {tilesDoctor} from '../../../scripts/index'
import './index.css';
import {cookies} from "../../app";

export default class Tiles extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isDoctor: null
    }
  }

  componentWillMount() {
    this.setState({
      isDoctor: cookies.get('isDoctor')
    })
  }

  renderTileList() {
    const tileList = [];
    let tileProperties;
    tileProperties = cookies.get('isAssistant') ? tilesAssistant : cookies.get('isDoctor') ? tilesDoctor : tilesPacient;

    for (let i = 0; i < tileProperties.length; i++) {
      tileList.push(<Tile key={i} icon={tileProperties[i].faIcon} description={tileProperties[i].description}
                          background={tileProperties[i].backgroundImage} redirect={tileProperties[i].link}/>)
    }
    return tileList;
  }

  render() {
    return (
      <div className='project-tiles'>
        <div className='tile-wrapper'>
          {this.renderTileList()}
        </div>
      </div>

    )
  }
}