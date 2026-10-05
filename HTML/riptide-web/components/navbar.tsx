import Image from 'next/image'

export default function Navbar() {
    return(
        <nav className="navbar">
            <div className="left_nav">
                <div className="nav_logo">Logo here</div>
            </div>

            <div className="right_nav">

                <div className="nav_settings">
                    <Image className="settings_img" src="settings.svg" alt="settings" width={10} height={10} />
                </div>

                <div className="nav_profile">profile here</div>

            </div>
        </nav>

    )}