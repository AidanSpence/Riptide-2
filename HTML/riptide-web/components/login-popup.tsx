import Image from 'next/image'
import "./login-popup.css";

export default function Login_popup()
{
    return(
    <div className='login_main'>
        <div className='title_bar'>
            <Image className="logo_login" src="riptide-logo.svg" alt="alt" width={30} height={30} loading="eager" />
            <Image className="close_login" src="close.svg" alt="alt" width={30} height={30} loading="eager" />
        </div>
    <div className='left_right_container_login'>
        <div className='left_login'>

        </div>
        <div className='right_login'>
        <div className='title_riptide_login'>Riptide</div>
        <Image className="accent_login" src="image.png" alt="alt" width={30} height={30} unoptimized/>
        </div>
    </div>
    </div>
    )
}