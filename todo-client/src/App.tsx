import { Container, styled } from '@mui/material';
import './App.css';
import { BoxContainer } from './container/BoxContainer';

const Center = styled('div')(({ theme }) => ({
  display: "flex",
  justifyContent: 'center',
}));

const Item = styled('div')(({ theme }) => ({
  display: "flex",
  justifyContent: 'center',
  width: "600px",
  padding: '50px',
  // background: "yellow"
}));

function App() {
  return (
    <Container fixed>
      <Center>
        <Item>
          <BoxContainer />
        </Item>
      </Center>
    </Container>
  );
}

export default App;
