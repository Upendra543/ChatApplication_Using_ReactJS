import React, { useEffect, useState,useContext } from 'react'
import Addusers from './AddUsers/Addusers';
import axios from "axios";
import { UserContext } from '../App'

const ChatList = () => {
  const { chatlistID, setChatlistID } = useContext(UserContext);
  
  const [addmode, setAddmode] = useState(false);
  const [friends, setFriends] = useState([]);
  
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    const res = await axios.get(`https://chatappdb-fxka.onrender.com/userslogin/${user.id}`);
    const friendIds = res.data.friends || [];

    const result = await Promise.all(
      friendIds.map(id => axios.get(`https://chatappdb-fxka.onrender.com/userslogin/${id}`))
    );

    setFriends(result.map(r => r.data));
  };

  const handleSelectChat = (e) => {
    // setChatlistID(id);
    const searchTerm = e.target.value.toLowerCase();
    const filteredFriends = friends.filter(f =>
      f.username.toLowerCase().includes(searchTerm)
    );
    if(searchTerm === ""){
      loadFriends();
    }else{
      setFriends(filteredFriends);
    }
    
    
  }
 

  // console.log(chatlistID);
  
  return (
    <div className='ChatList'>
      <div className="search">
        <div className="searchbar">
          <img src="./search.svg" alt="" />
          <input type="text" placeholder='Search' onChange={handleSelectChat}/>
        </div>
        <img
          onClick={() => setAddmode(prev => !prev)}
          src={addmode ? "./minus.png" : "./plus.svg"}
          alt=""
          className='add'
        />
      </div>

      {friends.map((f) => (
        <div className="item" key={f.id} onClick={() => setChatlistID(f.id)}>
          <img src={f.image || "./avatar.png"} alt=""/>
          <div className="texts">
            <span>{f.username}</span>
            <p>Click to chat</p>
          </div>
        </div>
      ))}

      {addmode && <Addusers loadFriends={loadFriends} />}
    </div>
  );
}


export default ChatList;
