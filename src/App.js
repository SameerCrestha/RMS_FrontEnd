import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import LoginPage from "./components/login/LoginPage"
import AdminPanel from './components/AdminPanel/AdminPanel';
import { ToastContainer } from 'react-toastify';
import UserPanel from './components/UserPanel/UserPanel';
function App() {
  return (
    <div className="App">
    <ToastContainer/>
    <Router>
      <Routes>
        <Route path='/' element={<UserPanel/>}/>
        <Route path='/admin/*' element={
          localStorage.getItem('token')?<AdminPanel/>:<LoginPage/>
        }/>

      </Routes>
    </Router>
    </div>
  );
}

export default App;
