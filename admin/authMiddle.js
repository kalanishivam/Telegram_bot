// import passport from "passport";
import dotenv from 'dotenv'
dotenv.config();

export const ensureAuthenticated = (req, res, next) => {

    if(req.isAuthenticated() && req.user.sub == process.env.ADMIN_SUB){       // allows only one user to login can be changed by removing second condition
        console.log("authersied user trying to access panel")
        return next();
    }
    res.send("INVALID CREDENTIALS! SIGN IN TO ACCESS THE PANEL.");
}