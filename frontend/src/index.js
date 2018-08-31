/*
  Import Dependencies
*/
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute} from 'react-router'
import 'babel-polyfill';

/* Import CSS */
//eslint-disable-next-line
import css from './styles/main.scss';

/*
  Import Components
*/
import App from './components/App';

/*
  Import Views
*/
import Home from './views/Home';
import FourOFour from "./views/FourOFour";


/* Import our data store */
import store, {history} from './store';


/*
  Rendering
  This is where we hook up the Store with our actual component and the router
*/
render(
    <Provider store={store}>
        { /* Tell the Router to use our enhanced history */ }
        <Router history={history}>
            <Route path="/" component={App}>
              <IndexRoute component={Home} />
            </Route>
            <Route path="/*" component={FourOFour} />
        </Router>
    </Provider>,
    document.getElementById('root')
);
