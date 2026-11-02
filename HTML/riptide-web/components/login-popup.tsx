'use client';

import Image from 'next/image'
import "./login-popup.css";
import { useState } from 'react'


// defines a type for the button
type LoginPopupProps = {
    isActive: boolean;
    onClose: () => void;
};



export default function Login_popup({ isActive, onClose }: LoginPopupProps)
{
    const [isRegister, setIsRegister] = useState(false);

    function showRegister() {
    setIsRegister(true);
    }

    function showLogin() {
    setIsRegister(false);
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
        {/* Left LOGIN */}
        <div className='left_login'
        style={{ display: isRegister ? "none" : "flex" }}>
            <div id="login-title" className='login_title_left'>Sign into Riptide</div>
            {/* Username box */}
            <div className='username_box'>
                <div className='username_text'>Username:</div>
                <input
                className='username_input'
                id="login-username"
                name="username"
                type="text"
                autoComplete="username"
                required
                ></input>
            </div>
            {/* Password box */}

            <div className='password_box'>
                <div className='password_text'>Password:</div>
                <input
                className='password_input'
                id="login-password"
                name="password"
                type="password"
                autoComplete="password"
                required
                ></input>
            </div>
            {/* add onClick={apiLogin} */}
            <div className='login_button_box'>
                <button className='login_button' type='submit'>Login</button>
            </div>

            <div className='register_button_box'>
                <button className='register_button' type='button' onClick={showRegister}>Register</button>
            </div>
        </div>





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
                id="new_login-username"
                name="new_username"
                type="text"
                autoComplete="new_username"
                required
                ></input>
            </div>
            {/* Password box */}

            <div className='new_password_box'>
                <div className='new_password_text'>New Password:</div>
                <input
                className='new_password_input'
                id="new_login_password"
                name="new_password"
                type="Password"
                autoComplete="new_password"
                required
                ></input>
            </div>
            <div className='confirm_new_password_box'>
                <div className='confirm_password_text'>Confirm Password:</div>
                <input
                className='confirm_password_input'
                id="confirm_login-password"
                name="confirm_password"
                type="Password"
                autoComplete="confirm_password"
                required
                ></input>
            </div>
            {/* add onClick={apiLogin} */}
            <div className='register_submit_button_box'>
                <button className='register_submit_button' type='submit'>Register</button>
            </div>

            <div className='return_login_button_box'>
                <button className='return_login_button' type='button' onClick={showLogin}>Back To Login</button>
            </div>
        </div>



        {/* right */}
        <div className='right_login'>
        <div className='title_riptide_login'>Riptide</div>
        <Image className="accent_login" src="accent.png" alt="alt" width={30} height={30} loading='eager' unoptimized />
        </div>
        </div>
    </div>
    )
}