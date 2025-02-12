import LoginForm from "./components/LoginForm";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center">
        <h2 className="text-4xl font-bold text-second-color mb-4">Login</h2>
        <LoginForm />
    </div>
  );
};

export default page;
