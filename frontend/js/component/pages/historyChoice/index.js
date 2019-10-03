import React, {Component} from 'react';
import './index.css';
import {choiceDoctor, choicePatient} from "../../../scripts/index";
import Tile from "../../common/tiles/tile/index";
import * as cookies from "../../app";

export default class HistoryChoice extends Component {

  renderChoices() {
    let choices = [];
    let choiceList = [];

    if(cookies.cookies.cookies.isDoctor) {
      choiceList = choiceDoctor
    } else {
      choiceList = choicePatient;
    }

    for (let i = 0; i < choiceList.length; i++) {
      choices.push(<Tile key={choiceList[i].link}
                         description={choiceList[i].description}
                         className={choiceList[i].faIcon}
                         redirect={choiceList[i].link}/>)
    }

    return choices;
  }


  render() {
    return (
      <div className='project-history-choice'>
        {this.renderChoices()}
      </div>
    )
  }
}