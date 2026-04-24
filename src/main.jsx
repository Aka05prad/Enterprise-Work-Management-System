// window.__VITE_API_URL__ = import.meta.env.VITE_API_URL;

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { Provider } from 'react-redux';
// import { BrowserRouter } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { store } from './app/store';
// import App from './App';
// import './index.css';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <BrowserRouter>
//         <App />
//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop
//           closeOnClick
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           theme="colored"
//         />
//       </BrowserRouter>
//     </Provider>
//   </React.StrictMode>
// );
window.__VITE_API_URL__ = import.meta.env.VITE_API_URL;

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from './app/store';
import { ThemeProvider } from './context/ThemeContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { NotificationsProvider } from './context/NotificationsContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <WebSocketProvider>
            <NotificationsProvider>
              <App />
              <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                limit={5}
              />
            </NotificationsProvider>
          </WebSocketProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);