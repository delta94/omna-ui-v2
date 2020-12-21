import React from 'react';
import API from '../../Utils/api';

function withFetchOptions(WrappedComponent) {
  class WithFetchOptions extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        flowTypes: [],
        integrations: []
      };
    }

    componentDidMount() {
      this.getFlowTypes();
      this.getIntegrations();
    }

    getFlowTypes = async () => {
      try {
        const response = await API.get('flows/types');
        this.setState({ flowTypes: response.data.data });
      } catch (error) {
        console.log(error);
      }
    }

    getIntegrations = async () => {
      try {
        const params = { limit: 100, offset: 0 };
        const response = await API.get('integrations', { params });
        const integrationOptions = response.data.data.map(({ id, name }) => ({ value: id, name }));
        this.setState({ integrations: integrationOptions });
      } catch (error) {
        console.log(error);
      }
    }

    render() {
      const { flowTypes, integrations } = this.state;
      return (
        <WrappedComponent
          flowTypes={flowTypes}
          integrations={integrations}
          {...this.props}
        />
      );
    }
  }
  return WithFetchOptions;
}

export default withFetchOptions;
