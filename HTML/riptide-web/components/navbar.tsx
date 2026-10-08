import Image from 'next/image'
import "./navbar.css";

export default function Navbar() {
    return(
        <nav className="navbar">
            <div className="left_nav">
                <div className="nav_logo"><Image className="logo_image" src="riptide-logo.svg" alt="logo" width={32} height={32} loading="eager" /></div>
            </div>

            <div className="right_nav">

                <div className="nav_settings">
                    <Image className="settings_img" src="settings.svg" alt="settings" width={10} height={10} />
                </div>

                <div className="nav_profile_border">
                    <div className="nav_profile">JD</div>
                </div>

            </div>
        </nav>

    )}