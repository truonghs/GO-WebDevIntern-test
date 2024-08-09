import React, { useState } from "react";
import { GrMenu } from "react-icons/gr";
import { Link } from "react-router-dom";
import style from "./Header.module.scss";
import classNames from "classnames/bind";
function Header({ page }) {
  const cx = classNames.bind(style);

  const [sideBarVisible, setSideBarVisible] = useState(false);

  return (
    <div>
      <div className={cx("header")}>
        <div className={cx("header-wrapper")}>
          <h1 className={cx("headerTitle")}>Weather Forecast</h1>
          <div className={cx("headerNav")}>
            <Link to={"/"} className={cx("headerNav-item", page === "home" ? "active" : null)}>
              Home
            </Link>
            <Link to={"/dashboard"} className={cx("headerNav-item", page === "dashboard" ? "active" : null)}>
              Dashboard
            </Link>
            <Link to={"/subscription"} className={cx("headerNav-item", page === "subscribe" ? "active" : null)}>
              Subscribe
            </Link>
          </div>
          <div onClick={() => setSideBarVisible(!sideBarVisible)} className={cx("headerNavBtn")}>
            <GrMenu className={cx("headerNavBtnIcon")} />
          </div>
        </div>
      </div>
      <div onClick={() => setSideBarVisible(!sideBarVisible)} className={cx("overlay", sideBarVisible ? "overlay-active" : "")}></div>
      <div className={cx("sideBar", sideBarVisible ? "sideBar-active" : "")}>
        <Link to={"/"} className={cx("headerNav-item", "active")}>
          Home
        </Link>
        <Link to={"/dashboard"} className={cx("headerNav-item")}>
          Dashboard
        </Link>
        <Link to={"/subscription"} className={cx("headerNav-item")}>
          Subscribe
        </Link>
      </div>
    </div>
  );
}

export default Header;
