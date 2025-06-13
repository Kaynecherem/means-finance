import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';
import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import './App.css';
import { DirectusProvider } from './components/DirectUs/DirectusContext';
import ThemeProvider from './components/ThemeProvider';
import { theme } from './theme';
import { persistor, store } from './utils/redux/store';
import router from './utils/router/router';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <DirectusProvider>
          <ConfigProvider theme={theme} >
            <ThemeProvider>
              <StyleProvider layer hashPriority='low'>
                <RouterProvider router={router} />
              </StyleProvider>
            </ThemeProvider>
          </ConfigProvider>
        </DirectusProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
