import React, {Component} from 'react';
import './index.css';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker/es/index';
import axios from 'axios';
import {serverAddress} from "../../../scripts/index";

export default class DateInput extends Component {


  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.getAppointmentsTimes = this.getAppointmentsTimes.bind(this);
    this.state = {
      startDate: null,
      timesList: [],
      prevDate: null
    }
  }


  componentDidUpdate() {
    if(this.props.dateToSearch !== this.state.prevDate && this.props.typeOfDatePicker === 'time') {
      this.setState({timesList: null});
      this.getAppointmentsTimes();
    }
  }

  componentDidMount() {
    if (this.props.typeOfDatePicker === 'time') {
      this.getAppointmentsTimes();
    }
  }

  getAppointmentsTimes() {
    this.setState({prevDate: this.props.dateToSearch});
    axios.post(serverAddress + '/consultation/getAllByDate', {date: this.props.dateToSearch}).then(response => {
      let list = [];
      for (let i = 0; i < response.data.length; i++) {
        if (list.indexOf(response.data[i].time) === -1) {
          list.push(response.data[i].time)
        }
      }
      this.setState({timesList: list})
    })
  }

  getExcludedTimes() {
    let timeList = [];

    if(this.state.timesList !== null) {
      for (let i = 0; i < this.state.timesList.length; i++) {
        timeList.push(moment().hours(this.state.timesList[i].split(":")[0]).minutes(this.state.timesList[i].split(":")[1]))
      }

      return timeList;
    }

    return null;
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });

    if (this.props.typeOfDatePicker === 'day') {
      this.props.extract(this.props.name, date.format('YYYY-MM-DD'), 2);
    } else {
      let formattedTime = date.toDate().getHours() + ':' + date.toDate().getMinutes();
      this.props.extract(this.props.name, formattedTime, 3)
    }
  }


  render() {
    return (
      <div className='project-date-input'>
        <label>{this.props.label}</label>
        {this.props.typeOfDatePicker === 'day' ? <DatePicker
          selected={this.state.startDate}
          onChange={this.handleChange}
          placeholderText={this.props.placeholder}
          maxDate={this.props.maxDate ? moment() : null}
          minDate={this.props.minDate ? moment() : null}
          popperPlacement='auto'
          filterDate={(date) => {
            if (this.props.day) {
              return date.day() === this.props.day
            } else {
              return date.day() !== null;
            }
          }}
          highlightDates={this.props.highlightDates}
          className={'date-input'}
          dateFormat='MMMM DD YYYY'
          timeCaption='time' dropdownMode='select'/> :
          <DatePicker
            selected={this.state.startDate}
            onChange={this.handleChange}
            popperPlacement='top'
            placeholderText={this.props.placeholder}
            timeIntervals={this.props.timeIntervals}
            excludeTimes={this.getExcludedTimes()}
            minTime={this.props.minTime !== null ? moment().hours(this.props.minTime.split(":")[0]).minutes(this.props.minTime.split(":")[1]):null}
            maxTime={this.props.maxTime !== null ? moment().hours(this.props.maxTime.split(":")[0]).minutes(this.props.maxTime.split(":")[1]):null}
            showTimeSelect
            showTimeSelectOnly
            className={'date-input'}
            dateFormat='hh:mm a'
            timeCaption='time' dropdownMode='select'/>
        }
      </div>
    )
  }
}