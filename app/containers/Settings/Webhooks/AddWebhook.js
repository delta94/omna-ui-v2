import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import get from 'lodash/get';
import WebhookForm from './WebhookForm';
import API from '../../Utils/api';

function AddWebhook(props) {
  const { history } = props;
  const [address, setAddress] = useState('');
  const [topic, setTopic] = useState('');
  const [integration, setIntegration] = useState('');
  const [integrationOptions, setIntegrationOptions] = useState([]);
  const [topicOptions, setTopicOptions] = useState([]);


  const onTopicChange = (e) => { setTopic(e); };

  const onAddressChange = (e) => { setAddress(e); };

  const onIntegrationChange = (e) => { setIntegration(e); };

  const onSubmitForm = () => {
    const { enqueueSnackbar } = props;
    API.post('webhooks', { data: { integration_id: integration, topic, address } }).then(() => {
      enqueueSnackbar('Webhook created successfully', {
        variant: 'success'
      });
      history.goBack();
    }).catch(error => {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    });
  };

  useEffect(() => {
    const { enqueueSnackbar } = props;
    API.get('integrations', { params: { limit: 100, offset: 0 } }).then(response => {
      const { data } = response.data;
      setIntegrationOptions(data);
    }).catch((error) => {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    });
  }, []);

  useEffect(() => {
    const { enqueueSnackbar } = props;
    API.get('webhooks/topics').then(response => {
      const { data } = response.data;
      setTopicOptions(data);
    }).catch((error) => {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    });
  }, []);

  return (
    <div>
      <WebhookForm
        address={address}
        topic={topic}
        topicOptions={topicOptions}
        integration={integration}
        integrationOptions={integrationOptions}
        history={history}
        onTopicChange={onTopicChange}
        onAddressChange={onAddressChange}
        onIntegrationChange={onIntegrationChange}
        onSubmitForm={onSubmitForm}
      />
    </div>
  );
}

AddWebhook.propTypes = {
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(AddWebhook);
