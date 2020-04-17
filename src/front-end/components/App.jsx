import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { observer, inject, PropTypes as MobxPropTypes } from 'mobx-react';
// import PropTypes from 'prop-types';

@inject('applicationStore')
@observer
class App extends Component {
  render() {
    const { applicationStore } = this.props;
    return (
      <div>
        <h1>{`Hello World! ${applicationStore.foo}`}</h1>
      </div>
    );
  }
}

App.propTypes = {
  applicationStore: MobxPropTypes.observableObject.isRequired,
};

export default hot(App);
