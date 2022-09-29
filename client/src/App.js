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
import Home from './pages/home/Home.jsx'
import Video from './pages/video/[id].jsx'
import SignIn from './pages/SignIn';
import Channel from './pages/channel/[id].jsx'
import MiniGuide from './components/MiniGuide';
import Search from './pages/Search';
import Studio from './pages/studio/Studio';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  color: #ffffff;
`;

const Main = styled.main`
  background: ${({theme})=>theme.bg};
  color: ${({theme}) => theme.text};
  flex: 7;
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  place-content: center;
`;

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
          <Wrapper name="Wrapper" >
            <MiniGuide />
            <Routes>
              <Route path='/'>
                <Route index element={<Home type="random" />}/>
                <Route path='trends' element={<Home type="trend"/>}/>
                <Route path='subscriptions' element={<Home type="query/sub"/>}/>
                <Route path='search' element={<Search />}/>
                <Route path='signin' element={<SignIn />}/>
                <Route path='video'>
                  <Route path=':id' element={<Video/>}/>
                </Route>
                <Route path='channel/:id/*'element={<Channel />} />
                <Route path='channel/studio/:id/*'element={<Studio />} />
                <Route path="/*" element={<Home type="random" />} />
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
