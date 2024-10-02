import './App.css';
import Header from './components/Header/header';
import Footer from './components/Footer/footer'
import Introduce from './components/Introduce/introduce';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
            <div className="p-10 text-center">
                <p>Hello 123</p>
            </div> 
        </main>
        <Introduce />  
        <Footer />
    </div>
);
}

export default App;
