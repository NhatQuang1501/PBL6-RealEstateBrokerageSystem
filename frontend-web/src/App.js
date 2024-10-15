import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/header';
import Footer from './components/Footer/footer'
// import Introduce from './components/Introduce/introduce';
import Heropage from './components/HeroPage/heropage'
import LoginForm from './components/Auth/LoginForm'
import SignUpForm from './components/Auth/SignUpForm';
import Layout from './components/Layout/Layout';
import MainPageUser from './pages/user/MainPageUser';

function App() {
  return (
    <Router>
    <div id='app' className="flex flex-col min-h-screen font-montserrat">
        <Layout>
        <Routes>
            <Route path='/' element={<><Heropage/><MainPageUser/></>}></Route>
            <Route path='/login' element={<LoginForm/>}></Route>
            <Route path='/register' element={<SignUpForm/>}></Route>
            </Routes>
        </Layout>
    </div>
    </Router>
);
}

export default App;
