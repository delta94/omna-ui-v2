import React, { Fragment, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Typography
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { getLocalStorage } from 'dan-containers/Common/Utils';

const ApiKeys = () => {
  const [secretVisibility, setSecretVisibility] = useState(false);
  const { secret, token } = getLocalStorage();

  const changeSecretVisibility = () => {
    setSecretVisibility(!secretVisibility);
  };

  return (
    <Fragment>
      <Card>
        <CardHeader
          action={
            <Button
              color="primary"
              endIcon={<ArrowRightIcon />}
              href="http://doc-api.omna.io/"
              size="large"
              target="_blank"
            >
              Learn more about API authentication
            </Button>
          }
          title={
            <Typography variant="h6" component="h5">
              API Keys
            </Typography>
          }
        />

        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12} md={5}>
              <Typography variant="body2" color="textSecondary" component="p">
                Sercret
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={7}
              container
              spacing={1}
              justify="flex-end"
              alignItems="center"
            >
              <Grid item>
                <Typography variant="body2" component="p">
                  {secretVisibility ? secret : '********'}
                </Typography>
              </Grid>
              <Grid item xs={1} md={1}>
                <IconButton onClick={changeSecretVisibility} size="small" edge="end">
                  {secretVisibility ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
                  )}
                </IconButton>
              </Grid>
            </Grid>
            <Grid item xs={12} md={5}>
              <Typography variant="body2" color="textSecondary" component="p">
                Token
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={7}
              container
              spacing={1}
              justify="flex-end"
              alignItems="center"
            >
              <Grid item>
                <Typography variant="body2" component="p">
                  {token}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Fragment>
  );
};

export default ApiKeys;
