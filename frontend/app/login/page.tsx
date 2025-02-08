import LoginForm from "./components/LoginForm";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-3xl font-bold text-second-color">Login</h2>
      <LoginForm />
    </div>
  );
};

export default page;
