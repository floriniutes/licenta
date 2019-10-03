import React, {Component} from 'react';
import Input from '../common/input/index';
import Panel from '../common/panel/index';
import Logo from '../common/logo/index';
import Button from '../common/button/index';
import Redirect from "react-router-dom/es/Redirect";
import axios from 'axios';
import './index.css'
import {notify} from "../../scripts/index";

class Recover extends Component {

  constructor(props) {
    super(props);
    this.extract = this.extract.bind(this);
    this.state = {
      redirect: false,
      email: null
    }
  }

  recover = async () => {
    let data = await axios.post('http://localhost:8081/recover', {email: this.state.email});
    if (data.status === 200) {
      notify('Veți primi un mesaj cu noua parolă în scurt timp');
      this.setRedirect();
    } else if(data.status === 201) {
      notify('Această adresă de email nu se află în sistemul nostru')
    } else {
      notify('Contul a fost reactivat. Veți primi un mesaj cu noua parolă în scurt timp', 'error');
    }
  };

  extract(name, value) {
    this.setState({
        [name]: value
      })
  }

  setRedirect = () => {
    this.setState({
      redirect: true
    })
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to='/login'/>
    }
    else {
      return (
        <div className="project-recover">
          <Panel className='project-panel'>
            <Logo onClick={function () {
              window.location.href = "/#/main/istoric-programari/alegere"
            }}/>
            <div className='project-input-combo'>
              <Input name='email'
                     label='Email'
                     type='text'
                     extract={this.extract}/>
            </div>
            <div className='project-button-combo'>
              <Button label='Înapoi' onClick={this.setRedirect}/>
              <Button label='Recuperare parolă' onClick={this.recover}/>
            </div>
          </Panel>
        </div>
      )
    }
  }
}

export default Recover