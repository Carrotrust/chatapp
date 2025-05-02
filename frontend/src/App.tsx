import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useAuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, isLoading } = useAuthContext();
  if (isLoading) return null;
  return (
    <div
      className="flex h-screen bg-gradient-to-r from-green-300 to-blue-300
       p-4 flex-col items-center 
    justify-center  space-y-4 "
    >
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUp /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to={"/"} />}
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
