'use client';

import "./accounts-popup.css";

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
            <button
                className="account_close_button"
                type="button"
                onClick={onClose}
                aria-label="Close account popup"
            >
                ×
            </button>
        </div>
        <div className=""></div>


        </div>
    );
}
