import './App.css';
import Header from './components/Header/header';
import Footer from './components/Footer/footer'
// import Introduce from './components/Introduce/introduce';
import Heropage from './components/HeroPage/heropage'

function App() {
  return (
    <div id='app' className="flex flex-col min-h-screen ">
        <Header />
        <main className="flex-grow">
            <div className="">
                <Heropage/>
            </div> 
        </main>
        {/* <Introduce />   */}
        <Footer />
    </div>
);
}

export default App;
