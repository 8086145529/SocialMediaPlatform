import express from 'express'
import {getFeedPosts,getUserPosts,likePost} from '../controllers/posts.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router();

// READ
// This gets all the post from the database
router.get("/",verifyToken,getFeedPosts)
// This gets only the post done by the user i.e when we take the profile of the user.
router.get("/:userId/posts",verifyToken,getUserPosts)

// UPDATE
router.patch("/:id/like",verifyToken,likePost)

export default router