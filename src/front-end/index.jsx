/* eslint-disable max-len */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { createGlobalStyle } from 'styled-components';
import { Reset as StyledReset } from 'styled-reset';
import applicationStore from './stores/application';
import App from './components/App';

const mountNode = document.getElementById('root');

// eslint-disable-next-line no-unused-expressions
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Work Sans', sans-serif;
  }
`;

ReactDOM.render(
  <>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Provider {...{ applicationStore }}>
      <StyledReset />
      <GlobalStyle />
      <App />
    </Provider>
  </>,
  mountNode
);
