import React, {Component} from 'react';
import './index.css';
import Button from "../button/index";
import {cookies} from "../../app";
import {GDPRMessage} from "../../../scripts/index";

export default class GDPR extends Component {

  render() {
    return(
      <div className="project-gdpr">
        <p>{GDPRMessage}</p>
        <Button label='Am înțeles' onClick={() => {
          cookies.set('Consent', 1);
          document.querySelector('.project-gdpr').style.display = 'none';
        }}/>
      </div>
    )
  }
}