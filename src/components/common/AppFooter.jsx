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

const AppFooter = () => {
  return (
    <>
      <section className="app-download-section">
        <div className="app-download-container">
          <div className="app-content">
            <h2 className="app-title">Download My mediator Mobile App</h2>

            <div className="app-features">
              <div className="feature-item">
                <CheckIcon className="check-icon" />
                <span>
                  Get to know about newly posted property as soon they are
                  posted
                </span>
              </div>
              <div className="feature-item">
                <CheckIcon className="check-icon" />
                <span>
                  Manage your property and purchase & sale your property
                </span>
              </div>
            </div>

            <div className="app-store-buttons">
              <Link to="#" className="store-link">
                <img src={Googleplay} alt="Get it on Google Play" />
              </Link>
              <Link to="#" className="store-link">
                <img src={Appstore} alt="Download on App Store" />
              </Link>
            </div>

            <div className="download-count">
              <div className="download-badge">5M+ Downloads</div>
            </div>
          </div>

          <div className="app-image">
            <img src={MobileApp} alt="MyMediator Mobile App" />
          </div>
        </div>
      </section>
    </>
  );
};

export default AppFooter;
