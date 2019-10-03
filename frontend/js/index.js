import React from 'react';
import {render} from 'react-dom';
import AppWithRouter from "./component/app";
import HashRouter from "react-router-dom/es/HashRouter";

render(
    <HashRouter>
      <AppWithRouter/>
    </HashRouter>,
  document.getElementById('app')
);