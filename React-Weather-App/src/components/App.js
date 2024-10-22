import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchEngine from "./SearchEngine";
import Forecast from "./Forecast";
import "../styles.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    error: false,
  });

  const apiKey = "b03a640e5ef6980o4da35b006t5f2942";

  // Fetch weather based on the current location
  const getWeatherByLocation = async (latitude, longitude) => {
    const url = `https://api.shecodes.io/weather/v1/current?lat=${latitude}&lon=${longitude}&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      setWeather({ data: response.data, loading: false, error: false });
    } catch (error) {
      setWeather({ data: {}, loading: false, error: true });
      console.log("Error fetching location weather:", error);
    }
  };

  // Function to get the user's current location
  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherByLocation(latitude, longitude);
        },
        (error) => {
          console.log("Geolocation error:", error);
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const search = async (event) => {
    event.preventDefault();
    if (event.type === "click" || (event.type === "keypress" && event.key === "Enter")) {
      setWeather({ ...weather, loading: true });
      const url = `https://api.shecodes.io/weather/v1/current?query=${query}&key=${apiKey}`;

      try {
        const response = await axios.get(url);
        setWeather({ data: response.data, loading: false, error: false });
      } catch (error) {
        setWeather({ ...weather, data: {}, error: true });
        console.log("Error fetching weather:", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const url = `https://api.shecodes.io/weather/v1/current?query=Amudala&key=${apiKey}`;

      try {
        const response = await axios.get(url);
        setWeather({ data: response.data, loading: false, error: false });
      } catch (error) {
        setWeather({ data: {}, loading: false, error: true });
        console.log("Error fetching default weather:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      {/* SearchEngine component */}
      <SearchEngine query={query} setQuery={setQuery} search={search} />

      {/* Current Location Button */}
      <button className="button-19" onClick={getCurrentLocationWeather}>
        Get Current Location Weather
      </button>

      {weather.loading && (
        <>
          <br />
          <h4>Searching...</h4>
        </>
      )}

      {weather.error && (
        <>
          <br />
          <span className="error-message">
            Sorry, city not found, please try again.
          </span>
        </>
      )}

      {weather.data && weather.data.condition && (
        <Forecast weather={weather} />
      )}
    </div>
  );
}

export default App;
