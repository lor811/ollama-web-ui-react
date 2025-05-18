import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router";
import ProtectedRoute from "@routes/ProtectedRoute";
import AuthRoute from "@routes/AuthRoute";
import ChatRoute from "@routes/ChatRoute";
import Login from "@pages/Login";
import Register from "@pages/Register";
import NewChat from "@pages/NewChat";
import Chat from "@pages/Chat";
import AuthProvider from "@providers/AuthProvider";
import "./App.css";

const App = () => {
  return (
    <Router basename="/">
      <AuthProvider>
        <Routes>
          <Route element={<AuthRoute />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="chat" element={<ChatRoute />}>
              <Route index element={<NewChat />} />
              <Route path=":chat_id" element={<Chat />} />
            </Route>
          </Route>

          <Route path={"*"} element={<Navigate to={"/chat"} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
