import React, { useState } from "react";
import style from "./Unsubscribe.module.scss";
import classNames from "classnames/bind";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../../config/axios";
function Unsubscribe() {
  const cx = classNames.bind(style);
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const token = new URLSearchParams(location.search).get("token");

  const email = new URLSearchParams(location.search).get("email");
  const handleClick = () => {
    setIsLoading(true);
    if (!email) {
      console.error("No email found in the URL");
      setIsLoading(false);
      setIsError(true);
      return;
    }
    let isMounted = true;
    axiosClient
      .post("/subscription/unsubscribe", { email, token })
      .then((response) => {
        if (isMounted) {
          setIsLoading(false);
          setIsSuccess(true);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setIsLoading(false);
          setIsError(true);
          console.error(error);
        }
      });
  };
  return (
    <div className={cx("container")}>
      {!isError && !isSuccess && !isLoading ? (
        <div className={cx("body")}>
          <h2 className={cx("title")}>Are you sure you want to unsubscribe from our service?</h2>
          <div className={cx("desc")}>Click the button below to confirm your unsubscription</div>
          <div onClick={handleClick} className={cx("button")}>
            Confirm!
          </div>
        </div>
      ) : null}
      {isSuccess ? (
        <div className={cx("body")}>
          <h2 className={cx("title", "success")}>Unsubscribe confirmation successful</h2>
          <div className={cx("desc")}>Click the button below to be taken to our home page</div>
          <div onClick={() => navigate("/")} className={cx("button", "success")}>
            Home!
          </div>
        </div>
      ) : null}
      {isLoading ? <div className={cx("loading")}>Loading...</div> : null}
      {isError ? (
        <div className={cx("body")}>
          <h2 className={cx("title", "error")}>Unsubscribe confirmation failed</h2>
          <div className={cx("desc")}>Click the button below to be taken to our home page</div>
          <div onClick={() => navigate("/")} className={cx("button", "error")}>
            Home!
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Unsubscribe;
