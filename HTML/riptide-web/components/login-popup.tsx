'use client';

import Image from 'next/image'
import "./login-popup.css";


// defines a type for the button
type LoginPopupProps = {
    isActive: boolean;
    onClose: () => void;
};

export default function Login_popup({ isActive, onClose }: LoginPopupProps)
{
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
        <div className='left_login'>
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
            id="login-username"
            name="username"
            type="text"
            autoComplete="username"
            required
            ></input>
        </div>

        <div className='login_button_box'><button className='login_button' type='submit'>Login</button></div>


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