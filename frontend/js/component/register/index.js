import React, {Component} from 'react';
import Panel from '../common/panel/index';
import Logo from '../common/logo/index';
import './index.css'
import Redirect from 'react-router-dom/es/Redirect';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import RegisterForm from "./form/index";
import {notify, serverAddress} from "../../scripts/index";

class Register extends Component {

  constructor(props) {
    super(props);
    this.extract = this.extract.bind(this);
    this.setRedirect = this.setRedirect.bind(this);
    this.sendData = this.sendData.bind(this);
    this.state = {
      redirect: false,
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
          notify('Există deja un utilizator cu acest CNP', 'error');
        } else if (response.status === 200) {
          notify('Inregistrare cu succes', 'success');
          this.setRedirect();
        }
      });
    } else {
      notify('Anumite câmpuri nu au fost completate cu valori valide', 'error');
    }
  };

  setRedirect() {
    this.setState({
      redirect: true
    })

  };

  extract(name, value, valid) {
    this.setState(prevState => {
      return {
        user: {
          ...prevState.user,
          [name]: {
            value: value,
            isValid: valid
          }},
      }
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to='/login'/>
    }
    else {
      return (
        <div className='project-register'>
          <Panel className='project-panel'>
            <Logo onClick={function () {
              window.location.href = "/#/main/istoric-programari/alegere"
            }}/>
            <RegisterForm setRedirect={this.setRedirect} extract={this.extract} sendData={this.sendData}/>
          </Panel>
        </div>
      )
    }
  }
}

export default Register