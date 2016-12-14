import React from 'react';
import ReactDOM from 'react-dom';

import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route, Link, IndexRoute, Redirect , hashHistory } from 'react-router'
import App from './App';
import Sign from './Sign'
import Home from './Home'
import RechargeRecord from './RechargeRecord'
import Record from './Record'
import './index.css';

injectTapEventPlugin();
//
// ReactDOM.render(
//     <MuiThemeProvider>
//     <Sign />
//     </MuiThemeProvider>,
//   document.getElementById('root')
// );

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Sign}/>
            <Route path="/Sign" component={Sign}/>
            <Route path="/Home" component={Home}>
                <Route path="/Home/Recharge" component={RechargeRecord}/>
                <Route path="/Home/Record" component={Record}/>
            </Route>
        </Route>
    </Router>
), document.getElementById("root"));