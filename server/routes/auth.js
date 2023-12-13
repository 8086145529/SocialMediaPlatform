import express from 'express'
import {login} from '../controllers/auth.js'
// The router, as part of the backend server, plays a crucial role in determining which controller should handle the incoming request based on the requested endpoint (URL).
const router = express.Router()

// "/login" means "/auth/login"
router.post("/login",login);//  This line defines a route for the "/login" endpoint. It specifies that when a POST request is made to the "/auth/login" URL (i.e a POST request from frontend to server), the login function from the auth controller should be executed.i.e  the route "/login" typically corresponds to a specific controller function

export default router;