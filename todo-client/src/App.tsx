import { Container, styled } from '@mui/material';
import './App.css';
import { BoxContainer } from './container/BoxContainer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Center = styled('div')(() => ({
  display: "flex",
  justifyContent: 'center',
}));

const Item = styled('div')(() => ({
  display: "flex",
  justifyContent: 'center',
  width: "600px",
  padding: '50px',
}));

function App() {
  return (
    <Container fixed>
      <Center>
        <Item>
          <BoxContainer />
        </Item>
      </Center>
      <ToastContainer position="bottom-left" />
    </Container>
  );
}

export default App;
