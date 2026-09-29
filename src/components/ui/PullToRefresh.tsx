import { Platform, RefreshControl as NativeRefreshControl, RefreshControlProps } from 'react-native';
import React from 'react';

let WebRefreshControl: React.ComponentType<any> | null = null;

if (Platform.OS === 'web') {
  WebRefreshControl = require('react-native-web-refresh-control').RefreshControl;
}

export function PullToRefresh(props: RefreshControlProps) {
  if (Platform.OS === 'web' && WebRefreshControl) {
    return <WebRefreshControl {...props} />;
  }
  
  return <NativeRefreshControl {...props} />;
}
