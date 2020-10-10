import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import NotFound from 'containers/Pages/Standalone/NotFoundDedicated';
import Application from './Application';
import ThemeWrapper, { AppContext } from './ThemeWrapper';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class App extends React.Component {
  render() {
    return (
      <ThemeWrapper>
        <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
          <AppContext.Consumer>
            {changeMode => (
              <Switch>
                <Route
                  path="/"
                  render={props => (
                    <Application {...props} changeMode={changeMode} />
                  )}
                />
                <Route component={NotFound} />
              </Switch>
            )}
          </AppContext.Consumer>
        </SnackbarProvider>
      </ThemeWrapper>
    );
  }
}

export default App;
