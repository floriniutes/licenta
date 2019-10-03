import React, {Component} from 'react';
import './index.css';
import {cookies} from '../../app';
import axios from 'axios';
import Appointment from "./appointment/index";
import AppointmentGroup from "./appointmentGroup/index";
import {serverAddress} from "../../../scripts/index";
import Selector from "../../common/select/index";

export default class AppointmentList extends Component {

  constructor() {
    super();
    this.extract = this.extract.bind(this);
    this.getAllUserPIDs = this.getAllUserPIDs.bind(this);
    this.state = {
      renderGroups: true,
      date: null,
      isDoctor: null,
      appointments: [],
      patientId: null,
      oldId: -1
    }
  }

  componentWillMount() {
    this.setState({
      isDoctor: cookies.get('isDoctor')
    })
  }

  componentDidMount() {
    cookies.get('isAssistant') ? this.getAllUserPIDs() : null;
    this.setDays();
    !cookies.get('isAssistant') ?
    this.renderAppointmentsList() : null;
  }

  componentDidUpdate() {
    if (this.state.date !== null) {
      this.renderAppointmentsOnDay(this.state.date);
    }
    if (cookies.get('isAssistant') && this.state.patientId !== null && this.state.oldId !== this.state.patientId) {
      let oldId = this.state.patientId;
      this.setState({oldId: oldId});
      this.renderAppointmentsList()
    }
  }

  extract(name, value) {
    this.setState({
      [name]: value
    })
  }

  getAllUserPIDs() {
    axios.get(serverAddress + '/user/getAllForPID').then(response => {
      this.setState({
        users: response.data
      }, () => {
        let list = [];
        this.state.users.map(object => {
          list.push({
            label: object.pid,
            value: object.id
          });
        });
        this.setState({
          pidOptions: list
        })
      })
    })
  }

  chooseGroupOfAppointments(date) {
    this.setState({
      date: date,
      renderGroups: false
    });
  }

  getAllAppointments = async () => {
    let path;
    if (cookies.get('isDoctor')) {
      path = 'getMedicAppointments';
    } else {
      path = 'getPatientAppointments'
    }

    let userId = cookies.get('isAssistant') ? this.state.patientId : cookies.get('userId');

    let list = await axios.get(serverAddress + '/consultation/' + path + '/' + userId);
    return list;
  };

  getTodayFormatted() {
    let date = new Date();
    let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

    return date.getFullYear() + "-" + month + "-" + day;
  }

  setDays = async () => {
    let list = await this.getAllAppointments();
    let appointmentDays = [];

    for (let i = 0; i < list.data.length; i++) {
      if (appointmentDays.indexOf(list.data[i].date) === -1 && list.data[i].date >= this.getTodayFormatted()) {
        appointmentDays.push(list.data[i].date);
      }
    }

    this.setState({
      appointmentDays: appointmentDays.map(item => (
        <AppointmentGroup key={item} date={item} renderAppointments={() => {
          this.chooseGroupOfAppointments(item)
        }}/>
      ))
    });
  };

  setToDateFormat(date) {
    let dateComps = date.split('/');
    return new Date(dateComps[2] + "-" + dateComps[1] + "-" + dateComps[0]);
  }

  determineDifferenceBetweenDates(date) {
    let diffTime = date.getTime() - new Date().getTime();
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  createAppointmentElement(data, name, timeComps) {
    return (<Appointment key={data.id}
                         id={data.id}
                         section={data.section}
                         patientId={data.userId}
                         medicId={data.medicId}
                         date={data.date}
                         sideData={name.data[0].firstName + " " + name.data[0].lastName}
                         topDetails={"Data: " + data.date + " | Ora: " + timeComps[0] + ":" + timeComps[1]}
                         bottomDetails={"Durata estimată: " + data.duration + " de minute"}/>)
  }

  renderAppointmentsOnDay = async (date) => {

    let list = await this.getAllAppointments();

    let appointmentList = [];

    appointmentList.push(<div key='back-button' className='project-appointment-list-back fa fa-arrow-circle-left'
                              onClick={() => {
                                this.setState({renderGroups: true});
                              }
                              }/>);
    for (let i = 0; i < list.data.length; i++) {
      let id;
      if (cookies.cookies.isDoctor) {
        id = list.data[i].userId;
      } else {
        id = list.data[i].medicId;
      }
      if (list.data[i].date === date) {
        let name = await axios.get(serverAddress + '/user/getName/' + id);
        let formattedDate = this.setToDateFormat(list.data[i].date);
        if (this.determineDifferenceBetweenDates(formattedDate) >= 0) {
          let timeComps = list.data[i].time.split(':');
          if (timeComps[1].length === 1)
            timeComps[1] = "0" + timeComps[1];
          appointmentList.push(this.createAppointmentElement(list.data[i], name, timeComps))
        }
      }
    }
    this.setState({appointmentListMedic: appointmentList});
    this.setState({date: null})
  };

  renderAppointmentsList = async () => {

    let list = await this.getAllAppointments();

    let appointmentList = [];
    if (list.data.length !== 0 && list.data !== null) {
      for (let i = 0; i < list.data.length; i++) {
        let id;
        if (cookies.get('isDoctor')) {
          id = list.data[i].userId;
        } else {
          id = list.data[i].medicId;
        }
        let name = await axios.get(serverAddress + '/user/getName/' + id);
        let formattedDate = this.setToDateFormat(list.data[i].date);
        if (this.determineDifferenceBetweenDates(formattedDate) >= 0) {
          let timeComps = list.data[i].time.split(':');
          if (timeComps[1].length === 1)
            timeComps[1] = "0" + timeComps[1];
          appointmentList.push(this.createAppointmentElement(list.data[i], name, timeComps))
        }
      }
    }

    if(appointmentList.length === 0) {
      appointmentList.push('Nu există programări înregistrate');
    }

    this.setState({appointmentListPatient: appointmentList});
  };

  render() {
    return (
      <div className='project-appointment-list'>
        {cookies.get('isAssistant') ? <Selector options={this.state.pidOptions}
                                                id="-1"
                                                name='patientId'
                                                value={this.state.patientId}
                                                extract={this.extract}
                                                label='Alegeti CNP-ul pacientului'/> : null}
        {cookies.get('isAssistant') && this.state.patientId !== null ? this.state.appointmentListPatient :
            this.state.isDoctor ?
              this.state.renderGroups ? this.state.appointmentDays : this.state.appointmentListMedic
              : this.state.appointmentListPatient}
      </div>
    )
  }
}