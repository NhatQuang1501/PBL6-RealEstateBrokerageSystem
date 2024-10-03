import "./App.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Introduce from "./components/introduce/Introduce";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import LoginPage from "./pages/authen/LoginPage";
import SignUpPage from "./pages/authen/SignUpPage";

function App() {
  return (
    // <div className="flex flex-col min-h-screen">
    //   <Header />
    //   <LoginForm />
    //   <SignUpForm />
    //   <Introduce />
    //   <Footer />
    // </div>


    // <LoginPage />
    <SignUpPage />
  );
}

export default App;
