import React, { useEffect, useState } from "react";
import style from "./History.module.scss";
import classNames from "classnames/bind";
import { RiArrowGoBackFill } from "react-icons/ri";
import { json, Link } from "react-router-dom";
function History() {
  const cx = classNames.bind(style);
  const [histories, setHistories] = useState([]);
  const fetchHistory = () => {
    const weatherHistory = localStorage.getItem("weatherHistory");
    if (weatherHistory) {
      setHistories(JSON.parse(weatherHistory));
    }
  };
  useEffect(() => {
    fetchHistory();
  }, []);
  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <h2 className={cx("header-title")}>Weather History</h2>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("body")}>
          <div className={cx("heading")}>
            <h3 className={cx("heading-title")}>Recently searched</h3>
            <Link to={"/"} className={cx("heading-back")}>
              Back
              <RiArrowGoBackFill />
            </Link>
          </div>
          <div className={cx("historyList")}>
            {histories.length > 0 ? (
              histories
                .slice()
                .reverse()
                .map((history, index) => (
                  <div key={index} className={cx("currentWeather-container")}>
                    <div className={cx("currentWeather-left")}>
                      <h3 className={cx("currentWeather-title")}>
                        {history.data?.location?.name} ({history.data?.current?.last_updated.split(" ")[0]})
                      </h3>
                      <div className={cx("currentWeather-detail")}>
                        <div className={cx("currentTemp")}>Temperature: {history.data?.current?.temp_c} C</div>
                        <div className={cx("currentWind")}>Wind: {Math.round((parseFloat(history.data?.current?.wind_kph) / 3.6) * 100) / 100} M/S</div>
                        <div className={cx("currentHumidity")}>Humidity: {history.data?.current?.humidity}%</div>
                        <div className={cx("currentHumidity")}>Last Updated: {history.data?.current?.last_updated} (Local time)</div>
                      </div>
                    </div>
                    <div className={cx("currentWeather-right")}>
                      <img src={history.data?.current?.condition?.icon} className={cx("currentWeather-icon")}></img>
                      <div className={cx("timestamp")}>{history.timeStamp.time}</div>
                    </div>
                  </div>
                ))
            ) : (
              <div className={cx("")}>Weather History Is Empty!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
