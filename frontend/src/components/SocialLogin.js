
import googleLogo from '../css/images/google.svg'
import appleLogo from '../css/images/apple.svg'
const SocialLogin = () => {
    return (
      <div className="social-login">
        <button className="social-button">
          <img src={googleLogo} alt="Google" className="social-icon" />
          Google
        </button>
        <button className="social-button">
          <img src={appleLogo} alt="Apple" className="social-icon" />
          Apple
        </button>
      </div>
    )
  }
  export default SocialLogin;