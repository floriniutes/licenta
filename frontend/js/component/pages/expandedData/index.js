import React, {Component} from 'react';
import './index.css';
import axios from 'axios';
import {cookies} from "../../app";
import Profile from "../profile/index";
import {serverAddress} from "../../../scripts/index";
import CompletedAppointment from "../appointmentHistory/completedAppointment/index";
import Button from "../../common/button/index";

export default class ExpandedData extends Component {


  constructor() {
    super();
    this.startAppointment = this.startAppointment.bind(this);
    this.endAppointment = this.endAppointment.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.extract = this.extract.bind(this);
    this.state = {
      startTime: null,
      started: false,
    };
  }

  componentDidMount() {
    cookies.get('isVisiting') && cookies.get('details') && cookies.get('patientId') && cookies.get('props') ?
      axios.post(serverAddress + '/history/getPatientHistories', {
        patientId: cookies.get('details').patientId,
        medicId: cookies.get('details').medicId, section: cookies.get('details').section
      }).then((response) => {
        this.setState({
          list: response.data,
          props: cookies.get('props')
        }, () => {
          this.renderAll();
        })
      }) : window.location.hash = '/main/lista-programari/list';
  }

  extract(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  renderAll = async () => {
    let completedAppointments = [];
    let list = this.state.list;
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

      this.setState({allHistories: completedAppointments}) : null;
  };

  createCompletedAppointment(data, formattedName) {
    return (<CompletedAppointment key={data.id}
                                  medic={formattedName}
                                  details={"Data: " + data.date + " " + " | " + " Secție: " + data.section}
                                  comments={data.comments}/>)
  }

  startTimer(duration, display) {
    let details = this.state.props.bottomDetails;
    let timer = duration, minutes, seconds;
    setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.innerText = details + " Timp ramas: " + minutes + ":" + seconds;

      if (--timer < 0) {
        timer = 0;
      }
    }, 1000);
  }


  startAppointment() {
    let minutes = 60 * this.state.props.bottomDetails.split(' ')[2];
    let display = document.querySelector('.project-current-details');
    this.setState({
      startTime: new Date().getTime(),
      started: true
    });

    this.startTimer(minutes, display);
  }

  endAppointment() {
    let duration = Math.round(((new Date().getTime() - this.state.startTime) / 1000 ) / 60);
    this.setState({
      isHidden: true
    });

    let existingComments;
    if (this.state.comments === undefined || this.state.comments === null || this.state.comments === '') {
      existingComments = '-';
    } else {
      existingComments = this.state.comments;
    }

    let comments = "Durată: " + duration + " minute\n" + "| Mențiuni:\n" + existingComments;
    axios.put(serverAddress + '/consultation/completeAppointment', {id: this.state.props.id});
    axios.post(serverAddress + '/history/create', {
      comments: comments,
      section: this.state.props.section,
      userId: this.state.props.patientId,
      medicId: cookies.cookies.userId,
      date: this.state.props.date
    });

    this.moveToList();
  }

  cancelAppointment = async () => {
    axios.put(serverAddress + '/consultation/abandonAppointment', {id: this.state.props.id});
    let getName = await axios.get(serverAddress + '/user/getName/' + cookies.get('userId'));

    let formattedName = getName.data[0].lastName + " " + getName.data[0].firstName;

    let details = this.state.props.topDetails.split(' ');

    let duration = this.state.props.bottomDetails.split(' ')[2];

    let data = details[1];
    let ora = details[4];
    let info;
    let id;

    if (cookies.get('isDoctor')) {
      id = cookies.get("patientId");
      info = 'Medicul ' + formattedName + ' a fost nevoit sa anuleze programarea de pe data de ' + data;
    } else {
      id = this.state.props.medicId;
      info = 'Pacientul ' + formattedName + ' si-a anulat programarea de pe data de ' + data + ', ora ' + ora;
    }

    let resData = {
      time: ora,
      date: data,
      duration: duration,
      id: this.state.props.id,
      section: this.state.props.section,
      userId: cookies.get('userId'),
      medicId: this.state.props.medicId,
    };

    let resInfo = 'S-a eliberat un loc pe data ' + resData.date + ', ora ' + resData.time + '. Doriți să vă reprogramați?';

    axios.post(serverAddress + '/notification/createRescheduleNotif', {
      userId: resData.userId,
      medicId: resData.medicId,
      section: resData.section,
      date: resData.date,
      additional: JSON.stringify(resData),
      text: resInfo
    });
    axios.post(serverAddress + '/notification/create', {userId: id, text: info});

    this.moveToList();
  };

  moveToList() {
    window.location.hash = '/main/lista-programari/list';

    cookies.remove('props');
    cookies.remove('isVisiting');
    cookies.remove('details');
    cookies.remove('patientId');
  }

  render() {
    return (
      <div className='project-expanded-data'>
        <span className='project-appointment-list-details-back fa fa-arrow-circle-left'
              onClick={() => {
                cookies.remove('props');
                cookies.remove('isVisiting');
                cookies.remove('details');
                cookies.remove('patientId');
                window.location.hash = '/main/lista-programari/list';
              }}/>
        <div className='project-expanded-data-profile'>
          <label className='project-expanded-data-label'>Date pacient</label>
          <Profile isVisiting={cookies.get('patientId')}/>
        </div>
        <div className='project-expanded-data-history'>
          <label className='project-expanded-data-label'>Consultații anterioare</label>
          {this.state.allHistories ? this.state.allHistories : <p>Nu există consultații anterioare</p>}
        </div>
        <div className='project-expanded-data-current-appointment'>
          <label className='project-expanded-data-label'> Consultație actuală</label>
          <div className='project-current-details'>Detalii consultație</div>
          <Button className='fas fa-times button-cancel' tipMessage="Anulați consultația" tipFor='cancel-button'
                  onClick={this.cancelAppointment}/>
          {this.state.started === false ?
            <Button className='fas fa-play button-reschedule' tipMessage="Începeți consultația" tipFor='start-button'
                    onClick={this.startAppointment}/> :
            <div className="project-button-comment-combo">
              <Button className='fas fa-check button-reschedule' tipMessage="Încheiați consultația" tipFor='end-button'
                      onClick={this.endAppointment}/>
              <div>
                <textarea placeholder="Comnetarii" onChange={this.extract} name="comments"/>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}