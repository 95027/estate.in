import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Offers from "./pages/Offers";


const Routings = () => {
  return (
    <>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/offers" element={<Offers/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/sign-in" element={<SignIn/>}/>
          <Route path="/sign-up" element={<SignUp/>}/>
          <Route path="/forgot" element={<ForgotPassword/>}/>
        </Routes>
    </>
  )
}

export default Routings