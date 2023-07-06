import React, { useState } from 'react';
import './App.css';
import VideoPlayer from './player';
import ConfigPanel from './config';
import { Routes, Route, Outlet, Link } from "react-router-dom";

function App() {
  return (
    <div id="app" className="App">
      <Routes>
        <Route path="/" element={<VideoPlayer />} />
        <Route path="/config/:room" element={<ConfigPanel />} />
      </Routes>
    </div>
  );
}

export default App;
