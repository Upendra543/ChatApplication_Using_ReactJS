import React, { useState } from 'react'
import axios from "axios";

const Addusers = ({ loadFriends }) => {
  const [searchText, setSearchText] = useState("");
  const [resultUser, setResultUser] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSearch = async (e) => {
    e.preventDefault();

    const res = await axios.get(
      `https://chatappdb-fxka.onrender.com/userslogin?username=${searchText}`
    );

    if (res.data.length > 0) {
      setResultUser(res.data[0]);
    } else {
      alert("User Not Found");
      setResultUser(null);
    }
  };

  const handleAddUser = async () => {
    if (!resultUser) return;

    const res = await axios.get(`https://chatappdb-fxka.onrender.com/userslogin/${user.id}`);

    let friends = res.data.friends || [];

    if (!friends.includes(resultUser.id)) {
      friends.push(resultUser.id);
    } else {
      alert("Already Added");
      return;
    }

    await axios.patch(`https://chatappdb-fxka.onrender.com/userslogin/${user.id}`, {
      friends
    });

    loadFriends();
    alert("User Added!");
  };

  return (
    <div className='addUser'>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder='Username'
          name='username'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button>Search</button>
      </form>

      {resultUser && (
        <div className="user">
          <div className="detail">
            <img src={resultUser.image || "./avatar.png"} alt="" />
            <span>{resultUser.username}</span>
          </div>
          <button onClick={handleAddUser}>Add User</button>
        </div>
      )}
    </div>
  )
}

export default Addusers;
