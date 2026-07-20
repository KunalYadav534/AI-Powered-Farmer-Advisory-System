import axios from "axios";

export const getWeather = async (req, res) => {
  const { city } = req.query;

  if (!city || city.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "City name is required. Example: /api/weather?city=Delhi",
    });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(city) + "&appid=" + apiKey + "&units=metric";

    const response = await axios.get(url);
    const data = response.data;

    const weather = {
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      windSpeed: data.wind.speed,
      cloudiness: data.clouds.all,
      visibility: data.visibility / 1000,
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString("en-IN"),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString("en-IN"),
    };

    res.status(200).json({
      success: true,
      weather,
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: "City not found. Please check the spelling.",
      });
    }

    if (error.response && error.response.status === 401) {
      return res.status(401).json({
        success: false,
        message: "Invalid OpenWeatherMap API key.",
      });
    }

    console.error("Weather Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch weather data. Please try again.",
    });
  }
};