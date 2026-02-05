import express from "express";
import { analyzeText } from "../controllers/analyze.controller";

const router = express.Router();
router.post("/", analyzeText);

export { router as analyzeRouter };
