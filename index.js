import express from 'express';
import path from 'path'
import dotenv from 'dotenv'
import { createBot } from './bot/setup.js';
import { getWeather, greet, subscribe, unsubscribe} from './bot/commands.js';
import { connectToDB } from './database/db.js';
import router from './routes/routes.js';
import bodyParser from 'body-parser';
import { passport1 } from './config/passpost-setup.js';
import session from 'express-session';


const app = express();
const PORT = 8000;


app.set('view engine', 'ejs');
app.set("views" , path.resolve('./views'))
dotenv.config();

const token = process.env.TOKEN;
const bot = createBot(token)

app.use(session({secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true,  cookie: {
    secure: false, // Set to true if using HTTPS, false for development over HTTP
    maxAge: 3600000, // Session expiration time in milliseconds (1 hour in this example)
},}));

app.use(passport1.initialize());
app.use(passport1.session());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectToDB();
app.use(express.json());
greet(bot);
getWeather(bot);
subscribe(bot);

unsubscribe(bot);

app.use('/public', express.static(path.resolve('./public')));
app.use('/' , router)

app.listen(PORT , ()=>{
    console.log(`Server started on PORT ${PORT}`)
})


