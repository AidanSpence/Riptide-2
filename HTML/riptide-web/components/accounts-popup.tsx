'use client';

import "./accounts-popup.css";
import Image from 'next/image'
import { getCurrentUser, spotifyLogin, spotifyLogout } from "../lib/api";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
type AccountPopupProps = {
    isActive: boolean;
    onClose: () => void;
};

export default function AccountPopup({ isActive, onClose }: AccountPopupProps) {

    const { accessToken } = useAuth();
    const [username, setUsername] = useState<string>("");

    useEffect(() => {
    if (!accessToken) return;

    async function loadUsername() {
        try {
        const user = await getCurrentUser(accessToken!);
        setUsername(user.username);
        } catch (error) {
        console.error("Failed to retrieve username:", error);
        }
    } 

    loadUsername();
    }, [accessToken]);

    async function disconnectSpotify() {
    if (!accessToken) return;

    try {
        await spotifyLogout(accessToken);
        window.location.reload();
    } catch (error) {
        alert(
            error instanceof Error
                ? error.message
                : "Unable to disconnect Spotify."
        );
    }
}

    return (
        <div
            id="account-dialog"
            className={`account_main${isActive ? ' is_active' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Account"
            aria-hidden={!isActive}
            inert={!isActive}
        >
        <div className="title_bar">
            <Image src="riptide-logo.svg" alt="alt" width={48} height={48} />
            <Image src="close.svg" alt="" width={30} height={30} loading="eager"
                className="account_close_button"
                onClick={onClose}
                aria-label="Close account popup" />
        </div>
        <div className="account_info">
            <div className="username">Username: {accessToken ? username : "Not Logged in"}</div>
            <div> <button className="spotify_signin" disabled={!accessToken} onClick={() => { if (accessToken) void spotifyLogin(accessToken); }}>Sign in with Spotify</button> </div>
            <div> <button className="spotify_signout" type="button"  disabled={!accessToken} onClick={disconnectSpotify} {...{ autoComplete: "off" }}>Sign out of Spotify</button> </div>



        </div>


        </div>
    );
}
