import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Header from './components/Header/header';
// import Footer from './components/Footer/footer'
// import Introduce from './components/Introduce/introduce';
import Heropage from './components/HeroPage/heropage'
import LoginForm from './components/Auth/LoginForm'
import SignUpForm from './components/Auth/SignUpForm';
import Layout from './components/Layout/Layout';
import MainPageUser from './pages/user/MainPageUser';
// import Navbar from './pages/Admin/NavbarAdmin/NavbarAdmin';
import Adminpage from './pages/Admin/Adminpage/Adminpage';

function App() {
  return (
    <Router>
    <div id='app' className="flex flex-col min-h-screen font-montserrat">

        <Routes>
          
            <Route path='/' element={<Layout><Heropage/><MainPageUser/></Layout>}></Route>
            <Route path='/login' element={<Layout><LoginForm/></Layout>}></Route>
            <Route path='/register' element={<Layout><SignUpForm/></Layout>}></Route>    
          
            <Route path='/admin' element={<Adminpage/>}></Route>
            </Routes>

    </div>
    <div>
      
    </div>
    </Router>
);
}

export default App;
