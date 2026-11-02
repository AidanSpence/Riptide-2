'use client';

import Image from 'next/image'
import "./login-popup.css";
import { useState } from 'react'
import {login, register} from "../lib/api"
import { useAuth } from "./auth-provider"

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
    const [authError, setAuthError] = useState<string>("");
    const [authMessage, setAuthMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // access the login keys shared with the main page
    const { accessToken, setTokens, logout } = useAuth();

    function showRegister() {
        setAuthError("");
        setAuthMessage("");
        setIsRegister(true);
    }

    function showLogin() {
        setAuthError("");
        setAuthMessage("");
        setIsRegister(false);
    }

    async function sendRegister(event : React.SubmitEvent<HTMLFormElement>){
        // stop the default form reload, even if the passwords don't match
        event.preventDefault();
        if (isSubmitting) return;

        setAuthError("");
        setAuthMessage("");
        if (password !== confirmPassword) {
            setAuthError("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);
        try {
            await register(username, password);
            // account created; switch to login rather than logging in automatically
            setPassword("");
            setConfirmPassword("");
            setIsRegister(false);
            setAuthMessage("Account created. You can now log in.");
        } catch (error) {
            setAuthError(error instanceof Error ? error.message : "Registration failed.");
            console.error("Registration failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function sendLogin(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        setAuthError("");
        setAuthMessage("");
        try {
            const tokens = await login(username, password);

            // store the tokens in memory instead of printing them to the console
            setTokens(tokens);
            setPassword("");
            setConfirmPassword("");
            onClose();

            console.log("Login successful");
        } catch (error) {
            setAuthError("Login failed. Check your username and password.");
            console.error("Login failed:", error);
        } finally {
            setIsSubmitting(false);
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
        <form
        onSubmit={sendLogin}
        style={{ display: isRegister && !accessToken ? "none" : "block" }}
        >
            {/* Left LOGIN */}
            <div className='left_login'
            style={{ display: isRegister ? "none" : "flex" }}>
                {accessToken ? (
                  <>
                    {/* re-use the existing login panel for logout, without changing its layout */}
                    <div id="login-title" className='login_title_left'>Signed in</div>
                    <button className="logout_button" type="button" onClick={() => { logout(); onClose(); }}>
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                <div id="login-title" className='login_title_left'>Sign into Riptide</div>
                {/* Username box */}
                <div className='username_box'>
                    <div className='username_text'>Username:</div>
                    <input
                    className='username_input'
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={username}
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
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    autoComplete="current-password"
                    required
                    ></input>
                </div>

                {/* message from the login request */}
                {authError && <div role="alert">{authError}</div>}
                {authMessage && <div role="status">{authMessage}</div>}
                {/* Login button */}
                <button className="login_button" type="submit" disabled={isSubmitting}>
                    Login
                </button>

                <div className='register_button_box'>
                    <button className='register_button' type='button' onClick={showRegister}>Register</button>
                </div>
                  </>
                )}
            </div>
        </form>

        <form
            onSubmit={sendRegister}
            style={{ display: isRegister && !accessToken ? "block" : "none" }}
        >
            {/* Left REGISTER */}
            <div className='left_register'
                style={{ display: isRegister && !accessToken ? "flex" : "none" }}
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

                {/* message from the register request */}
                {authError && <div role="alert">{authError}</div>}
                {/* Register button */}
                <button className="register_submit_button" type="submit" disabled={isSubmitting}>
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