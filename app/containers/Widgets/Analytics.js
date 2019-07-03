import React from 'react';
import { SourceReader } from 'dan-components';
import { InsetDivider } from 'dan-components/Divider';
import { PerformanceAnalytic, SalesAnalytic } from './demos';

class Analytics extends React.Component {
  render() {
    const docSrc = 'containers/Widgets/demos/';
    return (
      <div>
        <SalesAnalytic />
        <SourceReader componentName={docSrc + 'SalesAnalytic.js'} />
        <InsetDivider />
        <PerformanceAnalytic />
        <SourceReader componentName={docSrc + 'PerformanceAnalytic.js'} />
      </div>
    );
  }
}

export default Analytics;
