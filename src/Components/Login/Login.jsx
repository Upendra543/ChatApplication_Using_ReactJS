import React, { useState } from 'react'
import { toast } from "sonner";
import axios from 'axios';

const Login = ({ handleEmail, submitLogin }) => {

    const [avatar, setAvatar] = useState({ file: null, url: "" });
    const [signupValues, setSignupValues] = useState({ username: "", email: "", password: "" });

    const handleAvatar = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar({
                    file: file,
                    url: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSignupChange = (e) => {
        setSignupValues({ ...signupValues, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!signupValues.email || !signupValues.password || !signupValues.username) {
            return toast.error("All fields required!");
        }

        const newUser = { ...signupValues, image: avatar.url || "", chat: [],profilename:"" };

        try {
            await axios.post("https://chatappdb-fxka.onrender.com/userslogin", newUser);
            toast.success("Account created!");
            setSignupValues({ username: "", email: "", password: "" });
            setAvatar({ file: null, url: "" });
        } catch (err) {
            toast.error("Failed to signup!");
            console.log(err);
        }
    };

    return (
        <div className='login'>
            <div className="item">
                <h2>Welcome back,</h2>
                <form onSubmit={submitLogin}>
                    <input type="text" placeholder='Email' name='email' onChange={handleEmail} />
                    <input type="text" placeholder='password' name='password' onChange={handleEmail} />
                    <button>Sign In</button>
                </form>
            </div>

            <div className="separator"></div>

            <div className="item">
                <h2>Create an Account</h2>
                <form onSubmit={handleSignup}>
                    <label htmlFor="file">
                        <img src={avatar.url || "./avatar.png"} alt="" />
                        Upload an Image
                    </label>
                    <input type="file" id='file' style={{ display: "none" }} onChange={handleAvatar} />

                    <input type="text" placeholder='Username' name='username' value={signupValues.username} onChange={handleSignupChange} />
                    <input type="text" placeholder='Email' name='email' value={signupValues.email} onChange={handleSignupChange} />
                    <input type="text" placeholder='password' name='password' value={signupValues.password} onChange={handleSignupChange} />

                    <button type='submit'>Sign Up</button>
                </form>
            </div>
        </div>
    )
}

export default Login
