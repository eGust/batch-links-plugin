import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createLogger from 'redux-logger';

import App from './js/App';
import reducer, { buildState } from './js/reducers'
import { REBUILD_STATE } from './js/actions'
import 'muicss/dist/css/mui.min.css'
import './css/app.css'
// import html from './test/html'

// const store = createStore(reducer, buildState(), applyMiddleware(createLogger()))
const store = createStore(reducer, buildState())

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

try {
	window.chrome.extension.getBackgroundPage().getActiveBody((html) => store.dispatch(REBUILD_STATE(html)))
} catch (e) {
	// store.dispatch(REBUILD_STATE(html))
}
