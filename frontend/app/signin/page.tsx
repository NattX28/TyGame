import SignupForm from "./components/SignupForm";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center w-3/6">
      <h2 className="text-4xl font-bold text-second-color mb-4">Signup</h2>
      <SignupForm />
    </div>
  );
};

export default page;
