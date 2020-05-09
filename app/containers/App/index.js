import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from 'containers/Pages/Standalone/NotFoundDedicated';
import Application from './Application';
import ThemeWrapper, { AppContext } from './ThemeWrapper';
import { OmnaContext } from './OmnaContext';
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class App extends React.Component {
  render() {
    return (
      <ThemeWrapper>
        <OmnaContext.Consumer>
          {(value) => (
            <AppContext.Consumer>
              {changeMode => (
                <Switch>
                  <Route
                    path="/"
                    render={props => (
                      <Application {...props} changeMode={changeMode} appStore={value} />
                    )}
                  />
                  <Route component={NotFound} />
                </Switch>
              )}
            </AppContext.Consumer>
          )}
        </OmnaContext.Consumer>
      </ThemeWrapper>
    );
  }
}

export default App;
