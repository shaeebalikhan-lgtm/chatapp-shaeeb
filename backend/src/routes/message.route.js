import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessages, upload } from "../controllers/message.controller.js";

const router = Router();

router.get('/users',protectRoute,getUsersForSidebar);
router.get('/:id',protectRoute,getMessages);
router.post("/send/:id",protectRoute,upload.single("image"),sendMessages);

export default router;