import React, {Component} from 'react';
import Redirect from "react-router-dom/es/Redirect";
import {notify, serverAddress} from "../../scripts/index";
import Button from '../common/button/index';
import Input from '../common/input/index';
import Panel from '../common/panel/index';
import Logo from '../common/logo/index';
import axios from'axios';
import {cookies} from '../app';
import './index.css'

class Login extends Component {

  constructor(props) {
    super(props);
    this.extract = this.extract.bind(this);
    this.state = {
      register: false,
      recoverPass: false,
      logged: false,
      user: null
    }
  }

  extract(name, value) {
    this.setState(prevState => {
      return {user: {...prevState.user, [name]: value}}
    })
  }

  getResponse = async () => {
    let data = await axios.post('http://localhost:8081/auth', this.state.user);
    if (data.status === 200) {
      let token = await data.data.token;
      let userId = await data.data.id;
      let isDoctor = await data.data.isDoctor;
      let isAssistant = await data.data.isAssistant;
      cookies.set('token', token);
      cookies.set('userId', userId);
      if (isDoctor === 1) {
        cookies.set('isDoctor', isDoctor);
      }
      if (isAssistant === 1) {
        cookies.set('isAssistant', isAssistant);
      }
    } else if (data.status === 201) {
      notify('Datele introduse nu sunt înregistrate.', 'error');
    } else {
      notify('Contul dumneavoastră a fost reactivat cu succes! Ne bucurăm că ați revenit! Vă puteți autentifica.', 'success')
    }
  };

  setLogged = async () => {
    await this.getResponse();
    this.setState({
      token: cookies.get('token')
    })
  };

  setRedirectRegister = () => {
    this.setState({
      register: true
    })
  };

  setRedirectRecoverPass = () => {
    this.setState({
      recoverPass: true
    })
  };

  render() {
    if (this.state.token) {
      return <Redirect to={{
        pathname: '/main',
        state: {
          isDoctor: true
        }
      }}/>
    }
    else if (this.state.register) {
      return <Redirect to='/register'/>
    }
    else if (this.state.recoverPass) {
      return <Redirect to='/recover'/>
    }
    else {
      return (
        <div className="project-login">
          <Panel className='project-panel'>
            <Logo onClick={ function () {
              window.location.href = "/#/pagina-prezentare"
            }
            }/>
            <div className='project-input-combo'>
              <Input name='email'
                     label='Email'
                     type='text'
                     extract={this.extract}
              />
              <Input name='password'
                     label="Parolă"
                     type="password"
                     extract={this.extract}
              />
            </div>
            <div className='project-button-combo'>
              <Button label='Autentificare' onClick={this.setLogged}/>
              <Button label='Înregistrare' onClick={this.setRedirectRegister}/>
              <Button label='Recuperare parolă' onClick={this.setRedirectRecoverPass}/>
            </div>
          </Panel>
        </div>
      )
    }
  }
}

export default Login