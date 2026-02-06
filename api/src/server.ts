import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'

import { analyzeRouter } from "./routes/analyze.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req,res)=>{
  res.json({status: "ok", message: "Semantiq Backend Live!"})
})

app.get('/health', (_req,res)=>{
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
  })
})

app.use('/api/analyze', analyzeRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(process.env.PORT);
  console.log(`Semantic Backend Running @PORT:${PORT}🚀`)
})