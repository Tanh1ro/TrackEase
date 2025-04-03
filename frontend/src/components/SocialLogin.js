import googleLogo from '../css/images/google.svg'
import appleLogo from '../css/images/apple.svg'

const SocialLogin = ({ onGoogleLogin, onAppleLogin }) => {
    return (
      <div className="social-login">
        <button className="social-button" onClick={onGoogleLogin}>
          <img src={googleLogo} alt="Google" className="social-icon" />
          Google
        </button>
        <button className="social-button" onClick={onAppleLogin}>
          <img src={appleLogo} alt="Apple" className="social-icon" />
          Apple
        </button>
      </div>
    )
  }

export default SocialLogin;