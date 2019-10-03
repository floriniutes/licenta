import React, {Component} from 'react';
import './index.css';
import Switch from "react-router-dom/es/Switch";
import Panel from "../common/panel/index";
import Route from "react-router-dom/es/Route";
import Notification from "../pages/notification/index";
import AppointmentForm from "../pages/appointmentForm/index";
import SettingsCustomer from "../pages/profile/index";
import AppointmentList from "../pages/appointmentList/index";
import AppointmentHistory from "../pages/appointmentHistory/index";
import HistoryChoice from "../pages/historyChoice/index";
import ExpandedData from "../pages/expandedData/index";
import AssistantRegisterForm from "../pages/assistantRegisterForm/index";

export default class Content extends Component {


  render() {
    return (
      <Panel className='project-content-panel'>
        <Switch>
          <Route path='/main/formular-programare' component={AppointmentForm}/>
          <Route path='/main/inregistrare-pacient' component={AssistantRegisterForm}/>
          <Route path='/main/notificari' component={Notification}/>
          <Route path='/main/profil' component={SettingsCustomer}/>
          <Route path='/main/lista-programari/list' component={AppointmentList}/>
          <Route path='/main/lista-programari/detalii' component={ExpandedData}/>
          <Route path='/main/istoric-programari/alegere' component={HistoryChoice}/>
          <Route path='/main/istoric-programari/data' component={AppointmentHistory}/>
          <Route path='/main/istoric-programari/nume' component={AppointmentHistory}/>
          <Route path='/main/istoric-programari/arhiva' component={AppointmentHistory}/>
        </Switch>
      </Panel>
    )
  }
}