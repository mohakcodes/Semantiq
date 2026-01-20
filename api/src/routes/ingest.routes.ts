import express from "express";
import { ingestText } from "../controllers/ingest.controller.js";

const router = express.Router();

router.post('/', ingestText)

export {router as ingestRouter}