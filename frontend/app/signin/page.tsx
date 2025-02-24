import SigninForm from "./components/SigninForm";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center w-3/6">
      <h2 className="text-4xl font-bold text-second-color mb-4">Signin</h2>
      <SigninForm />
    </div>
  );
};

export default page;
