import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './Hooks/useTheme.jsx';
import { UserProvider  } from './Hooks/useUser.jsx';
import {  disableReactDevTools  } from '@fvilers/disable-react-devtools';

import "./main.scss";

if(process.env.NODE_ENV === 'production') disableReactDevTools()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <UserProvider>
      <App />
      </UserProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
