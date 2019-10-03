import React, {Component} from 'react';
import './index.css';
import {
  notify,
  serverAddress,
  validateEmail, validateLettersOnly, validatePassword, validatePhoneNumber, validatePid,
  validationWarning
} from '../../../scripts/index';
import Button from '../button/index';
import axios from 'axios';
import {cookies} from "../../app";

export default class Input extends Component {

  constructor(props) {
    super(props);
    this.validate = this.validate.bind(this);
    this.getWarningText = this.getWarningText.bind(this);
    this.state = {
      disabled: this.props.isDisabled,
      isValid: true
    }
  }

  validate(event) {

    let valid = true;
    if (this.props.validation === 'pin') {
      valid = validatePid(event.target.value);
    }
    else if (this.props.validation === 'email') {
      valid = validateEmail(event.target.value)
    }
    else if (this.props.validation === 'password') {
      valid = validatePassword(event.target.value)
    }
    else if (this.props.validation === 'lettersOnly') {
      valid = validateLettersOnly(event.target.value)
    }
    else if (this.props.validation === 'phoneNumber') {
      valid = validatePhoneNumber(event.target.value)
    }

    if (valid === false) {
      event.target.style.border = '3px solid #D93D25';
    } else {
      event.target.style.border = '1px solid lightgray';
    }

    this.setState({isValid: valid});

    this.props.extract(event.target.name, event.target.value, valid);
  }

  getWarningText() {
    for (let i = 0; i < validationWarning.length; i++) {
      if (validationWarning[i].validationType === this.props.validation) {
        return validationWarning[i].text;
      }
    }
  }

  updateData() {
    axios.put(serverAddress + '/user/update/' + this.props.userId, {[this.props.name]: this.props.value}).then(response => {
      if (response.status === 200) {
        notify('Actualizare cu success');
      } else if (response.status === 404 || response.status === 500) {
        notify('Error');
      }
    });

    return true;
  }

  render() {
    return (
      <div className='project-input'>
        <div className='project-input-combo'>
          <div className='project-input-label'>
            <label>{this.props.label}</label>
          </div>
          <input
            disabled={(this.state.disabled) ? 'disabled' : ''}
            name={this.props.name}
            type={this.props.type}
            placeholder={this.props.label}
            value={this.props.value}
            onChange={this.validate}
          />
          {this.state.isValid ? null :
            <span className='project-input-validation-warning'>
              {this.getWarningText()}
            </span>
          }
        </div>
        {this.props.isEditabled ?
          <div className='project-input-buttons'>
            <Button className={this.state.disabled ? 'fas fa-pencil-alt' : 'fas fa-save'}
                    tipMessage={this.state.disabled ? 'Schimbați ' + this.props.label.toLowerCase()
                      : 'Salvați modificările'}
                    tipFor='edit-button' onClick={() => {
              let disabled;
              this.state.disabled ? disabled = false : this.state.isValid ? disabled = this.updateData() : notify('Valori incorecte');
              this.setState({
                disabled: disabled
              });
            }
            }/>
          </div> : null}
      </div>
    )
  }
}
