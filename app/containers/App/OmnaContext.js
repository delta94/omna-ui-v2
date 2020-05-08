import React from 'react';
import { currentTenant } from 'dan-containers/Common/Utils';

export const appStore = currentTenant;

export const OmnaContext = React.createContext(appStore);

