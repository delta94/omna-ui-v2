import React, { Fragment } from 'react';
import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';

class ApiKeys extends React.Component {
  render() {
    return (
      <Fragment>
        <Card>
          <CardHeader
            // action={}
            title="API Keys"
          />

          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              This impressive paella is a perfect party dish and a fun meal to
              cook together with your guests. Add 1 cup of frozen peas along
              with the mussels, if you like.
            </Typography>
          </CardContent>
        </Card>
      </Fragment>
    );
  }
}

export default ApiKeys;
