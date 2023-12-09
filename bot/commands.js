import { getWeatherDetails } from "../services/weatherService.js";
import userDetails from "../models/user.js";


export const greet = (bot) => {
    bot.onText(/\/start/, (msg) => {
        let chatId = msg.from.id;
        let name = msg.from.first_name;

        bot.sendMessage(chatId, `Hello, ${name}, please Send /Weather for weather updates or /Subscribe to subscribe and /unsubscribe to unsubscribe `)
    })
}


export const getWeather = (bot) => {
    bot.onText(/\/Weather/, (msg) => {
        const chatId = msg.from.id;

        bot.sendMessage(chatId, 'Please enter your city name:');  // Asks the user to enter their city name

        const responseListener = async (responseMsg) => {
            if (responseMsg.chat.id === chatId) {
                const city = responseMsg.text;
                // console.log(responseMsg);

                bot.removeListener('text', responseListener);  // Remove the listener to prevent further processing

                try {
                    const weather = await getWeatherDetails(city);   // Fetch weather details for the user-specified city

                    if (weather && weather.current) {    // Check if the response contains valid weather data
                        // Extract weather information
                        const location = weather.location.name
                        const temperatureCelsius = weather.current.temp_c;
                        const last_updated = weather.current.last_updated;
                        const cond = weather.current.condition.text;
                        const wind_speed = weather.current.wind_mph;
                        const wind_direction = weather.current.wind_dir;

                        
                        const message =                                     // Construct the message with line breaks
                            `Last updated At: ${last_updated}\n` +
                            `Location: ${location}\n` +
                            `Temperature: ${temperatureCelsius}°C\n` +
                            `Condition: ${cond}\n` +
                            `Wind Speed: ${wind_speed}mph\n` +
                            `Wind Direction: ${wind_direction}`;

                        bot.sendMessage(chatId, message);  // Send the weather information to the user
                    } else {

                        bot.sendMessage(chatId, 'Sorry, the entered city name is not valid.');
                    }
                } catch (error) {
                    console.error('Error fetching weather:', error);
                    bot.sendMessage(chatId, 'Sorry, there was an error fetching the weather.');
                }
            }
        };

        bot.on('text', responseListener);   // Listen for the user's response
    });
};


export const subscribe =  (bot) =>{
     bot.onText(/^\/Subscribe$/,  (msg) => {
        const chatId = msg.from.id;
        const userName = msg.from.first_name;

         handleSubscription(bot, chatId, userName);
        
    });
    
    setInterval(() => {
        sendWeatherUpdates(bot);
    },5000);      // 5000 to recieve every 5 seconds or 24 * 60 * 60 * 1000 to recieve every 24 hours
}

const sendWeatherUpdates = async (bot) => {

    try{
        const allUsers = await userDetails.find();

        allUsers.forEach(async (oneUser) => {
            const { userId, city } = oneUser;
            try{
                const weather = await getWeatherDetails(city);
                const location = weather.location.name
                const temperatureCelsius = weather.current.temp_c;
                const last_updated = weather.current.last_updated;
                const cond = weather.current.condition.text;
                const wind_speed = weather.current.wind_mph;
                const wind_direction = weather.current.wind_dir;


                const message =  `Last updated At: ${last_updated}\n` +          // Construct the message
                            `Location: ${location}\n` +
                            `Temperature: ${temperatureCelsius}°C\n` +
                            `Condition: ${cond}\n` +
                            `Wind Speed: ${wind_speed}mph\n` +
                            `Wind Direction: ${wind_direction}`;

                bot.sendMessage(userId , message);
            }catch(err){
                console.log(`error  in sendWeatherUpdates ${err.message}`);
            }

        });
    }catch(error){
        console.log(`error in send weather updates ${error.message}`)
    }
};





const handleSubscription = async (bot, chatId, userName)=>{
    const exist = await userDetails.findOne({userId : chatId});
    let cityName;
    if(exist){
        bot.sendMessage(chatId , "You are already subscribed");
        return;
    }else{
        bot.sendMessage(chatId , "enter City name");
        const responseListener = async (responseMsg) => {
        cityName = responseMsg.text;
        bot.sendMessage(chatId , "You are now susbcribed and you will recieve updates every 5 seconds");  // time can be changed by edidting the setInterval function in line 77
        bot.removeListener('text', responseListener);    // Remove the listener to prevent further processing

        try{
            await userDetails.create({
                name : userName,
                userId : chatId,
                city : cityName,
            });
            console.log("Entry created in the database");
        }catch(error){
            console.log("error in creating entry in database", error.message);
        }

        }
        bot.on('text', responseListener);
    }

}


export const unsubscribe = (bot) => {
    bot.onText(/^\/unsubscribe$/, (msg) => {
        const chatId = msg.from.id;
        deleteUserFromDB(bot , chatId);
    });
};

const deleteUserFromDB = async (bot, chatId)=>{
    // console.log("in the delete from user db")
    try{
        const user = await userDetails.findOne({userId : chatId});    // finds the user with particular userID in the db
        if(!user){
            bot.sendMessage(chatId , 'You were never Subscribed. /Subscribe to subscribe')
        }else{
        await userDetails.deleteOne({userId : chatId});
        console.log("Entry deleted successfully");
        bot.sendMessage(chatId , "You have Successfully Unsubscribed");
        }
    }catch(error){
        console.log("Error in deelting entry" , error.message);
        bot.sendMessage(chatId , "Error in removing your subscription");
    }
}

