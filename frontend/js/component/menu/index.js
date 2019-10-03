import React, {Component} from 'react';
import './index.css';
import Button from "../common/button/index";
import {cookies} from '../app';

export default class Menu extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div className={this.props.isRetracted ? 'project-menu retracted' : 'project-menu'}>
        <Button label='Acasă' onClick={function () {
          window.location.href = "/#/main"
        }}/>
        {cookies.get('isAssistant') ?
          <Button label='Înregistrați un nou pacient' onClick={function () {
            window.location.href = "/#/main/inregistrare-pacient"
          }}/> :
          <Button label='Istoric Programări' onClick={function () {
            window.location.href = "/#/main/istoric-programari/alegere"
          }}/>}
        <Button label="Deconectare" onClick={function () {
          cookies.remove('token');
          cookies.remove('userId');
          cookies.remove('isDoctor');
          cookies.remove('isAssistant');
          window.location.href = "/#/login"
        }}/>
      </div>
    )
  }
}
