import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import dotenv from 'dotenv';
dotenv.config();

const ClientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;



export const passport1 = passport.use(new GoogleStrategy({
  clientID:     ClientId,
  clientSecret: clientSecret,
  callbackURL: "http://localhost:8000/callback",
  passReqToCallback   : true
},
function(request, accessToken, refreshToken, profile, done) {
  console.log(`User with id ${profile.email} and sub ${profile.sub} and name ${profile._json.name} is trying to SIGNIN`);
  return done(null, profile);
}
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(user, cb) {
  console.log("in the deserialize")
  cb(null, user);
  });