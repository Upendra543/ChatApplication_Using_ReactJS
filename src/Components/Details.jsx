import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";

const Details = () => {
  const { chatlistID, logout, userID } = useContext(UserContext); 
  // userID = logged-in user ID

  const [displayUser, setDisplayUser] = useState({});
  const [arrow, setArrow] = useState(false);

  // Fetch selected user's details
  useEffect(() => {
    if (!chatlistID) return;

    axios
      .get("https://chatappdb-fxka.onrender.com/userslogin")
      .then((res) => {
        setDisplayUser(res.data.find((u) => u.id === chatlistID));
      });
  }, [chatlistID]);

  const handleSharedimg = () => {
    setArrow(!arrow);
  };

  // ⭐ Remove User + Remove Chat History
  const handleRemoveUser = async () => {
    try {
      const res = await axios.get(
        "https://chatappdb-fxka.onrender.com/userslogin"
      );
      const allUsers = res.data;

      // Logged in user
      const loggedUser = allUsers.find((u) => u.id === userID);

      // Friend to remove
      const removedUser = allUsers.find((u) => u.id === chatlistID);

      if (!loggedUser || !removedUser) {
        alert("Something went wrong. User not found.");
        return;
      }

      // 1️⃣ Update logged-in user (remove friend + remove chat)
      await axios.patch(
        `https://chatappdb-fxka.onrender.com/userslogin/${userID}`,
        {
          friends: loggedUser.friends
            ? loggedUser.friends.filter((fid) => fid !== chatlistID)
            : [],
          chat: loggedUser.chat
            ? loggedUser.chat.filter(
                (msg) =>
                  msg.senderId !== chatlistID &&
                  msg.receiverId !== chatlistID
              )
            : [],
        }
      );

      // 2️⃣ Update removed user (remove you + remove chat)
      await axios.patch(
        `https://chatappdb-fxka.onrender.com/userslogin/${chatlistID}`,
        {
          friends: removedUser.friends
            ? removedUser.friends.filter((fid) => fid !== userID)
            : [],
          chat: removedUser.chat
            ? removedUser.chat.filter(
                (msg) =>
                  msg.senderId !== userID &&
                  msg.receiverId !== userID
              )
            : [],
        }
      );

      alert("User removed and chat history cleared!");

    } catch (err) {
      console.error("REMOVE USER ERROR:", err);
      alert("Error removing user.");
    }
  };

  return chatlistID ? (
    <div className="Details">
      <div className="user">
        <img
          src={displayUser?.image || "./avatar.png"}
          alt=""
          width={100}
        />
        <h2>{displayUser?.username}</h2>
        <p>{displayUser?.email}</p>
        <p>{displayUser?.bio}</p>
      </div>

      <div className="info">
        <div className="option">
          <div className="title" onClick={handleSharedimg}>
            <span>Shared photos</span>
            {arrow ? (
              <img src="./arrowDown.svg" alt="" />
            ) : (
              <img src="./arrowUp.svg" alt="" />
            )}
          </div>

          {arrow && (
            <div className="photos">
              {displayUser?.chat?.map(
                (m, i) =>
                  m.image && (
                    <div className="photoItem" key={i}>
                      <div className="photoDetail">
                        <img src={m.image} alt="" />
                        <span>Photo_{i + 1}.png</span>
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleRemoveUser}
        >
          Remove User
        </button>

        <button
          className="logout"
          onClick={logout}
          style={{ marginTop: "10px" }}
        >
          Logout
        </button>
      </div>
    </div>
  ) : (
    <div
      className="Details noChatSelected"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      Select a chat to see details
    </div>
  );
};

export default Details;
