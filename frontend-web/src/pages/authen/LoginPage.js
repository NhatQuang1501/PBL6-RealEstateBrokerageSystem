import LoginForm from "../../components/Auth/LoginForm";
import Header from "../../components/Header/header";
const LoginPage = () => {
  return (
    <div className="bg-gray-200 min-h-screen">
      <Header />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
