import LoginForm from "../../components/auth/LoginForm";
import Header from "../../components/header/Header";
const LoginPage = () => {
  return (
    <div className="bg-gray-200 min-h-screen">
      <Header />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
