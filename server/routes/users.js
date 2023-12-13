import express from 'express'


// importing controllers
import {
getUser,
getUserFriends,
addRemoveFriend
} from '../controllers/users.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

// Read/Get
// /:id means /users/:id
router.get("/:id",verifyToken,getUser)
router.get("/:id/friendId",verifyToken,getUserFriends)

// Update
router.patch("/:id/:friendId",verifyToken,addRemoveFriend)


export default router;
