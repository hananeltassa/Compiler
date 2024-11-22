import logo from './logo.svg';
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';



function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Register />} />

          </Routes>
        </div>
      </Router>
  );
}

export default App;
