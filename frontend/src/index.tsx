import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import CssBaseline from '@material-ui/core/CssBaseline';
import { routerMiddleware } from 'connected-react-router';
import App from './components/App';
import ThemeContainer from './containers/ThemeContainer';
import epicMiddleware, { rootEpic } from './epics';
import rootReducer, { history, initialState } from './reducers';

const composeEnhancer = composeWithDevTools({
  name: 'stream'
});

export const store = createStore(
  rootReducer,
  initialState,
  composeEnhancer(applyMiddleware(epicMiddleware, routerMiddleware(history)))
);

epicMiddleware.run(rootEpic);

ReactDOM.render(
  <Provider store={store}>
    <ThemeContainer>
      <React.Fragment>
        <CssBaseline />
        <App />
      </React.Fragment>
    </ThemeContainer>
  </Provider>,
  document.getElementById('app')
);
