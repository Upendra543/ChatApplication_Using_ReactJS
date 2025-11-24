import React, { useContext, useEffect,useState } from 'react'

import { UserContext } from '../App'
import axios from 'axios';

const Details = () => {

  const {chatlistID,logout} = useContext(UserContext);

  const [dispalayUser, setDisplayUser] = useState([]);
  const [arrow, setArrow] = useState(false);

  useEffect(()=>{
    if(!chatlistID){
      return;
    }

    axios.get(`https://chatappdb-fxka.onrender.com/userslogin`).then(res=> setDisplayUser(res.data.find(u=> u.id === chatlistID)))

  },[chatlistID])

  const handleSharedimg = () => {
    setArrow(!arrow);
  }

  console.log(dispalayUser);
  
  return (
    chatlistID?(
      <div className='Details'>
      <div className="user">
        <img src={dispalayUser.image || "./avatar.png"} alt="" width={100} />
        <h2>{dispalayUser.username}</h2>
        <p>{dispalayUser.email}</p>
        <p>{dispalayUser.bio}</p>
      </div>
      <div className="info">
        {/* <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.svg" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.svg" alt="" />
          </div>
        </div> */}

        <div className="option">
          <div className="title" onClick={handleSharedimg}>
            <span>Shared photos</span>
            {arrow ? <img src="./arrowDown.svg" alt="" /> : <img src="./arrowUp.svg" alt="" />  }
          </div>
          {arrow && (<div className="photos">
            {
              dispalayUser.chat && dispalayUser.chat.map((m,i)=> m.image && (
                <div className="photoItem" key={i}>
                  <div className="photoDetail">
                    <img src={m.image} alt="" />
                    <span>Photo_{i+1}.png</span>
                  </div>
                  {/* <img src="./download.svg" alt="" className="icon"/> */}
                </div>
              ))
            }
          </div>)
          }
        </div>
        {/* <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.svg" alt="" />
          </div>
        </div> */}
        <button>Block User</button>
        <button className='logout' onClick={logout}>Logout</button>
      </div>
    </div>
    ):<div className="Details noChatSelected" style={{display:"flex",justifyContent:"center",alignItems:"center"}}>Select a chat to see details</div>
  )
}

export default Details
