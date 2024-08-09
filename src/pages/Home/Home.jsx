import React, { useEffect, useState } from "react";
import style from "./Home.module.scss";
import classNames from "classnames/bind";
import axiosClient from "../../config/axios";
import Lottie from "lottie-react";
import { cloudyAnimation, rainAnimation, thunderAnimation, snowAnimation, sunnyAnimation, loadingAnimation } from "../../assets/animations";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Header } from "../../components";

function Home() {
  const cx = classNames.bind(style);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [animation, setAnimation] = useState(sunnyAnimation);
  const [weather, setWeather] = useState("sunny");
  const [city, setCity] = useState("");
  const [warningLabel, setWarningLabel] = useState(false);

  const fetchWeather = async (value) => {
    if (!isLoading) {
      await axiosClient
        .get(`weather/forecast?city=${value}`)
        .then((response) => {
          setData(response.data);
          const checkCondition = (text) => {
            return response.data.current.condition.text.toLowerCase().includes(text);
          };

          if (checkCondition("cloudy")) {
            setWeather("cloudy");
          } else if (checkCondition("thunder") || checkCondition("storm")) {
            setWeather("thunder");
          } else if (checkCondition("sunny") || checkCondition("clear")) {
            setWeather("sunny");
          } else if (checkCondition("rain") || checkCondition("sleet") || checkCondition("drizzle")) {
            setWeather("rain");
          } else if (checkCondition("snow") || checkCondition("blizzard") || checkCondition("ice")) {
            setWeather("snow");
          } else if (checkCondition("frog") || checkCondition("mist") || checkCondition("overcast")) {
            setWeather("cloudy");
          }
          setIsLoading(false);
        })
        .catch((error) => {
          alert("City is invalid!");
          setIsLoading(false);
          console.log(error);
        });
    } else {
      return;
    }
  };
  useEffect(() => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coordinate = latitude + "," + longitude;
          if (coordinate) {
            fetchWeather(coordinate);
          } else {
            fetchWeather("Ho Chi Minh");
          }
        },
        (error) => {
          fetchWeather("Ho Chi Minh");
          console.log(error);
        }
      );
    } else {
      fetchWeather("Ho Chi Minh");
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);
  useEffect(() => {
    switch (weather) {
      case "cloudy": {
        setAnimation(cloudyAnimation);
        break;
      }
      case "sunny": {
        setAnimation(sunnyAnimation);
        break;
      }
      case "rain": {
        setAnimation(rainAnimation);
        break;
      }
      case "thunder": {
        setAnimation(thunderAnimation);
        break;
      }
      case "snow": {
        setAnimation(snowAnimation);
        break;
      }
      default: {
        setAnimation(sunnyAnimation);
      }
    }
  }, [weather]);
  const handleChangeInput = (value) => {
    setWarningLabel(false);
    setCity(value);
  };
  const handleSearch = () => {
    if (city) {
      setIsLoading(true);
      fetchWeather(city);
    } else {
      setWarningLabel(true);
    }
  };
  return (
    <div className={cx("container", weather)}>
      <Header page={"home"} />
      <div className={cx("body")}>
        <div className={cx("wrapper")}>
          <div className={cx("top")}>
            {!isLoading ? (
              <div className={cx("animationContainer")}>
                <Lottie className={cx("animation")} animationData={animation} loop={true} />
              </div>
            ) : (
              <div className={cx("loading")}>
                <Lottie className={cx("loadingAnimation")} animationData={loadingAnimation} loop={true} />
              </div>
            )}

            <div className={cx("searchField")}>
              {warningLabel ? <div className={cx("warn")}>City is required!</div> : null}
              <input onChange={(e) => handleChangeInput(e.target.value)} value={city} className={cx("searchInput")} placeholder="E.g, New York, London, Tokyo"></input>
              <div onClick={handleSearch} className={cx("searchBtn")}>
                <FaMagnifyingGlass className={cx("searchIcon")} />
              </div>
            </div>
          </div>

          <div className={cx("bottom")}>
            <div className={cx("current")}>
              {!isLoading ? (
                <div className={cx("")}>
                  <div className={cx("currentTitle")}>
                    <div className={cx("currentName")}>{data?.location.name}</div>
                    <div className={cx("currentDate")}>{data?.current.last_updated.split(" ")[0]}</div>
                  </div>
                  <div className={cx("currentCondition")}>
                    <div className={cx("currentTemp")}>{data?.current.temp_c} °C</div>
                    <img src={data?.current.condition.icon} className={cx("currentIcon")} />
                  </div>
                  <div className={cx("conditionDetail")}>{data?.current.condition.text}</div>
                  <div className={cx("currentDetail")}>
                    <div className={cx("currentWind")}>
                      <div className={cx("windTitle")}>Wind Speed</div>
                      <div className={cx("windTxt")}>{Math.round((parseFloat(data?.current?.wind_kph) / 3.6) * 100) / 100} M/S</div>
                    </div>
                    <div className={cx("line")}></div>
                    <div className={cx("currentHumidity")}>
                      <div className={cx("humidityTitle")}>Humidity</div>
                      <div className={cx("humidityTxt")}> {data?.current?.humidity}%</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={cx("loading")}>
                  <Lottie className={cx("loadingAnimation")} animationData={loadingAnimation} loop={true} />
                </div>
              )}
            </div>
            <div className={cx("forecastContainer")}>
              {!isLoading ? (
                <div className={cx("forecast")}>
                  {data?.forecast?.forecastday?.map((item, index) => {
                    if (index < 6) {
                      return (
                        <div className={cx("forecastItem")}>
                          <div className={cx("forecastTitle")}>
                            <div className={cx("forecastDate")}>{item.date}</div>
                            <div className={cx("forecastTemp")}>{item.day.avgtemp_c} °C</div>
                          </div>
                          <div className={cx("forecastCondition")}>
                            <img src={item.day.condition.icon} className={cx("forecastConditionIcon")} />
                            <div className={cx("forecastConditionTxt")}>{item.day.condition.text}</div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              ) : (
                <div className={cx("loading")}>
                  <Lottie className={cx("loadingAnimation")} animationData={loadingAnimation} loop={true} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
