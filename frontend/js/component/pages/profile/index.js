import React, {Component} from 'react';
import './index.css';
import Input from "../../common/input/index";
import axios from 'axios';
import {notify, serverAddress} from "../../../scripts/index";
import {cookies} from "../../app";
import moment from "moment";
import Button from "../../common/button/index";

export default class Profile extends Component {

  constructor() {
    super();
    this.extract = this.extract.bind(this);
    this.state = {
      changePasswordOption: false,
      email: '',
      lastName: '',
      firstName: '',
      pin: '',
      phoneNumber: '',
      password: '',
    }
  }
  extract(name, value) {
    this.setState({
      [name]: value
    });
  }

  componentDidMount() {
    let isEditable = this.props.isVisiting ? false : true;

    this.setState({
      isEditable: isEditable,
      userId: cookies.get('userId')
    }, () => {
        console.log(this.state.userId);
        let id = this.props.isVisiting ? cookies.get('patientId') : this.state.userId;
        axios.get(serverAddress + '/user/get/' + id).then(response => {
            this.setState({
                email: response.data[0].email,
                lastName: response.data[0].lastName,
                firstName: response.data[0].firstName,
                pin: response.data[0].pid,
                phoneNumber: response.data[0].phoneNumber,
                password: response.data[0].password
            })
        })
    })
  }

  getBirthDate(cnp) {
    let year;
    year = parseInt(cnp[1] * 10) + parseInt(cnp[2]);
    switch (parseInt(cnp[0])) {
      case 1  :
      case 2 : {
        year = year + 1900;
      }
        break;
      case 3  :
      case 4 : {
        year += 1800;
      }
        break;
      case 5  :
      case 6 : {
        year += 2000;
      }
        break;
      case 7  :
      case 8 :
      case 9 : {
        year += 2000;
        if (year > ( parseInt(new Date().getYear(), 10) - 14 )) {
          year -= 100;
        }
      }
        break;
    }

    let month = cnp[3] + cnp[4];
    let day = cnp[5] + cnp[6];

    return day + '-' + month + '-' + year;
  }

  getAge() {
    let currentDate = moment();
    let birthDate = this.getBirthDate(this.state.pin);
    let birthDateComps = birthDate.split('-');
    let birthDateMoment = moment(birthDateComps[2] + '-' + birthDateComps[1] + '-' + birthDateComps[0]);

    let age = currentDate.diff(birthDateMoment, "years");

    return age + ' ani';
  }

  render() {
    return (
      <div className='project-profile'>
        <Input name='lastName'
               label='Nume'
               value={this.state.lastName}
               type='text'
               isDisabled={true}
               extract={this.extract}/>
        <Input name='firstName'
               label='Prenume'
               value={this.state.firstName}
               type='text'
               isDisabled={true}
               extract={this.extract}/>
        <Input name='pin'
               label='CNP'
               type='number'
               value={this.state.pin}
               isDisabled={true}
               extract={this.extract}/>
        { this.props.isVisiting ? <div>
          <Input name='birth-date'
                 label='Data nașterii'
                 value={this.getBirthDate(this.state.pin)}
                 type='text'
                 isDisabled={true}
                 isEditabled={this.state.isEditable}
                 extract={this.extract}/>
          <Input name='age'
                 label='Vârsta'
                 value={this.getAge()}
                 type='text'
                 isDisabled={true}
                 isEditabled={this.state.isEditable}
                 extract={this.extract}/>
        </div> : null
        }
        <Input name='email'
               label='Email'
               value={this.state.email}
               type='text'
               validation='email'
               isDisabled={true}
               userId={this.state.userId}
               isEditabled={this.state.isEditable}
               extract={this.extract}/>
        <Input name='phoneNumber'
               label='Număr telefon'
               value={this.state.phoneNumber}
               type='number'
               isDisabled={true}
               userId={this.state.userId}
               isEditabled={this.state.isEditable}
               extract={this.extract}/>
        { this.props.isVisiting ? null :
          <Input name='password'
                 label='Parolă'
                 value={this.state.password}
                 type='password'
                 validation='password'
                 isDisabled={true}
                 userId={this.state.userId}
                 isEditabled={this.state.isEditable}
                 extract={this.extract}/>
        }
          {this.props.isVisiting ? null :
              <Button label={<i className="fas fa-heart-broken"/>} tipMessage="Dezactivați-vă contul"
                      tipFor='cancel-button'
                      onClick={() => {
                          axios.put(serverAddress + '/user/deactivateAccount/' +  this.state.userId);
                          cookies.remove('userId');
                          cookies.remove('token');
                          cookies.remove('isDoctor');
                          cookies.remove('isAssistant');
                          location.reload();
                          notify('Contul dumneavoastră a fost dezactivat cu succes. Vă mulțumim că ați ales clinica noastră. ' +
                              'Vă puteți reactiva contul, oricând, prin introducerea credențialelor de autentificare.');
                      }}/>
          }
      </div>
    )
  }
}