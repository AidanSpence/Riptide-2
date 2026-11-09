'use client';

import Image from 'next/image'
import "./navbar.css";
import Login_popup from "@/components/login-popup";
import AccountPopup from "@/components/accounts-popup";
import { useAuth } from "./auth-provider";
import {getCurrentUser} from '../lib/api'
import React, { useEffect, useRef, useState } from "react";
export default function Navbar() {
    // defines the state of the popup
    const [loginActive, setLoginActive] = useState(false);
    const [accountActive, setAccountActive] = useState(false);
    const { accessToken, logout } = useAuth();
    const [username, setUsername] = useState<string>("");
    
    
    async function loadUsername() {
          try {
          const user = await getCurrentUser(accessToken!);
          setUsername(user.username);
          } catch (error) {
          console.error("Failed to retrieve username:", error);
          }
      } 
    useEffect(() => {
        if (!accessToken) return;

        void loadUsername();
    }, [accessToken]);

    function getInitials(username: string): string {
        return username
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join("");
    }
    return(

        <nav className="navbar">
            <Login_popup
            isActive={loginActive}
            // if the onclose, set .is_active to false to hide the popup
            onClose={() => setLoginActive(false)}
            />
            <AccountPopup
            isActive={accountActive}
            onClose={() => setAccountActive(false)}
            ></AccountPopup>
            <div className="left_nav">
                <div className="nav_logo"><Image className="logo_image" src="riptide-logo.svg" alt="logo" width={32} height={32} loading="eager" /></div>
                <div className="nav_title"><h1>Riptide</h1></div>
            </div>

            <div className="right_nav">

                <button className="nav_settings" onClick={() => 
                {
                    setAccountActive((active) => !active)
                    setLoginActive(false)
                }
                }>
                    <Image className="settings_img" src="settings.svg" alt="settings" width={10} height={10} />
                </button>

                <div className='button_border'>
                    <button className="nav_profile_border" onClick={() => 
                {
                    setAccountActive(false)
                    setLoginActive((active) => !active)
                }}>
                        <div className="nav_profile">{username? getInitials(username): "JD"}</div>
                    </button>
                </div>

            </div>
        </nav>
    )}