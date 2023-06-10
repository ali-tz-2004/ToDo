import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import styled from '@emotion/styled';
import { Container } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { BoxContainer } from './container/BoxContainer';
import { Register } from './components/Register';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/todo",
    element: <BoxContainer />
  },
]);

const Center = styled('div')(() => ({
  display: "flex",
  justifyContent: 'center',
}));

const Item = styled('div')(() => ({
  width: "600px",
  padding: '50px',
  position: "relative",
}));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Container fixed>
      <Center>
        <Item>
          <RouterProvider router={router} />
        </Item>
      </Center>
      <ToastContainer position="bottom-left" />
    </Container>
  </React.StrictMode>
);

reportWebVitals();