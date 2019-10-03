import React, {Component} from 'react';
import Input from "../../common/input/index";
import {cookies} from '../../app';
import Button from "../../common/button/index";

export default class RegisterForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='project-register-form'>
        <div className='project-register-input-combo'>
          <Input name='lastName'
                 label='Nume'
                 type='text'
                 extract={this.props.extract}
                 validation='lettersOnly'/>
          <Input name='firstName'
                 label='Prenume'
                 type='text'
                 extract={this.props.extract}
                 validation='lettersOnly'/>
          <Input name='email'
                 label='Email'
                 type='text'
                 validation='email'
                 extract={this.props.extract}/>
          <Input name='pid'
                 label='CNP'
                 type='number'
                 extract={this.props.extract}
                 validation='pin'/>
          <Input name='phoneNumber'
                 label='Număr telefon'
                 type='number'
                 extract={this.props.extract}
                 validation='phoneNumber'/>
          <Input name='password'
                 label='Parolă'
                 type='password'
                 extract={this.props.extract}
                 validation='password'/>
        </div>
        <div className='project-button-combo'>
            {cookies.get('isAssistant') ? null :
                <Button label='Înapoi' onClick={this.props.setRedirect}/>}
          <Button label='Înregistrare' onClick={this.props.sendData}/>
        </div>
      </div>
    )
  }
}