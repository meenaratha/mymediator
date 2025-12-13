import { Link } from "react-router-dom";
import Logo from "../../assets/images/common/footer-logo.png";
import Googleplay from "../../assets/images/common/google-play.png";
import Appstore from "../../assets/images/common/app-store.png";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocationIcon from "../../assets/images/common/location-icon.svg";
import MobileApp from "../../assets/images/common/mobile.png";
import CheckIcon from "@mui/icons-material/Check";
import "../../assets/css/footer.css";
import EnquiryForm from "../../features/EnquiryForm";
import { useState } from "react";
import GeneralEnquiryForm from "../../features/GeneralEnquiryForm";
import { useAuth } from "../../auth/AuthContext";

const Footer = () => {
    const { isAuthenticated, user, logout, loading } = useAuth(); // Get auth state
  
  const [showEnquiryPopup, setShowEnquiryPopup] = useState(false);
  return (
    <>
     {/* Enquiry Form Popup */}
{showEnquiryPopup && (
  <GeneralEnquiryForm  onClose={() => setShowEnquiryPopup(false)}
  enquirableType="general"
  enquirableId=""
  vendorData="" />
)}
      {/* Footer Section */}
      <footer className="footer-container">
        <div className="footer-content">
          {/* Logo and Description */}
          <div className="footer-brand">
            <img src={Logo} alt="MyMediator" className="footer-logo" />
            <p className="footer-description">
              In other words, he gets up every morning to help people in his
              community find their dream home
            </p>
            <div className="app-stores">
              <Link to="#" className="store-button">
                <img
                  src={Googleplay}
                  alt="Get it on Google Play"
                  className="store-img"
                />
              </Link>
              <Link to="#" className="store-button">
                <img
                  src={Appstore}
                  alt="Download on App Store"
                  className="store-img"
                />
              </Link>
            </div>
          </div>

          {/* Categories Section */}
          <div className="footer-section">
            <h3 className="footer-heading">Categories</h3>
            <ul className="footer-links">
              <li>
                <Link to="/car">Car</Link>
              </li>
              <li>
                <Link to="/bike">Bike</Link>
              </li>
              <li>
                <Link to="/property">Property</Link>
              </li>
              <li>
                <Link to="/electronics">Electronics</Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h3 className="footer-heading">Quick Link</h3>
            <ul className="footer-links">
              {/* <li>
                <Link to="/">About Us</Link>
              </li> */}
              

              {isAuthenticated ? (<>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-and-conditions">Terms & Conditions</Link>
              </li>
              </>):(
                <>
              <li>
                <Link to="/">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/">Terms & Conditions</Link>
              </li>
              </>)}
              <li>
                <Link to="/" onClick={() => setShowEnquiryPopup(true)}>Enquiry</Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-section">
            <h3 className="footer-heading">Contacts Us</h3>
            <ul className="footer-contact">
              <li>
                <a
                  href="mailto:mymediator20@gmail.com"
                  className="contact-link"
                >
                  <EmailIcon className="contact-icon" />
                  <span>mymediator20@gmail.com</span>
                </a>
              </li>
              <li className="flex gap-2 ">
                 
                                      <LocalPhoneIcon className="contact-icon" />
 <div className="flex gap-2  flex-wrap">
                <a href="tel:9843085144" className="contact-link">
                
                  <span>9843085144 ,</span>
                </a>
                <a href="tel:7502065825" className="contact-link">
                  {/* <LocalPhoneIcon className="contact-icon" /> */}
                  <span>7502065825 ,</span>
                </a>
                <a href="tel:9345043440" className="contact-link">
                  {/* <LocalPhoneIcon className="contact-icon" /> */}
                  <span>9345043440</span>
                </a>
                </div>
              </li>
              <li className="address">
                <div className="contact-link">
                  <img
                    src={LocationIcon}
                    alt="location"
                    className="contact-icon custom-icon"
                  />
                  <span>
                   5/133C, colachel road, mulagumoodu,  <br />kanniyakumari district,  <br />pincode:629167
                   
                   
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
