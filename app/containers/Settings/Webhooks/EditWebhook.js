import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import Loading from 'dan-components/Loading';
import get from 'lodash/get';
import WebhookForm from './WebhookForm';
import API from '../../Utils/api';

function EditWebhook(props) {
  const { history, match } = props;
  const [address, setAddress] = useState('');
  const [topic, setTopic] = useState('');
  const [integration, setIntegration] = useState('');
  const [loading, setLoading] = useState(false);

  const [integrationOptions, setIntegrationOptions] = useState([]);
  const [topicOptions, setTopicOptions] = useState([]);

  const onTopicChange = (e) => { setTopic(e); };

  const onAddressChange = (e) => { setAddress(e); };

  const onIntegrationChange = (e) => { setIntegration(e); };

  const onSubmitForm = () => {
    const { enqueueSnackbar } = props;
    setLoading(true);
    API.post(`webhooks/${match.params.id}`, { data: { integration_id: integration, topic, address } }).then(() => {
      history.goBack();
      enqueueSnackbar('Webhook edited successfully', {
        variant: 'success'
      });
    }).catch(error => {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }).then(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    const { enqueueSnackbar } = props;
    setLoading(true);
    API.get(`/webhooks/${match.params.id}`).then(response => {
      const { data } = response.data;
      const { topic: _topic, address: _address, integration: _integration } = data;
      setTopic(_topic);
      setAddress(_address);
      setIntegration(_integration.id);
    }).catch((error) => {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }).then(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const { enqueueSnackbar } = props;
    API.get('integrations', { params: { offset: 0, limit: 100 } }).then(response => {
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
      {loading && <Loading />}
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

EditWebhook.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(EditWebhook);
