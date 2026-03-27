import React from 'react';
import headerImage from './assets/images/header-bg.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <img src={headerImage} alt="Header" />
      </header>
      {/* Your other components */}
    </div>
  );
}

export default App;