import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchComponent from './components/SearchComponent';
import Search from './components/Search';
import Test from './components/Test';

function App() {
  return (
    // <div className="App">

    // </div>

    <Router>
      <Routes>
        <Route index element={<Search />} />
        <Route path='/all' element={<SearchComponent />} />
        <Route path='/test' element={<Test />} />
      </Routes>
    </Router>

  );
}

export default App;