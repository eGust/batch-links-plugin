import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import App from './js/App';
import reducer, { buildState } from './js/reducers'
import { REBUILD_STATE } from './js/actions'
import 'muicss/dist/css/mui.min.css'
import './css/app.css'

import { createStore } from 'redux'
// import { createStore, applyMiddleware } from 'redux'

// import createLogger from 'redux-logger';
// import html from './test/html'

const store = createStore(reducer, buildState())
// const store = createStore(reducer, buildState(), applyMiddleware(createLogger()))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

try {
	window.chrome.runtime.getBackgroundPage((page) => {
		page.getActiveBody((html) => store.dispatch(REBUILD_STATE(html)))
	})
} catch (e) {
	// store.dispatch(REBUILD_STATE(html))
}
