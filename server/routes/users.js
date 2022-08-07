import express from "express";
import { deleteUser, getUser, subscribe, unsubscribe, updateUser, subChannels } from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router()

// GET ONE USER
router.get("/find/:id", getUser)

// UPDATE
router.put("/:id", verifyToken, updateUser)

// DELETE
router.delete("/:id", verifyToken, deleteUser)

// SUBSCRIBE A USER
router.put("/sub/:id", verifyToken, subscribe)

// UNSUBSRIBE
router.put("/unsub/:id", verifyToken, unsubscribe)
//GET SUBSCRIBED USERS
router.get("/subs", verifyToken, subChannels)

export default router;