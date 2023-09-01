import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './containers/Header';
import { Map } from './containers/Map';
import { Footer } from './containers/Footer';

function App() {
  return (
    <div className='app container-fluid text-center'>
      <Router>

        <div>
          <Header/>
        </div>

        <div id='main'>
          <Routes>
            <Route exact path='/' element={<Map/>}/>
          </Routes>
          
        </div>

        <div>
          <Footer/>
        </div>

      </Router>
    </div>
  )
};

export default App;
