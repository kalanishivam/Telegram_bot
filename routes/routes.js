import express from 'express'
import { changeApiKey, deleteEntry, getData } from '../controller/users-controller.js';
import dotenv from 'dotenv'
dotenv.config();
import {passport1} from '../config/passpost-setup.js';
import { ensureAuthenticated } from '../admin/authMiddle.js';
const router = express.Router();

const client_id = process.env.CLIENT_ID;
router.get('/' , passport1.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/callback', 
passport1.authenticate('google', {
    successRedirect: '/adminpanel',
    failureRedirect: '/fail'
})
);


router.use("/adminpanel", ensureAuthenticated , getData);  
router.post("/adminpanel/delete/:userId" , deleteEntry);
router.post("/adminpanel/changeApiKey" , changeApiKey);



export default router;