import React from "react";
import LoginForm from "./components/LoginForm";

const Loginpagelayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default Loginpagelayout;
