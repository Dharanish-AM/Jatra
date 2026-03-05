import express from "express";
import { getHotels } from "../controllers/hotelController.js";

const router = express.Router();

router.route("/").get(getHotels);

export default router;
