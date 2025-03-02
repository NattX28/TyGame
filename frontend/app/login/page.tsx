import Link from "next/link";
import LoginForm from "./components/LoginForm";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center w-3/6">
      <h2 className="text-4xl font-bold text-second-color mb-4">Login</h2>
      <LoginForm />
      <p className="text-sub-title text:sm mt-8">
        Doesn't have any account yet?{" "}
        <Link href={"/signin"}>
          <span className="underline text-red-400">register</span>
        </Link>
      </p>
    </div>
  );
};

export default page;
