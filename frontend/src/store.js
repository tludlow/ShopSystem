import {createStore, compose, applyMiddleware} from 'redux';
import {syncHistoryWithStore} from 'react-router-redux';
import {browserHistory} from 'react-router'
import rootReducer from './reducers/index';
import thunk from "redux-thunk";
import throttle from 'lodash/throttle';

import {loadState, saveState} from "./localStorage";

/*
  Store

  Redux apps have a single store which takes
  1. All Reducers which we combined into `rootReducer`
  2. An optional starting state - similar to React's getInitialState
*/

const enhancers = compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f);

// Define the initial state here so that there isnt an error when referencing it
// in components
const initialState = {
    user: {
        loading: false,
        errors: "", 
        loggedIn: false, 
        token: "",
    }
};

const persistedState = loadState();

//const store = createStore(rootReducer, persistedState, enhancers);
const store = createStore(rootReducer, {...initialState, ...persistedState}, enhancers);
// we export history because we need it in `index.js` to feed into <Router>
export const history = syncHistoryWithStore(browserHistory, store);

/*
Enable Hot Reloading for the reducers
We re-require() the reducers whenever any new code has been written.
Webpack will handle the rest
*/

if (module.hot) {
    module.hot.accept('./reducers/', () => {
        const nextRootReducer = require('./reducers/index').default;
        store.replaceReducer(nextRootReducer);
    });
}

//Refresh state every 1s
store.subscribe(throttle(() => {
    const state = store.getState();
    let toSave = {
        user: {
            loading: state.user.loading, errors: "", loggedIn: state.user.loggedIn, token: state.user.token,
        }
    }
    saveState(toSave);
}, 1000));

export default store;
