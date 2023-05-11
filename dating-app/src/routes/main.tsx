import { Route, Routes } from "react-router-dom";
import RegisterForm from "../components/RegisterForm/RegisterForm";
import Home from "../components/home/home";

export default function Main() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegisterForm />} />
    </Routes>
  );
}
