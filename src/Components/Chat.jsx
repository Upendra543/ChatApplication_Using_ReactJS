import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { UserContext } from "../App";

const Chat = () => {
  const { chatlistID, setChatlistID } = useContext(UserContext);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const [openemoji, setOpenmoji] = useState(false);
  const [emojitxt, setemojitxt] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [selectIMG, setSelectIMG] = useState(null);
  const [searchValue, setSearchValue] = useState(false);
  const [showClearPopup, setShowClearPopup] = useState(false);
  const [viewprofile, setViewprofile] = useState(false);
  const endRef = useRef(null);

  // Unique chat ID between two users
  const chatId =
    loggedInUser.id < chatlistID
      ? `${loggedInUser.id}_${chatlistID}`
      : `${chatlistID}_${loggedInUser.id}`;

  // ⭐ 1) Load user immediately when selecting chat
  useEffect(() => {
    const fetchUser = async () => {
      if (!chatlistID) return;

      try {
        const res = await axios.get(
          `https://chatappdb-fxka.onrender.com/userslogin/${chatlistID}`
        );

        setUser(res.data);
        setMessages(res.data.chat?.[chatId] || []);
      } catch (err) {
        console.log("User load error:", err);
      }
    };

    fetchUser();
  }, [chatlistID, chatId]);

  // ⭐ 2) Auto-refresh for new messages
  useEffect(() => {
    if (!chatlistID) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `https://chatappdb-fxka.onrender.com/userslogin/${chatlistID}`
        );

        const serverMessages = res.data.chat?.[chatId] || [];

        if (serverMessages.length !== messages.length) {
          setUser(res.data);
          setMessages(serverMessages);
        }
      } catch (err) {
        console.log("Auto refresh error:", err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [chatlistID, messages.length, chatId]);

  // Auto scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleEmoji = (e) => {
    setemojitxt((t) => t + e.emoji);
    setOpenmoji(false);
  };

  // SEND TEXT
  const handleSend = async () => {
    if (!emojitxt.trim()) return;

    const newMsg = {
      id: Date.now(),
      text: emojitxt,
      image: null,
      time: new Date().toLocaleTimeString(),
      senderId: loggedInUser.id,
      receiverId: chatlistID,
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setemojitxt("");

    await updateChat(updatedMessages);
  };

  // SEND IMAGE
  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const imgMsg = {
        id: Date.now(),
        text: "",
        image: reader.result,
        time: new Date().toLocaleTimeString(),
        senderId: loggedInUser.id,
        receiverId: chatlistID,
      };

      const updatedMessages = [...messages, imgMsg];
      setMessages(updatedMessages);

      await updateChat(updatedMessages);
    };

    reader.readAsDataURL(file);
  };

  // ⭐ Correct updateChat function
  const updateChat = async (updatedMessages) => {
    // Update logged in user chat
    await axios.patch(
      `https://chatappdb-fxka.onrender.com/userslogin/${loggedInUser.id}`,
      {
        chat: {
          ...(loggedInUser.chat || {}),
          [chatId]: updatedMessages,
        },
      }
    );

    // Update receiver chat
    await axios.patch(
      `https://chatappdb-fxka.onrender.com/userslogin/${chatlistID}`,
      {
        chat: {
          ...(user?.chat || {}),
          [chatId]: updatedMessages,
        },
      }
    );
  };

  const closeChat = () => {
    setChatlistID(null);
    setMessages([]);
  };

  const clearChat = async () => {
    await updateChat([]);
    setMessages([]);
    setShowClearPopup(false);
  };

  const searchmsg = (e) => {
    const term = e.target.value.toLowerCase();

    if (!term.trim()) {
      setMessages(user?.chat?.[chatId] || []);
      return;
    }

    const filtered = (user?.chat?.[chatId] || []).filter((msg) =>
      msg.text?.toLowerCase().includes(term)
    );

    setMessages(filtered);
  };

  if (!chatlistID) {
    return (
      <div className="Chat noChatSelected">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="Chat">

      {/* CLEAR CHAT POPUP */}
      {showClearPopup && (
        <div className="confirmPopup">
          <div className="confirmBox">
            <h3>Clear Chat?</h3>
            <p>Are you sure you want to delete all messages?</p>
            <div className="btns">
              <button onClick={() => setShowClearPopup(false)}>Cancel</button>
              <button onClick={clearChat}>Yes, Clear</button>
            </div>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div className="top">
        <div className="user">
          <div className="texts">
            <img src={user?.image || "./avatar.png"} onClick={() => setViewprofile(true)} />
            <div>
              <span>{user?.profilename || user?.username}</span>
              <p>Online</p>
            </div>
          </div>

          {searchValue && (
            <input type="text" placeholder="Search message" onChange={searchmsg} />
          )}

          <div className="icons">
            <img src="./ClearChat.svg" onClick={() => setShowClearPopup(true)} />
            <img src="./CloseChat.svg" onClick={closeChat} />
            <img src="./search.svg" onClick={() => setSearchValue(!searchValue)} />
          </div>
        </div>
      </div>

      {/* CHAT */}
      <div className="center">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.senderId === loggedInUser.id ? "own" : ""}`}
          >
            {msg.senderId !== loggedInUser.id && (
              <img src={user?.image || "./avatar.png"} />
            )}

            <div className="texts">
              {msg.image ? (
                <img
                  src={msg.image}
                  style={{ width: "220px", borderRadius: "10px" }}
                  onClick={() => setSelectIMG(msg.image)}
                />
              ) : (
                <p>{msg.text}</p>
              )}
              <span>{msg.time}</span>
            </div>
          </div>
        ))}

        <div ref={endRef}></div>
      </div>

      {/* IMAGE POPUP */}
      {selectIMG && (
        <div className="popup" onClick={() => setSelectIMG(null)}>
          <img src={selectIMG} />
        </div>
      )}

      {/* PROFILE VIEW */}
      {viewprofile && (
        <div className="profilePopup" onClick={() => setViewprofile(false)}>
          <img src={user?.image || "./avatar.png"} />
        </div>
      )}

      {/* BOTTOM BAR */}
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.svg" />
          </label>
          <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />

          <img src="./camera.svg" />
          <img src="./mic.svg" />
        </div>

        <input
          type="text"
          placeholder="Type a message..."
          value={emojitxt}
          onChange={(e) => setemojitxt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <div className="emoji">
          <img src="./emoji.svg" onClick={() => setOpenmoji(!openemoji)} />
          {openemoji && (
            <div className="picker">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>

        <button className="sendButton" onClick={handleSend}>send</button>
      </div>
    </div>
  );
};

export default Chat;
