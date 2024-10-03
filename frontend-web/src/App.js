import './App.css';
import Header from './components/Header/header';
import Footer from './components/Footer/footer'
import Introduce from './components/Introduce/introduce';
import LoginForm from './components/Auth/LoginForm';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
        <Header />
            <LoginForm />
            <Introduce />  
        <Footer />
    </div>
);
}

export default App;
