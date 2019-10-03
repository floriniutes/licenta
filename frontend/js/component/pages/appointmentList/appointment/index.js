import React, {Component} from 'react';
import './index.css';
import {cookies} from '../../../app';
import Button from "../../../common/button/index";
import {notify, serverAddress} from "../../../../scripts/index";
import axios from 'axios';

export default class Appointment extends Component {

  constructor(props) {
    super(props);
    this.rescheduleAppointment = this.rescheduleAppointment.bind(this);
    this.cancelAppointment = this.cancelAppointment.bind(this);
    this.extract = this.extract.bind(this);
    this.state = {
      isHidden: false,
      startTime: null,
      started: false,
      ended: false,
      isDoctor: null
    }
  }

  componentWillMount() {
    this.setState({
      isDoctor: cookies.cookies.isDoctor
    })
  }

  extract(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  cancelAppointment = async () => {
    axios.put(serverAddress + '/consultation/abandonAppointment', {id: this.props.id});

    let userId = cookies.get('isAssistant') ? this.props.patientId : cookies.get('userId');

    let getName = await axios.get(serverAddress + '/user/getName/' + userId);

    let formattedName = getName.data[0].lastName + " " + getName.data[0].firstName;

    let details = this.props.topDetails.split(' ');

    let duration = this.props.bottomDetails.split(' ')[2];

    let data = details[1];
    let ora = details[4];
    let info;
    let id;

    if (cookies.get('isDoctor')) {
      id = this.props.userId;
      info = 'Medicul ' + formattedName + ' a fost nevoit sa anuleze programarea de pe data de ' + data;
    } else {
      id = this.props.medicId;
      info = 'Pacientul ' + formattedName + ' si-a anulat programarea de pe data de ' + data + ', ora ' + ora;
    }

    let resData = {
      time: ora,
      date: data,
      duration: duration,
      id: this.props.id,
      section: this.props.section,
      userId: cookies.get('userId'),
      medicId: this.props.medicId,
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

    this.setState({
      isHidden: true
    });

    notify('Consultația a fost anulată cu succes!');
  };

  rescheduleAppointment() {
    localStorage.setItem('oldData', JSON.stringify(this.props));
    window.location.href = '/#/main/formular-programare/reprogramare';
  }

  render() {
    return (
      <div>
        {this.state.isHidden === false ?
          <div className='project-appointment' style={cookies.cookies.isDoctor ? ({cursor: "pointer"}) : null}
               onClick={cookies.cookies.isDoctor ? () => {

                 let details = {
                   patientId: this.props.patientId,
                   medicId: this.props.medicId,
                   section: this.props.section,
                   consultationId: this.props.id
                 };

                 let props = this.props;

                 window.location.hash = "/main/lista-programari/detalii";
                 cookies.set("props", props);
                 cookies.set("details", details);
                 cookies.set("patientId", this.props.patientId);
                 cookies.set("isVisiting", true);

               } : null}>
            <div className='project-appointment-details'>
              <div className='project-appointment-side'>
                {this.props.sideData}
              </div>
              <div className='project-appointment-right'>
                <div className='project-appointment-right-top'>
                  {'Secția: ' + this.props.section + ' | ' + this.props.topDetails }
                </div>
                <div className='project-appointment-right-bottom'>
                  {this.props.bottomDetails}
                </div>
              </div>
            </div>
            <div className='project-appointment-buttons'>
              {this.state.isDoctor ?
                null :
                <div>
                  <Button tipMessage="Anulați programarea" tipFor='cancel-button' className='fas fa-times button-cancel'
                          onClick={this.cancelAppointment}/>
                  {cookies.get('isAssistant') ? null :
                  <Button tipMessage="Reprogramați-vă" tipFor='reschedule-button'
                          className='fa fa-calendar button-reschedule' onClick={this.rescheduleAppointment}/>}
                </div>
              }
            </div>
          </div> : null
        }
      </div>
    )
  }
}
