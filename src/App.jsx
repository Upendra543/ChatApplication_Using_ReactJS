import './App.css';
import List from './Components/List';
import Chat from './Components/Chat';
import Details from './Components/Details';
import Login from './Components/Login/Login';
import Notify from './Components/Notify/Notify';

import axios from 'axios';
import { useState, createContext } from 'react';
import { toast } from "sonner";

export const UserContext = createContext(null);

function App() {
  const [chatlistID, setChatlistID] = useState(null);
  let [user, setUser] = useState(false);
  let [selectedUser, setSelectedUser] = useState(null);
  let [loginvalues, setLoginvalues] = useState({ email: "", password: "" });

  // ⭐ GET CURRENT LOGGED IN USER ID
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const userID = loggedUser?.id || null;

  async function submitLogin(e) {
    e.preventDefault();
    try {
      const res = await axios.get(
        `https://chatappdb-fxka.onrender.com/userslogin?email=${loginvalues.email}`
      );

      if (!loginvalues.email || !loginvalues.password) {
        toast.error("Enter email & password");
        return;
      }

      if (res.data.length === 0) {
        toast.error("User not exist, create account");
        return;
      }

      const obj = res.data[0];

      if (obj.password === loginvalues.password) {
        toast.success("Login Successful");

        localStorage.setItem("user", JSON.stringify(obj));
        setUser(true);
      } else {
        toast.error("Wrong Password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  }

  function logout() {
    localStorage.removeItem("user");
    setUser(false);
  }

  function handleEmail(e) {
    setLoginvalues({ ...loginvalues, [e.target.name]: e.target.value });
  }

  return (
    <UserContext.Provider
      value={{
        chatlistID,
        setChatlistID,
        logout,
        userID,   // ⭐ FIXED: NOW userID EXISTS
      }}
    >
      <div className="container">
        {user ? (
          <>
            <List setSelectedUser={setSelectedUser} />
            <Chat selectedUser={selectedUser} />
            <Details />
          </>
        ) : (
          <Login handleEmail={handleEmail} submitLogin={submitLogin} />
        )}
        <Notify />
      </div>
    </UserContext.Provider>
  );
}

export default App;
