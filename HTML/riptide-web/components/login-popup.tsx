import Image from 'next/image'
import "./login-popup.css";

export default function Login_popup()
{
    return(
    <div className='login_main'>
        {/* top bar */}
        <div className='title_bar'>
            <Image className="logo_login" src="riptide-logo.svg" alt="alt" width={30} height={30} loading="eager" />
            <Image className="close_login" src="close.svg" alt="alt" width={30} height={30} loading="eager" />
        </div>
        {/* left */}
    <div className='left_right_container_login'>
        <div className='left_login'>
        <div className='login_title_left'>Sign into Riptide</div>
        {/* Username box */}
        <div className='username_box'>
            <div className='username_text'>Username:</div>
            <div className='username_input'></div>
        </div>
        {/* Password box */}

        <div className='password_box'>
            <div className='password_text'>Password:</div>
            <div className='password_input'></div>
        </div>

        <div className='login_button_box'><button className='login_button'>Login</button></div>
        <div className=''>element</div>

        </div>
        {/* right */}
        <div className='right_login'>
        <div className='title_riptide_login'>Riptide</div>
        <Image className="accent_login" src="image.png" alt="alt" width={30} height={30} unoptimized/>
        </div>
    </div>
    </div>
    )
}