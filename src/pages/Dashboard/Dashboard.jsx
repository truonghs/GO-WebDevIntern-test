import style from "./Dashboard.module.scss";
import classNames from "classnames/bind";
import React, { useEffect, useState } from "react";
import axiosClient from "../../config/axios";
import { Link } from "react-router-dom";
import { IoArrowForwardOutline } from "react-icons/io5";
function Dashboard() {
  const cx = classNames.bind(style);
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [currentWeather, setCurrentWeather] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [warningLabel, setWarningLabel] = useState(false);
  const [emailWarningLabel, setEmailWarningLabel] = useState(false);

  const fetchWeather = (value) => {
    axiosClient
      .get(`weather/forecast?city=${value ? value : city}&page=${currentPage}`)
      .then((response) => {
        setCurrentWeather(response.data);
        console.log(response.data);
        setCurrentPage(1);
        setCity("");
        const now = new Date();
        const dateString = now.toLocaleDateString();
        const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const weatherHistory = {
          keyword: response.data.location.name + "-" + response.data.current.last_updated.split(" ")[1],
          timeStamp: {
            date: dateString,
            time: timeString,
          },
          data: response.data,
        };
        const history = localStorage.getItem("weatherHistory");
        if (history) {
          let oldWeatherHistory = JSON.parse(history);

          if (oldWeatherHistory[0]?.timeStamp.date !== weatherHistory?.timeStamp.date) {
            oldWeatherHistory = [];
          }
          for (let index = 0; index < oldWeatherHistory.length; index++) {
            if (oldWeatherHistory[index].keyword === weatherHistory.keyword) {
              oldWeatherHistory.splice(index, 1);
              break;
            }
          }
          oldWeatherHistory.push(weatherHistory);
          localStorage.setItem("weatherHistory", JSON.stringify(oldWeatherHistory));
        } else {
          const newWeatherHistory = [weatherHistory];
          localStorage.setItem("weatherHistory", JSON.stringify(newWeatherHistory));
        }
      })
      .catch((error) => {
        alert(error);
        console.log(error);
      });
  };
  const validateEmail = (email) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  };
  const handleChangeInput = (value) => {
    setWarningLabel(false);
    setCity(value);
  };
  const handleChangeEmail = (value) => {
    setEmail(value);
    setEmailWarningLabel(false);
  };
  const handleEmailConfirm = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coordinate = latitude + "," + longitude;
          if (coordinate) {
            if (validateEmail(email)) {
              axiosClient
                .post("/subscription/register", { email, coordinate })
                .then((response) => {
                  alert("You have successfully registered. Please check your email to confirm your email address!");
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              setEmailWarningLabel(true);
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };
  const handleSearch = () => {
    if (city) {
      fetchWeather();
    } else {
      setWarningLabel(true);
    }
  };
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const keyword = latitude + "," + longitude;
          if (keyword) {
            fetchWeather(keyword);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };
  const handleLoadmore = () => {
    if (currentPage <= 3) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <h2 className={cx("header-title")}>Weather Dashboard</h2>
      </div>
      <div className={cx("wrapper")}>
        <div className={cx("body")}>
          <div className={cx("body-left")}>
            <div className={cx("searchField")}>
              <div className={cx("searchField")}>
                <h4 className={cx("title")}>Enter a City Name</h4>
                <input value={city} onChange={(e) => handleChangeInput(e.target.value)} className={cx("searchInput")} placeholder="E.g, New York, London, Tokyo" />
                {warningLabel ? <div className={cx("warn")}>City is required!</div> : null}
              </div>
              <div className={cx("btnContainer")}>
                <div className={cx("searchContainer")}>
                  <div onClick={handleSearch} className={cx("searchBtn")}>
                    Search
                  </div>
                  <Link to={"/history"} className={cx("history")}>
                    View History
                  </Link>
                </div>
                <div className={cx("separate")}>
                  <div className={cx("separate-left")}></div>
                  <div className={cx("separate-mid")}>or</div>
                  <div className={cx("separate-right")}></div>
                </div>
                <div className={cx("currentBtn")} onClick={handleUseCurrentLocation}>
                  Use Current Location
                </div>
              </div>
            </div>
            <div className={cx("registerField")}>
              <div className={cx("registerField-label")}>Sign up to receive daily weather information</div>
              <div className={cx("inputField")}>
                <input value={email} onChange={(e) => handleChangeEmail(e.target.value)} className={cx("emailInput")} placeholder="Enter your email here..." />
                <div onClick={handleEmailConfirm} className={cx("emailConfirm")}>
                  <IoArrowForwardOutline className={cx("emailInput-icon")} />
                </div>
              </div>
              {emailWarningLabel ? <div className={cx("warn")}>Email is invalid!</div> : null}
            </div>
          </div>
          {currentWeather ? (
            <div className={cx("body-right")}>
              <div className={cx("currentWeather-container")}>
                <div className={cx("currentWeather-left")}>
                  <h3 className={cx("currentWeather-title")}>
                    {currentWeather?.location?.name} ({currentWeather?.current?.last_updated.split(" ")[0]})
                  </h3>
                  <div className={cx("currentWeather-detail")}>
                    <div className={cx("currentTemp")}>Temperature: {currentWeather?.current?.temp_c} C</div>
                    <div className={cx("currentWind")}>Wind: {Math.round((parseFloat(currentWeather?.current?.wind_kph) / 3.6) * 100) / 100} M/S</div>
                    <div className={cx("currentHumidity")}>Humidity: {currentWeather?.current?.humidity}%</div>
                  </div>
                </div>
                <div className={cx("currentWeather-right")}>
                  <img src={currentWeather?.current?.condition?.icon} className={cx("currentWeather-icon")}></img>
                </div>
              </div>
              <div className={cx("futureWeather-container")}>
                <div className={cx("futureWeather-heading")}>
                  <h3 className={cx("futureWeatherHeading-txt")}>4-Day Forecast</h3>
                  {currentPage <= 3 ? (
                    <div onClick={handleLoadmore} className={cx("futureWeatherHeading-loadmore")}>
                      Load more
                    </div>
                  ) : null}
                </div>

                <div className={cx("futureWeatherList-container")}>
                  {currentWeather.forecast?.forecastday?.map((item, index) => {
                    if (index < currentPage * 4) {
                      return (
                        <div key={index} className={cx("futureWeatherList-item")}>
                          <div className={cx("futureWeatherListItem-wrapper")}>
                            <h4 className={cx("futureWeatherListItem-title")}>({item.date})</h4>
                            <div className={cx("futureWeatherListItem-icon")}>
                              <img src={item.day.condition?.icon} className={cx("currentWeather-icon")}></img>
                            </div>
                            <div className={cx("futureWeatherListItem-detail")}>
                              <div className={cx("futureTemp")}>Temperature: {item.day.maxtemp_c} C</div>
                              <div className={cx("futureWind")}>Wind: {Math.round((parseFloat(item.day.maxwind_kph) / 3.6) * 100) / 100} M/S</div>
                              <div className={cx("futureHumidity")}>Humidity: {item.day.avghumidity}%</div>
                            </div>
                          </div>
                          <div className={cx("futureWeatherListItemIcon-responsive")}>
                            <img src={item.day.condition?.icon} className={cx("currentWeather-icon")}></img>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {currentWeather ? (
          <div className={cx("futureWeather-container-responsive")}>
            <div className={cx("futureWeather-heading")}>
              <h3 className={cx("futureWeatherHeading-txt")}>4-Day Forecast</h3>
              {currentPage <= 3 ? (
                <div onClick={handleLoadmore} className={cx("futureWeatherHeading-loadmore")}>
                  Load more
                </div>
              ) : null}
            </div>
            <div className={cx("futureWeatherList-container")}>
              {currentWeather.forecast?.forecastday?.map((item, index) => {
                if (index < currentPage * 4) {
                  return (
                    <div key={index} className={cx("futureWeatherList-item")}>
                      <div className={cx("futureWeatherListItem-wrapper")}>
                        <h4 className={cx("futureWeatherListItem-title")}>({item.date})</h4>
                        <div className={cx("futureWeatherListItem-icon")}>
                          <img src={item.day.condition?.icon} className={cx("currentWeather-icon")}></img>
                        </div>
                        <div className={cx("futureWeatherListItem-detail")}>
                          <div className={cx("futureTemp")}>Temperature: {item.day.maxtemp_c} C</div>
                          <div className={cx("futureWind")}>Wind: {Math.round((parseFloat(item.day.maxwind_kph) / 3.6) * 100) / 100} M/S</div>
                          <div className={cx("futureHumidity")}>Humidity: {item.day.avghumidity}%</div>
                        </div>
                      </div>
                      <div className={cx("futureWeatherListItemIcon-responsive")}>
                        <img src={item.day.condition?.icon} className={cx("currentWeather-icon")}></img>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Dashboard;
