import React, {Component} from 'react';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import Presentation from "./pages/presentation/index";
import Register from './register/index';
import GDPR from "./common/gdpr/index";
import Cookies from 'universal-cookie';
import Recover from './recover/index';
import Login from './login/index';
import Main from './main/index';
import 'babel-polyfill';
import './index.css';
import {ToastContainer} from "react-toastify";

export const cookies = new Cookies();

class App extends Component {

  render() {
    if (cookies.get('token') !== null && cookies.get('token') !== '' && cookies.get('token') !== undefined &&
      cookies.get('userId') !== undefined && cookies.get('userId') !== null) {
      return (
        <div className="project-root">
          <Switch>
            <Route path='/main' component={Main}/>
            <Redirect from='/' to='/main'/>
          </Switch>
          {cookies.get('Consent') ?
            null : <GDPR/>}
          <ToastContainer />
        </div>
      )
    } else {
      cookies.remove('userId');
      cookies.remove('token');
      cookies.remove('isDoctor');
      cookies.remove('isAssistant');
      return (
        <div className="project-root">
          <Switch>
            <Route path='/recover' component={Recover}/>
            <Route path='/register' component={Register}/>
            <Route path='/login' component={Login}/>
            <Route exact path='/pagina-prezentare' component={Presentation}/>
            <Redirect to='/pagina-prezentare'/>
          </Switch>
          {cookies.get('Consent') ?
              null : <GDPR/>}
          <ToastContainer />
        </div>
      );
    }
  }
}

const AppWithRouter = withRouter(App);

export default AppWithRouter;