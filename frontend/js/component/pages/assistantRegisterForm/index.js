import React, {Component} from 'react';
import RegisterForm from "../../register/form/index";
import {notify, serverAddress} from "../../../scripts/index";
import axios from 'axios';
import './index.css';

export default class AssistantRegisterForm extends Component {

  constructor(props) {
    super(props);
    this.extract = this.extract.bind(this);
    this.sendData = this.sendData.bind(this);
    this.state = {
      user: {
        lastName: {
          value: null,
        }, firstName: {
          value: null,
        }, password: {
          value: null,
        }, email: {
          value: null,
        }, pid: {
          value: null,
        }
      }
    };
  }

  sendData() {
    if (this.state.user.lastName.isValid && this.state.user.firstName.isValid && this.state.user.email.isValid
      && this.state.user.password.isValid && this.state.user.pid.isValid && this.state.user.lastName.value !== null
      && this.state.user.firstName.value !== null && this.state.user.email.value !== null
      && this.state.user.password.value !== null && this.state.user.pid.value !== null) {
      axios.post(serverAddress + '/user/create', this.state.user).then((response) => {
        if (response.status === 201) {
          notify("Există deja un utilizator cu acest CNP");
        } else if (response.status === 200) {
          notify('Înregistrare efectuata cu succes');
          this.setRedirect();
        }
      });
    } else {
      notify('Anumite câmpuri nu au fost completate cu valori valide');
    }
  };

  setRedirect() {
    window.location.hash = '/main';
  }

  extract(name, value, valid) {
    this.setState(prevState => {
      return {
        user: {
          ...prevState.user,
          [name]: {
            value: value,
            isValid: valid
          }
        },
      }
    });
  }

  render() {
    return ( <div className='project-assistant-register'>
        <RegisterForm extract={this.extract} setRedirect={this.setRedirect} sendData={this.sendData}/>
      </div>
    )
  }
}