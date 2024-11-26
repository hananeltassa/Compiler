import './styles/App.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { FileContentProvider } from './contexts/FileContentContext'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Compiler from './pages/Compiler';

function App() {
    return (
        <Router>
            <Provider store={store}>
                <FileContentProvider>
                    <div className="App">
                        <Routes>
                            <Route path="/" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/compiler" element={<Compiler />} />
                        </Routes>
                    </div>
                </FileContentProvider>
            </Provider>
        </Router>
    );
}

export default App;
