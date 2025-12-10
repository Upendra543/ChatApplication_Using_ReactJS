import React, { useContext, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { UserContext } from "../App";

const UserInfo = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { logout } = useContext(UserContext);

  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(user.profilename || user.username);
  const [menuValue, setMenuValue] = useState(false);
  const [profileImage, setProfileImage] = useState(user.image);

  // ⭐ BIO STATES
  const [biovalue, setBiovalue] = useState(false);
  const [bio, setBio] = useState(user.bio || "");

  const fileInputRef = useRef(null);

  // ⭐ Save Bio
  const saveBio = async () => {
    try {
      await axios.patch(`https://chatappdb-fxka.onrender.com/userslogin/${user.id}`, {
        bio: bio,
      });

      const updatedUser = { ...user, bio };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setBiovalue(false);
      toast.success("Bio updated!");
    } catch (error) {
      console.log("Error updating bio:", error);
      toast.error("Failed to update bio");
    }
  };

  const changeBio = () => setBiovalue(true);

  // ⭐ Save Profile Name
  const saveProfileName = async () => {
    if (!name.trim()) return;

    try {
      await axios.patch(`https://chatappdb-fxka.onrender.com/userslogin/${user.id}`, {
        profilename: name,
      });

      const updatedUser = { ...user, profilename: name };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setEdit(false);
      toast.success("Profile name updated!");
    } catch (error) {
      console.log("Error updating name:", error);
      toast.error("Failed to update profile name");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") saveProfileName();
  };

  const openMenu = () => setMenuValue(!menuValue);

  // ⭐ Open file selector
  const changeProfile = () => fileInputRef.current.click();

  // ⭐ Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imgURL = URL.createObjectURL(file);
    setProfileImage(imgURL);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;

        await axios.patch(`https://chatappdb-fxka.onrender.com/userslogin/${user.id}`, {
          image: base64Image,
        });

        const updatedUser = { ...user, image: base64Image };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        toast.success("Profile picture updated!");
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.log("Error updating image:", error);
      toast.error("Failed to update profile picture");
    }
  };

  return (
    <div className="UserInfo" >
      <div className="user">
        <img src={profileImage || "./avatar.png"} alt="" />

        {edit ? (
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              padding: "4px 6px",
              width: "200px",
              fontSize: "18px",
              borderRadius: "5px",
              outline: "none"
            }}
          />
        ) : (
          <h2>{user.profilename || user.username}</h2>
        )}
      </div>

      <div className="icons">
        <img src="./more.svg" alt="" title="more" onClick={openMenu} />

        {menuValue && (
          <div className="menu">
            <img src={profileImage || "./avatar.png"} alt="" />
            <h3>{user.profilename || user.username}</h3>
            <p>{user.email}</p>

            {/* ⭐ BIO SECTION */}
            <div className="bio" >
              {biovalue ? (
                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    autoFocus
                    className="bioinput"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveBio();
                    }}
                    
                  />
                  <button onClick={saveBio} className="saveBioBtn">
                    Save
                  </button>
                </div>
              ) : (
                <p>{bio || "No bio added"}</p>
              )}

              {!biovalue && (
                <img
                  src="./penEdit.svg"
                  alt=""
                  className="bioEdit"
                  onClick={changeBio}
                />
              )}
            </div>

            <hr style={{ width: "100%" }} />
            <div className="menuItem" onClick={changeProfile}>
              Update Profile
            </div>
            <div className="menuItem" onClick={logout}>
              Logout
            </div>
          </div>
        )}

        <img src="./video.svg" alt="" title="video" />

        <img
          src="./edit.svg"
          alt=""
          style={{ cursor: "pointer" }}
          title="edit"
          onClick={() => {
            if (edit) saveProfileName();
            else setEdit(true);
          }}
        />
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default UserInfo;
