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

const Footer = () => {
  const [showEnquiryPopup, setShowEnquiryPopup] = useState(false);
  return (
    <>
     {/* Enquiry Form Popup */}
{showEnquiryPopup && (
  <EnquiryForm onClose={() => setShowEnquiryPopup(false)} />
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
              <li>
                <Link to="/">About Us</Link>
              </li>
              <li>
                <Link to="/">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/">Terms & Conditions</Link>
              </li>
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
                  href="mailto:discount.mark@gmail.com"
                  className="contact-link"
                >
                  <EmailIcon className="contact-icon" />
                  <span>discount.mark@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+919645223547" className="contact-link">
                  <LocalPhoneIcon className="contact-icon" />
                  <span>+91 96452 23547</span>
                </a>
              </li>
              <li className="address">
                <div className="contact-link">
                  <img
                    src={LocationIcon}
                    alt="location"
                    className="contact-icon custom-icon"
                  />
                  <span>
                    no 3/1,1st street,
                    <br />
                    mambalam,chennai-60033
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
