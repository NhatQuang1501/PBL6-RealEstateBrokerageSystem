import SignUpForm from "../../components/auth/SignUpForm";
import Header from "../../components/header/Header";
const SignUpPage = () => {
  return (
    <div className="bg-gray-200 min-h-screen">
      <Header />
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
