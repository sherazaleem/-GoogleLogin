import React, { useState, useEffect, useRef } from 'react';
import Isolation_Mode from './Isolation_Mode.png';
import Frame from './Frame.png';
import Group from './Group.png';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css"; // 👈 custom CSS file
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const googleButtonRef = useRef(null);

  // Function to check if email exists and trigger Google login
  const checkEmailAndTriggerGoogle = async (emailToCheck) => {
    if (!emailToCheck) {
      toast.success("Please enter an email address");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (emailToCheck.includes('@')) {
        const response = await fetch("https://devapi.convosoftserver.com/api/checkemail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (data?.status === 'success' && data?.data) {
          setTimeout(() => {
            if (googleButtonRef.current) {
              const googleButton = googleButtonRef.current.querySelector('div[role="button"]');
              if (googleButton) {
                googleButton.click();
              } else {
                googleButtonRef.current.click();
              }
            }
          }, 100);
        } else if (data?.status === 'failed') {
          setIsSubmitting(false);
          setEmailError(data?.message || 'Invalid email');
        }
      } else {
        toast.error("Please enter a valid email address...");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Error checking email. Please try again....");
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    const user = jwtDecode(token);
    console.log("Google User:", user);

    // Automatically set email from Google login
    if (user && user.email) {
      setEmail(user.email);
    }

    try {
      const response = await fetch("https://devapi.convosoftserver.com/api/googlelogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email }),
      });

      const data = await response.json();
      if (data?.status === 'success' && data?.data) {
        window.location.href = 'https://sandbox.scorp-erp.com/autoLoginById?user_id=' + data?.data?.encrptID;
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    console.log("Google Login Failed");
    setIsSubmitting(false);
  };

  useEffect(() => {
    // Add Bootstrap & Font Awesome dynamically
    const links = [
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' },
    ];
    const scripts = [
      { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js' },
    ];

    links.forEach(link => {
      const el = document.createElement('link');
      el.rel = link.rel;
      el.href = link.href;
      document.head.appendChild(el);
    });

    scripts.forEach(script => {
      const el = document.createElement('script');
      el.src = script.src;
      document.body.appendChild(el);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    checkEmailAndTriggerGoogle(email);
  };

  const handleLanguageChange = (e) => {
    if (e.target.value) window.location.href = e.target.value;
  };

  return (
    <GoogleOAuthProvider clientId="280269322109-j0lgcghauaug9rmlkoqr65if6dcimbql.apps.googleusercontent.com">
      <div style={{ overflow: 'hidden', minHeight: '100vh' }}>
        <style>{`
          body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
          .logosite { max-width: 200px; height: auto; }
          .loginimg { max-width: 100%; width: 500px; height: auto; }
          .textper { font-size: 2rem; font-weight: bold; }
          .textp { font-size: 1.1rem; opacity: 0.8; }
          .mainlogindiv { max-width: 400px; width: 90%; }
          .login-form-container { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); border-radius: 25px; }
          .login-button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; border-radius: 25px; color: white; font-weight: bold; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
          .login-button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4); }
          .login-button:disabled { opacity: 0.7; cursor: not-allowed; }
          .language-select { border-radius: 5px; cursor: pointer; }
          .input-group-text { border: none; border-top-left-radius: 10px; border-bottom-left-radius: 10px; }
          .form-control { border-top-right-radius: 10px; border-bottom-right-radius: 10px; }
          .nav-link { color: #1F2635 !important; font-weight: 500; }
          .nav-link:hover { color: #667eea !important; }
          .hidden-google-button {
            position: fixed !important;
            top: -100px !important;
            left: -100px !important;
            width: 1px !important;
            height: 1px !important;
            opacity: 0.01 !important;
            pointer-events: none !important;
            overflow: hidden !important;
          }
          @media (max-width: 768px) {
            .textper { font-size: 1.5rem; }
            .textp { font-size: 1rem; }
            .loginimg { width: 300px; }
          }
        `}</style>

        <div className="container-fluid px-0">
          {/* Navigation Bar */}
          <nav className="navbar navbar-expand-md navbar-light" style={{ backgroundColor: '#B3CDE1' }}>
            <div className="container-fluid px-md-5 mx-lg-5">
              <a className="navbar-brand w-50" href="#">
                <img src={Isolation_Mode} alt="Logo" className="logosite" />
              </a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon" />
              </button>
              <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <a className="nav-link active" target="_blank" rel="noopener noreferrer"
                      href="https://convosoft-team.atlassian.net/servicedesk/customer/portal/1">Support</a>
                  </li>
                  <li className="nav-item"><a className="nav-link" href="#">Terms</a></li>
                  <li className="nav-item"><a className="nav-link" href="#">Privacy</a></li>
                  <li className="nav-item">
                    <select className="btn btn-dark px-3 mx-2 language-select" onChange={handleLanguageChange}>
                      <option value="https://erp.scorp-erp.com/login/ar">AR</option>
                      <option value="https://erp.scorp-erp.com/login/da">DA</option>
                      <option value="https://erp.scorp-erp.com/login/de">DE</option>
                      <option value="https://erp.scorp-erp.com/login/en" defaultValue>EN</option>
                      <option value="https://erp.scorp-erp.com/login/es">ES</option>
                      <option value="https://erp.scorp-erp.com/login/fr">FR</option>
                      <option value="https://erp.scorp-erp.com/login/gtr">GTR</option>
                      <option value="https://erp.scorp-erp.com/login/it">IT</option>
                      <option value="https://erp.scorp-erp.com/login/ja">JA</option>
                      <option value="https://erp.scorp-erp.com/login/nl">NL</option>
                      <option value="https://erp.scorp-erp.com/login/pl">PL</option>
                      <option value="https://erp.scorp-erp.com/login/pt">PT</option>
                      <option value="https://erp.scorp-erp.com/login/ru">RU</option>
                    </select>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <div className="row px-0 mx-0 justify-content-end" style={{ minHeight: 'calc(100vh - 80px)' }}>
            {/* Left Section */}
            <div className="col-lg-8 col-md-7 d-none d-md-flex justify-content-center align-items-center py-5">
              <div className="mainlogindiv text-center">
                <img src={Frame} alt="Login Illustration" className="loginimg" />
                <div className="mt-3 mx-auto">
                  <p className="textper mb-0 my-3" style={{ color: '#1F2635' }}>Attention is the New Currency</p>
                  <p className="textp" style={{ color: '#1F2635' }}>
                    The more effortless the writing looks, the more effort the writer actually put into the process.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="col-12 col-md-4 d-flex align-items-center justify-content-center py-5 px-0"
              style={{ backgroundColor: '#1F2635' }}>
              <div className="mainlogindiv">
                <div className="border border-3 p-4 login-form-container"
                  style={{ background: 'linear-gradient(to bottom right, rgb(122 122 122 / 24%), #cac9c987, rgb(71 71 71))' }}>
                  <div className="text-center mb-3">
                    <img src={Group} alt="User Icon" style={{ width: '50%' }} />
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="input-group mb-3 border-0 py-1">
                      <span className="input-group-text bg-white ps-2 pe-2">
                        <i className="fa-solid fa-user" />
                      </span>
                      <input
                        className="form-control border-0"
                        placeholder="Email ID"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        style={{ backgroundColor: 'rgb(204, 204, 204)' }}
                      />
                    </div>
                    {emailError && (
                      <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '-10px' }}>
                        {emailError}
                      </p>
                    )}


                    <div className="text-center">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                          position: "relative",
                          overflow: "hidden",
                          backgroundColor: "rgba(30, 31, 30, 1)",
                          color: "white",
                          padding: "5px 65px",
                          borderRadius: "5px"
                        }}
                      >
                        {isSubmitting ? 'LOGIN...' : 'LOGIN'}
                      </button>
                    </div>
                  </form>

                  {/* Hidden Google Login Button - Must be properly rendered */}
                  <div
                    ref={googleButtonRef}
                    className="hidden-google-button"
                  >
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap={false}
                    />
                  </div>
                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    toastClassName="custom-toast"
                    bodyClassName="custom-toast-body"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;