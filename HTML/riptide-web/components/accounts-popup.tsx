'use client';

import "./accounts-popup.css";
import Image from 'next/image'
import {} from '../lib/api'

type AccountPopupProps = {
    isActive: boolean;
    onClose: () => void;
};

export default function AccountPopup({ isActive, onClose }: AccountPopupProps) {
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
            <button
                className="account_close_button"
                type="button"
                onClick={onClose}
                aria-label="Close account popup"
            >
                ×
            </button>
        </div>
        <div className="account_info">
            <div className="username"> </div>
            <div className="spotify_signin"></div>
            <div className="spotify_signout"></div>



        </div>


        </div>
    );
}
