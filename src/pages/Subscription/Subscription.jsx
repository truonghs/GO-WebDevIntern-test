import React, { useState } from "react";
import style from "./Subscription.module.scss";
import classNames from "classnames/bind";
import { Header } from "../../components";
import axiosClient from "../../config/axios";
import Lottie from "lottie-react";
import { loadingAnimation } from "../../assets/animations";

const Subscription = () => {
  const cx = classNames.bind(style);
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [emailWarningLabel, setEmailWarningLabel] = useState(false);
  const [locationWarningLabel, setLocationWarningLabel] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const [isLoadingEmail, setIsLoadingEmail] = useState(false);

  const validateEmail = (email) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  };
  const handleChangeEmail = (value) => {
    setEmail(value);
    setEmailWarningLabel(false);
  };
  const handleChangeLocation = (value) => {
    setLocation(value);
    setLocationWarningLabel(false);
  };
  const handleUseCurrentLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const keyword = latitude + "," + longitude;
          if (keyword) {
            setLocation(keyword);
            setLocationWarningLabel(false);
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          setIsLoadingLocation(false);
          alert("Geolocation is not supported by this browser.");
          console.log(error);
        }
      );
    } else {
      setIsLoadingLocation(false);
      alert("Geolocation is not supported by this browser.");
      console.log("Geolocation is not supported by this browser.");
    }
  };
  const handleEmailConfirm = () => {
    setIsLoadingEmail(true);
    if (location) {
      if (validateEmail(email)) {
        axiosClient
          .post("/subscription/register", { email, location })
          .then((response) => {
            alert("You have successfully registered. Please check your email to confirm your email address!");
            setEmail("");
            setLocation("");
            setIsLoadingEmail(false);
          })
          .catch((error) => {
            alert("Registation failed!");
            setIsLoadingEmail(false);
            setEmail("");
            setLocation("");
            console.log(error);
          });
      } else {
        setIsLoadingEmail(false);
        setEmailWarningLabel(true);
      }
    } else {
      setIsLoadingEmail(false);
      setLocationWarningLabel(true);
    }
  };
  const handleUnsubscribe = () => {
    setIsLoadingEmail(true);
    if (validateEmail(email)) {
      axiosClient
        .post("/subscription/unsubscribe-request", { email })
        .then((response) => {
          alert("Your request has been approved. Please check your email to complete your unsubscription!");
          setEmail("");
          setLocation("");
          setIsLoadingEmail(false);
        })
        .catch((error) => {
          alert("Unsubscription failed!");
          setIsLoadingEmail(false);
          setEmail("");
          setLocation("");
        });
    } else {
      setIsLoadingEmail(false);
      setEmailWarningLabel(true);
    }
  };
  return (
    <div className={cx("container")}>
      <Header page={"subscribe"} />
      <div className={cx("formWrapper")}>
        <div className={cx("formContainer")}>
          <div className={cx("formHeading")}>
            <h2 className={cx("formTitle")}>Subscribe to receive daily weather forecast information via email or Unsubscribe</h2>
          </div>
          <div className={cx("inputContainer")}>
            {emailWarningLabel ? <div className={cx("warn")}>Email is invalid!</div> : null}
            <div className={cx("inputField")}>
              <input value={email} placeholder="Enter your email" className={cx("emailInput")} onChange={(e) => handleChangeEmail(e.target.value)}></input>
            </div>
            {locationWarningLabel ? <div className={cx("warn")}>Location is required!</div> : null}
            <div className={cx("inputField", "currentField")}>
              <input value={location} onChange={(e) => handleChangeLocation(e.target.value)} placeholder="E.g, New York, London, Tokyo" className={cx("currentInput")}></input>
              <div className={cx("currentBtn")}>
                {isLoadingLocation ? (
                  <div className={cx("loading")}>
                    <Lottie className={cx("loadingAnimation")} animationData={loadingAnimation} loop={true} />
                  </div>
                ) : (
                  <div onClick={handleUseCurrentLocation} className={cx("")}>
                    Use current location
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={cx("btnField")}>
            <div onClick={handleEmailConfirm} className={cx("subscribeBtn")}>
              {isLoadingEmail ? (
                <div className={cx("loading")}>
                  <Lottie className={cx("loadingAnimation")} animationData={loadingAnimation} loop={true} />
                </div>
              ) : (
                <div className={cx("")}>Subscribe</div>
              )}
            </div>
            <div onClick={handleUnsubscribe} className={cx("unsubscribeBtn")}>
              {isLoadingEmail ? (
                <div className={cx("loading")}>
                  <Lottie className={cx("loadingAnimation")} animationData={loadingAnimation} loop={true} />
                </div>
              ) : (
                <div className={cx("")}>Unsubscribe</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
