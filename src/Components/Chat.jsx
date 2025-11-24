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
  const [originalMessages, setOriginalMessages] = useState([]); // FIXED
  const [user, setUser] = useState(null);
  const [selectIMG, setSelectIMG] = useState(null);
  const [searchValue, setSearchValue] = useState(false);
  const [showClearPopup, setShowClearPopup] = useState(false);

  const [viewprofile, setViewprofile] = useState(false);

  const endRef = useRef(null);

  // LOAD CHAT
  useEffect(() => {
    if (!chatlistID) {
      setMessages([]);
      return;
    }

    axios
      .get(`https://chatappdb-fxka.onrender.com/userslogin/${chatlistID}`)
      .then((res) => {
        setUser(res.data);
        setMessages(res.data.chat || []);
        setOriginalMessages(res.data.chat || []); // FIXED
      })
      .catch((err) => console.log(err));
  }, [chatlistID]);

  // AUTO SCROLL
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleEmoji = (e) => {
    setemojitxt((text) => text + e.emoji);
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
    setOriginalMessages(updatedMessages); // FIXED
    setemojitxt("");

    await axios.patch(`https://chatappdb-fxka.onrender.com/userslogin/${chatlistID}`, {
      chat: updatedMessages,
    });

    await axios.patch(`https://chatappdb-fxka.onrender.com/userslogin/${loggedInUser.id}`, {
      chat: updatedMessages,
    });
  };

  // SEND IMAGE
  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const newImgMsg = {
        id: Date.now(),
        text: "",
        image: reader.result,
        time: new Date().toLocaleTimeString(),
        senderId: loggedInUser.id,
        receiverId: chatlistID,
      };

      const updatedMessages = [...messages, newImgMsg];
      setMessages(updatedMessages);
      setOriginalMessages(updatedMessages); // FIXED

      await axios.patch(`https://chatappdb-fxka.onrender.com/userslogin/${chatlistID}`, {
        chat: updatedMessages,
      });

      await axios.patch(`https://chatappdb-fxka.onrender.com/userslogin/${loggedInUser.id}`, {
        chat: updatedMessages,
      });
    };

    reader.readAsDataURL(file);
  };

  if (!chatlistID) {
    return (
      <div className="Chat noChatSelected"
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        Select a chat to start messaging
      </div>
    );
  }

  const handleDownload = (imgURL) => {
    const link = document.createElement("a");
    link.href = imgURL;
    link.download = "image.jpg";
    link.click();
  };

  // SEARCH MESSAGE
  const searchmsg = (e) => {
    const searchTerm = e.target.value.toLowerCase();

    if (!searchTerm) {
      setMessages(originalMessages); // FIXED
      return;
    }

    const filteredMessages = originalMessages.filter((msg) =>
      msg.text?.toLowerCase().includes(searchTerm)
    );

    setMessages(filteredMessages);
  };

  // CLOSE CHAT
  const closeChat = () => {
    setChatlistID(null);
    setMessages([]);
  };

  // CLEAR CHAT
  const clearChat = async () => {
    const updatedMessages = [];

    await axios.patch(`https://chatappdb-fxka.onrender.com/userslogin/${chatlistID}`, {
      chat: updatedMessages,
    });

    await axios.patch(`https://chatappdb-fxka.onrender.com/userslogin/${loggedInUser.id}`, {
      chat: updatedMessages,
    });

    setMessages([]);
    setOriginalMessages([]);
    setShowClearPopup(false);
  };

  

  return (
    <div className="Chat" >
      {/* CLEAR CHAT POPUP */}
      {showClearPopup && (
        <div className="confirmPopup">
          <div className="confirmBox">
            <h3>Clear Chat?</h3>
            <p>Are you sure you want to delete all messages?</p>

            <div className="btns">
              <button className="cancelBtn" onClick={() => setShowClearPopup(false)}>
                Cancel
              </button>
              <button className="deleteBtn" onClick={clearChat}>
                Yes, Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div className="top">
        <div className="user">
          <div className="texts">
            <img src={user?.image || "./avatar.png"} alt="" onClick={()=>setViewprofile(true)} />

            <div>
              <span>{user?.profilename || user?.username}</span>
              <p>Online</p>
            </div>
          </div>

          {searchValue && (
            <input type="text" placeholder="Search message" onChange={searchmsg} />
          )}

          <div className="icons" >
            <img
              src="./ClearChat.svg"
              alt="Clear Chat"
              title="Clear Chat"
              onClick={() => setShowClearPopup(true)}
            />

            <img
              src="./CloseChat.svg"
              alt="Close Chat"
              title="Close Chat"
              onClick={closeChat}
            />

            <img
              src="./search.svg"
              alt="Search"
              title="Search"
              onClick={() => setSearchValue(!searchValue)}
            />
          </div>
        </div>
      </div>

      {/* CHAT MESSAGES */}
      <div className="center">

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.senderId === loggedInUser?.id ? "own" : ""}`}
          >
            {msg.senderId !== loggedInUser?.id && (
              <img src={user.image || "./avatar.png"} alt="profile" />
            )}

            <div className="texts">
              {msg.image ? (
                <img
                  src={msg.image}
                  alt="sent"
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
          <img src={selectIMG} alt="" />
          <div className="downloadBtn" onClick={() => handleDownload(selectIMG)}>
            <img src="./download.png" alt="" />
          </div>
        </div>
      )}

      {/* View Profile Image */}
      {viewprofile && (
        <div className="profilePopup" onClick={() => setViewprofile(false)}>
          <img src={user?.image || "./avatar.png"} alt="" />
        </div>
      )}

      {/* INPUT BAR */}
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.svg" alt="" />
          </label>
          <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />

          <img src="./camera.svg" alt="" />
          <img src="./mic.svg" alt="" />
        </div>

        <input
          type="text"
          placeholder="Type a message..."
          value={emojitxt}
          onChange={(e) => setemojitxt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <div className="emoji">
          <img
            src="./emoji.svg"
            alt=""
            onClick={() => setOpenmoji((prev) => !prev)}
          />

          {openemoji && (
            <div className="picker">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>

        <button className="sendButton" onClick={handleSend}>
          send
        </button>
      </div>
    </div>
  );
};

export default Chat;
