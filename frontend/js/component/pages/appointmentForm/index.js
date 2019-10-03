import React, {Component} from 'react';
import Selector from '../../common/select/index';
import Button from "../../common/button/index";
import './index.css';
import moment from "moment";
import DateInput from "../../common/datepicker/index";
import axios from 'axios';
import {notify, serverAddress} from "../../../scripts/index";
import {cookies} from '../../app';
import Input from "../../common/input/index";

export default class AppointmentForm extends Component {

  constructor(props) {
    super(props);
    this.extract = this.extract.bind(this);
    this.sendForm = this.sendForm.bind(this);
    this.getAllUserPIDs = this.getAllUserPIDs.bind(this);
    this.getAllSections = this.getAllSections.bind(this);
    this.getSectionId = this.getSectionId.bind(this);
    this.getAllAvailabilities = this.getAllAvailabilities.bind(this);
    this.state = {
      optionsArray: [false, false, false, false],
      options: {
        section: null,
        medic: null,
        date: null,
        time: null,
        patientId: null
      },
      sectionOptions: [],
      medics: [],
      startDate: moment(),
      timesList: []
    }
  }

  componentWillMount() {

    this.setState({
        userId: cookies.get('userId')
    }, ()=>{
        console.log(this.state);
    });

    if (cookies.get('isDoctor')) {
      window.location.hash = "/main";
    }
    if (location.hash.split('/')[location.hash.split('/').length - 1] === "reprogramare") {
      let data = JSON.parse(localStorage.getItem('oldData'));
      this.setState({
        oldData: {
          id: data.id,
          date: data.topDetails.split(' ')[1],
          time: data.topDetails.split(' ')[4],
          duration: data.bottomDetails.split(' ')[2],
          medicId: data.medicId,
          section: data.section
        },
        options: {
          medic: data.sideData,
          section: 'Urologie'
        }
      });
    }

    cookies.get('isAssistant') ? this.getAllUserPIDs() : null;
    this.getAllSections();
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

  getSomething(options) {
    let list = [];
    for (let i = 0; i < options.length; i++) {
      list.push(options[i].userId);
    }
    this.getMedicsByIds(list);
  }

  getAvailabilityData() {
    let index = this.state.availabilities.findIndex(object => object.userId === this.getMedicId(this.state.options.medic));
    return this.state.availabilities[index];
  }

  getAllAvailabilities(section) {
    axios.get(serverAddress + '/availability/getAll/' + (this.getSectionId(section) + 1)).then(response => {
      this.setState({
        availabilities: response.data
      }, () => {
        this.getSomething(this.state.availabilities);
      })
    });
  }

  getMedicId(medic) {
    let names = medic.split(" ");
    let firstName = names[1];
    let lastName = names[0];
    let id = this.state.medics.findIndex(object => object.firstName === firstName && object.lastName === lastName);


    return this.state.medics[id].id;
  }

  getMedicsOptions() {
    let list = [];
    this.state.medics.map(object => {
      list.push({
        label: object.lastName + " " + object.firstName,
        value: object.lastName + " " + object.firstName
      });
    });

    return list;
  }

  getMedicsByIds(listOfIds) {
    axios.post(serverAddress + '/user/getMedicsByAvailability', {listOfIds}).then((response) => {
      this.setState({
        medics: response.data
      }, () => {
        if (location.hash.split('/')[location.hash.split('/').length - 1] === "reprogramare")
          this.setState({
            optionsArray: [true, true, false, false]
          })
      })
    })
  }

  getSectionId(section) {
    return this.state.sectionOptions.findIndex(obj => obj.name === section);
  }

  getAllSections() {
    axios.get(serverAddress + '/section/getAll').then(response => {
      this.setState({
        sectionOptions: response.data
      }, () => {
        if (location.hash.split('/')[location.hash.split('/').length - 1] === "reprogramare") {
          this.setState({
            optionsArray: [true, false, false, false],
            options: {
              section: 'Urologie',
              medic: 'Popescu Andrei'
            }
          }, () => {
            this.getAllAvailabilities(this.state.options.section);
          });
        }
      })
    });
  }

  extract(name, value, index) {
    if (index === "0") {
      this.setState(prevState => {
        return {
          options: {...prevState.options, medic: null},
        }
      })
    }

    let options = this.state.optionsArray;
    if (index !== "-1") {
      for (let i = index; i < this.state.optionsArray.length; i++) {
        options[i] = false;
      }
    }

    options[index] = true;

    this.setState(prevState => {
      return {
        options: {...prevState.options, [name]: value},
        optionsArray: options
      }
    }, () => {
      if (this.state.optionsArray[1] === false) {
        this.getAllAvailabilities(this.state.options.section);
      }
    });

  }

  getSectionOptions() {
    let list = [];
    this.state.sectionOptions.map(object => {
      list.push({
        label: object.name,
        value: object.name
      });
    });

    return list;
  };



  sendForm = async () => {
      if (cookies.get('isAssistant') && this.state.options.patientId === null) {
          notify('Trebuie sa alegeți CNP-ul pacientului pe care doriți să-l programați', 15000)
      } else {
          let minutes = parseInt(this.state.options.time.split(':')[1]);
          let hours = parseInt(this.state.options.time.split(':')[0]);

          if (minutes < 10) {
              minutes = '0' + minutes;
          }

          if (hours < 10) {
              hours = '0' + hours;
          }

          let userId = cookies.get('isAssistant') ? this.state.options.patientId : this.state.userId;

          let data = {
              userId: userId,
              time: hours + ':' + minutes,
              date: this.state.options.date,
              section: this.state.options.section,
              medicId: this.getMedicId(this.state.options.medic),
              duration: this.getAvailabilityData().consultationDuration,
          };

          let getName = await axios.get(serverAddress + '/user/getName/' + userId);

          let formattedName = getName.data[0].lastName + " " + getName.data[0].firstName;

          let info = 'Pacientul ' + formattedName + ' s-a programat pentru o consultație la secția de ' + data.section + ' pentru data de ' + data.date + ' ora ' + data.time;
          let medicId = data.medicId;

          axios.post(serverAddress + '/notification/create', {text: info, userId: medicId});
          let dataStatus = await axios.post(serverAddress + '/consultation/create', {data});

          let notificationMessage = 'V-ați programat cu succes.\n' +
              'Va trebui să aveți la dumneavoastră:\n' +
              '- actul propriu de identitate\n- trimitere de la medicul specialist\n- cardul de sănătate';

          if (location.hash.split('/')[location.hash.split('/').length - 1] === 'reprogramare') {
              let resData = {
                  id: this.state.oldData.id,
                  time: this.state.oldData.time,
                  date: this.state.oldData.date,
                  duration: this.state.oldData.duration,
                  section: this.state.oldData.section,
                  medicId: this.state.oldData.medicId,
                  userId: this.state.userId
              };

              let info = 'S-a eliberat un loc pe data ' + resData.date + ', ora ' + resData.time + '. Doriți să vă reprogramați?';

              axios.post(serverAddress + '/notification/createRescheduleNotif', {
                  userId: resData.userId,
                  medicId: resData.medicId, date: resData.date, section: resData.section,
                  additional: JSON.stringify(resData), text: info
              });

              axios.post(serverAddress + '/consultation/rescheduleAppointment', {resData});

              notificationMessage = 'Reprogramare cu succes!';
          }

          if (dataStatus.status === 200) {
              notify(notificationMessage);
              localStorage.clear();
              window.location.hash = '/main';
          } else if (dataStatus.status === 201) {
              notify('Cineva s-a programat pe acest loc. Încercați o altă oră');
              window.location.reload();
          }
      }
  };

  renderSecondOption() {
    return (
      <Selector options={this.getMedicsOptions()}
                id="1"
                name='medic'
                value={this.state.options.medic}
                extract={this.extract}
                label='Alegeti medicul'/> )
  }

  render() {
    return (
      <div className='project-appointment-form'>
        <div className='project-appointment-form-input'>
          {cookies.get('isAssistant') ? <Selector options={this.state.pidOptions}
                                                  id="-1"
                                                  name='patientId'
                                                  value={this.state.options.patientId}
                                                  extract={this.extract}
                                                  label='Alegeti CNP-ul pacientului'/> : null}
          {location.hash.split('/')[location.hash.split('/').length - 1] === "reprogramare" ?
            <div>
              <Input name='lastName'
                     label='Secție'
                     type='text'
                     value={this.state.options.section}
                     extract={this.extract}
                     isDisabled={true}/>
              <Input name='lastName'
                     label='Medic'
                     type='text'
                     value={this.state.options.medic}
                     extract={this.extract}
                     isDisabled={true}/>
            </div> :
            <div>
              <Selector options={this.getSectionOptions()}
                        id="0"
                        name='section'
                        value={this.state.options.section}
                        extract={this.extract}
                        label='Alegeti sectia'/>
              {this.state.options.section !== null && this.state.optionsArray[0] === true ?
                this.renderSecondOption() : null }
            </div>}
          {this.state.options.medic !== null && this.state.optionsArray[1] === true ?
            <DateInput typeOfDatePicker={"day"}
                       placeholder='Alegeți'
                       name="date"
                       label={'Alegeți ziua'}
                       minDate={true}
                       day={this.getAvailabilityData().consultationDay}
                       extract={this.extract}/>
            : null}
          {this.state.options.date !== null && this.state.optionsArray[2] === true && this.state.availabilities !== null ?
            <DateInput typeOfDatePicker={"time"}
                       placeholder='Alegeți'
                       name="time"
                       dateToSearch={this.state.options.date}
                       excludedTimes={this.state.timesList}
                       minTime={this.getAvailabilityData().startTime}
                       maxTime={this.getAvailabilityData().endTime}
                       timeIntervals=
                         {this.getAvailabilityData().consultationDuration}
                       label={'Alegeți ora'}
                       extract={this.extract}/>
            : null}
        </div>
        {this.state.options.time !== null && this.state.optionsArray[3] === true ?
          <Button label='Finalizați programarea'
                  onClick={this.sendForm}/>
          : null}
      </div>
    )
  }
}