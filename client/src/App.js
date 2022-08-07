import { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import './App.css';
import Menu from './components/Menu';
import Navbar from './components/navbar/Navbar';
import { darkTheme, lightTheme } from './utils/Theme.js'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from './pages/Home.jsx'
import Video from './pages/Video.jsx'
import SignIn from './pages/SignIn';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  color: #ffffff;
`

const Main = styled.div`
  background: ${({theme})=>theme.bg};
  color: ${({theme}) => theme.text};
  flex: 7;
`

const Wrapper = styled.div`
  display: flex;
  width: calc(100vw - 8px);
  place-content: center;
`


function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [sidebar, setSidebar] = useState(false)
  
  return (
    <ThemeProvider theme={darkMode ? lightTheme : darkTheme} >
      <Container className="App">
        <BrowserRouter>
        {sidebar && 
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} setSidebar={setSidebar} sidebar={sidebar} />
        }
        <Main >
          <Navbar setSidebar={setSidebar}/>
          <Wrapper >
            <Routes>
              <Route path='/'>
                <Route index element={<Home type="random" />}/>
                <Route path='trends' element={<Home type="trend"/>}/>
                <Route path='subscriptions' element={<Home type="sub"/>}/>
                <Route path='signin' element={<SignIn />}/>
                <Route path='video'>
                  <Route path=':id' element={<Video/>}/>
                </Route>
              </Route>
            </Routes>
          </Wrapper>
        </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
