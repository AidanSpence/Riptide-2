'use client';

import Image from 'next/image'
import "./login-popup.css";
import { useState } from 'react'
import {login, register} from "../lib/api"

// defines a type for the button
type LoginPopupProps = {
    isActive: boolean;
    onClose: () => void;
};



export default function Login_popup({ isActive, onClose }: LoginPopupProps)
{
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    function showRegister() {
    setIsRegister(true);
    }

    function showLogin() {
    setIsRegister(false);
    }

    async function sendRegister(event : React.SubmitEvent<HTMLFormElement>){
        if (password === confirmPassword)
        {
        event.preventDefault();
        register(username, password)}
        }

    async function sendLogin(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const tokens = await login(username, password);

            const accessToken = tokens.access;
            const refreshToken = tokens.refresh;

            // TODO: Handle authenticated session
            console.log(accessToken)
            console.log(refreshToken)

            console.log("Login successful");

        } catch (error) {
            console.error("Login failed:", error);
        }
    }



    return(
    <div
        id="login-dialog"
        className={`login_main${isActive ? ' is_active' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        aria-hidden={!isActive}
    >

        {/* top bar */}
        <div className='title_bar'>
            <Image className="logo_login" src="riptide-logo.svg" alt="alt" width={30} height={30} loading="eager" />
            <button className="close_login_button" type="button" aria-label="Close sign-in dialog" onClick={onClose}>
                <Image className="close_login" src="close.svg" alt="" width={30} height={30} loading="eager" />
            </button>
        </div>
        {/* left */}








    <div className='left_right_container_login'>
        <form onSubmit={sendLogin}>
            {/* Left LOGIN */}
            <div className='left_login'
            style={{ display: isRegister ? "none" : "flex" }}>
                <div id="login-title" className='login_title_left'>Sign into Riptide</div>
                {/* Username box */}
                <div className='username_box'>
                    <div className='username_text'>Email:</div>
                    <input
                    className='username_input'
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    onChange={(event) => setUsername(event.currentTarget.value)}
                    required
                    ></input>
                </div>
                {/* Password box */}

                <div className='password_box'>
                    <div className='password_text'>Password:</div>
                    <input
                    className='password_input'
                    id="password"
                    name="password"
                    type="password"
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    autoComplete="password"
                    required
                    ></input>
                </div>

                {/* Login button */}
                <button className="login_button" type="submit">
                    Login
                </button>

                <div className='register_button_box'>
                    <button className='register_button' type='button' onClick={showRegister}>Register</button>
                </div>
            </div>
        </form>



        <form onSubmit={sendRegister}>
            {/* Left REGISTER */}
            <div className='left_register'
                style={{ display: isRegister ? "flex" : "none" }}
            >

                <div id="register-title" className='register_title_left'>Register your account</div>

                {/* Username box */}
                <div className='new_username_box'>
                    <div className='new_username_text'>Username:</div>
                    <input
                        className='new_username_input'
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        value={username}
                        onChange={(event) => setUsername(event.currentTarget.value)}
                        required
                    />
                </div>

                {/* Password box */}
                <div className='new_password_box'>
                    <div className='new_password_text'>New Password:</div>
                    <input
                        className='new_password_input'
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => setPassword(event.currentTarget.value)}
                        required
                    />
                </div>

                {/* Confirm password box */}
                <div className='confirm_new_password_box'>
                    <div className='confirm_password_text'>Confirm Password:</div>
                    <input
                        className='confirm_password_input'
                        id="confirm_password"
                        name="confirm_password"
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.currentTarget.value)}
                        required
                    />
                </div>

                {/* Register button */}
                <button className="register_submit_button" type="submit">
                    Register
                </button>

                {/* Return to login */}
                <div className='return_login_button_box'>
                    <button
                        className='return_login_button'
                        type='button'
                        onClick={showLogin}
                    >
                        Back To Login
                    </button>
                </div>

            </div>
        </form>


        {/* right */}
        <div className='right_login'>
        <div className='title_riptide_login'>Riptide</div>
        <Image className="accent_login" src="accent.png" alt="alt" width={30} height={30} loading='eager' unoptimized />
        </div>
        </div>
    </div>
    )
}