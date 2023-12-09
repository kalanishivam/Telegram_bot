import dotenv from 'dotenv'
import axios from 'axios'
dotenv.config();


export const getWeatherDetails = async (city) =>{
    const options = {
      method: 'GET',
      url: 'https://weatherapi-com.p.rapidapi.com/current.json',
      params: {q: city},
      headers: {
        'X-RapidAPI-Key': process.env.WEATHER_API,
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
      }
    };
try {
	const response = await axios.request(options);
	// console.log(response.data);
    return response.data;
} catch (error) {
	console.error(error);
}


}