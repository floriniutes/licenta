import React, {Component} from 'react';
import CompletedAppointment from "./completedAppointment/index";
import {Calendar} from "react-calendar";
import './index.css';
import Selector from "../../common/select/index";
import DateInput from "../../common/datepicker/index";
import moment from "moment";
import {cookies} from "../../app";
import axios from "axios";
import {serverAddress} from "../../../scripts/index";
export default class AppointmentHistory extends Component {

  constructor() {
    super();
    this.determineDates = this.determineDates.bind(this);
    this.createPatientList = this.createPatientList.bind(this);
    this.renderAllHistories = this.renderAllHistories.bind(this);
    this.renderAll = this.renderAll.bind(this);
    this.extract = this.extract.bind(this);
    this.state = {
      searchName: null,
      renderGroupNames: null,
      name: null,
      prevName: null,
      type: null,
      date: null,
      prevDate: null
    }
  }

  componentWillMount() {
    let location = window.location.hash.split('/');
    let type = location[location.length - 1];

    this.setState({
      type: type
    });

    let path;
    if (cookies.get('isDoctor')) {
      path = 'getAllMedicHistories';
    } else {
      path = 'getAllPatientHistories';
    }

    axios.get(serverAddress + '/history/' + path + '/' + cookies.get('userId')).then((response) => {
      this.setState({
        historyList: response.data
      }, () => {
        this.setState({
          dates: this.determineDates(),
        });
        this.createPatientList();
        this.renderAll();
      })
    });
  }

  componentDidUpdate() {
    if (this.state.date !== null && this.state.prevDate !== this.state.date) {
      this.renderByDate();
      this.setState({prevDate: this.state.date})
    }
    if (this.state.name !== null && this.state.prevName !== this.state.name) {
      this.renderByPatient(this.state.name);
      this.setState({prevName: this.state.name})
    }
  }

  extract(name, value) {
    this.setState({
      [name]: value
    })
  }

  renderByPatient = async (name) => {
    let list = this.state.historyList;
    let completedAppointments = [];
    let avgTime = 0;

    for (let i = 0; i < list.length; i++) {

      avgTime += parseInt(list[i].comments.split(' ')[1]);

      let id;
      if (cookies.get('isDoctor')) {
        id = list[i].userId;
      } else {
        id = list[i].medicId;
      }

      let getName = await axios.get(serverAddress + '/user/getName/' + id);
      let formattedName = getName.data[0].lastName + " " + getName.data[0].firstName;

      if (formattedName === name)
        completedAppointments.push(this.createCompletedAppointment(list[i], formattedName))
    }

    completedAppointments.length > 0 ?
      completedAppointments.push(
        <div key='avgTime' className="project-appointment-history-avg-time">
          Durata medie a consultațiilor este de {Math.floor(avgTime/completedAppointments.length)} minute
        </div>) : null;

    this.setState({
      historyPatient: completedAppointments
    })
  };

  createCompletedAppointment(data, formattedName) {
    return (<CompletedAppointment key={data.id}
                                  medic={formattedName}
                                  details={"Data: " + data.date + " " + " | " + " Secție: " + data.section}
                                  comments={data.comments}/>)
  }

  determineDates() {
    let dates = [];

    let list = this.state.historyList;

    for (let i = 0; i < list.length; i++) {
      if (dates.indexOf(list[i].date) === -1) {
        dates.push(list[i].date);
      }
    }

    let dates2 = [];
    for (let i = 0; i < dates.length; i++) {
      dates2.push(moment(dates[i]));
    }

    return dates2;
  }

  renderByDate = async () => {
    let completedAppointments = [];
    let list = this.state.historyList;
    let avgTime = 0;

    for (let i = 0; i < list.length; i++) {
      if (list[i].date === this.state.date) {

        avgTime += parseInt(list[i].comments.split(' ')[1]);

        let id;
        if (cookies.get('isDoctor')) {
          id = list[i].userId;
        } else {
          id = list[i].medicId;
        }

        let name = await axios.get(serverAddress + '/user/getName/' + id);
        let formattedName = name.data[0].lastName + " " + name.data[0].firstName;

        completedAppointments.push(this.createCompletedAppointment(list[i], formattedName))
      }
    }

    completedAppointments.length > 0 ?
      completedAppointments.push(
        <div key='avgTime' className="project-appointment-history-avg-time">
          Durata medie a consultațiilor este de {Math.floor(avgTime/completedAppointments.length)} minute
        </div>) : null;

    if (completedAppointments.length === 0) {
      completedAppointments.push(<p key='no-existence-message'>Nu există programări pentru această dată</p>);
      this.setState({
        history: completedAppointments
      })
    }
    else {
      this.setState({
        history: completedAppointments
      })
    }
  };

  createPatientList = async () => {
    let list = this.state.historyList;
    let list2 = [];

    for (let i = 0; i < list.length; i++) {
      let id;
      if (cookies.get('isDoctor')) {
        id = list[i].userId;
      } else {
        id = list[i].medicId;
      }

      let name = await axios.get(serverAddress + '/user/getName/' + id);
      let formattedName = name.data[0].lastName + " " + name.data[0].firstName;

      if (list2.findIndex(obj => obj.label === formattedName) === -1) {
        list2.push({
          value: formattedName,
          label: formattedName
        })
      }
    }

    this.setState({names: list2});
  };

  renderWithPatients() {
    return (
      <div>
        <Selector options={this.state.names}
                  id="0"
                  name='name'
                  value={this.state.name}
                  extract={this.extract}
                  label={cookies.get('isDoctor') ? 'Alegeti pacientul' : 'Alegeți medicul'}/>
        {this.state.name ? this.state.historyPatient : null }
      </div>
    )
  }

  renderWithCalendar() {
    return (
      <div>
        <DateInput typeOfDatePicker={"day"}
                   placeholder='Alegeți'
                   highlightDates={this.state.dates}
                   name="date"
                   maxDate={true}
                   label='Alegeți ziua'
                   extract={this.extract}/>
        {this.state.date ? this.state.history : null}
      </div>)
  }

  renderAll = async () => {
    let completedAppointments = [];
    let list = this.state.historyList;
    let avgTime = 0;

    for (let i = 0; i < list.length; i++) {

      avgTime += parseInt(list[i].comments.split(' ')[1]);

      let id;
      if (cookies.get('isDoctor')) {
        id = list[i].userId;
      } else {
        id = list[i].medicId;
      }

      let name = await axios.get(serverAddress + '/user/getName/' + id);

      let formattedName = name.data[0].lastName + " " + name.data[0].firstName;

      completedAppointments.push(this.createCompletedAppointment(list[i], formattedName))
    }

    completedAppointments.length > 0 ?
      completedAppointments.push(
        <div key='avgTime' className="project-appointment-history-avg-time">
          Durata medie a consultațiilor este de {Math.floor(avgTime/completedAppointments.length)} minute
        </div>) : null;

    this.setState({allHistories: completedAppointments})
  };


  renderAllHistories() {
    return (
      <div>
        {this.state.allHistories ? this.state.allHistories.length !== 0 ? this.state.allHistories :
          <p> Nu există nicio programare efectuată </p> : <p> Nu există nicio programare efectuată </p>}
      </div>
    )
  }

  render() {
    return (
      <div className='project-appointment-history'>
        {this.state.type !== null ?
          <div className='project-appointment-list-back fa fa-arrow-circle-left' onClick={() => {
            window.location.hash = 'main/istoric-programari/alegere';
          }}/> : null}
        {this.state.type === 'data' ? this.renderWithCalendar() :
          this.state.type === 'nume' ? this.renderWithPatients() :
            this.state.type === 'arhiva' ? this.renderAllHistories() : null
        }
      </div>
    )
  }
}