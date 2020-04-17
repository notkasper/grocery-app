import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import applicationStore from './stores/application';
import App from './components/App';

const mountNode = document.getElementById('root');
ReactDOM.render(
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Provider {...{ applicationStore }}>
    <App />
  </Provider>,
  mountNode
);
