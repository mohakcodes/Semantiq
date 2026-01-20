import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'

import { ingestRouter } from "./routes/ingest.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req,res)=>{
  res.json({status: "ok", message: "Semantiq Backend Live!"})
})

app.use('/api/ingest', ingestRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(process.env.PORT);
  console.log(`Semantic Backend Running @PORT:${PORT}🚀`)
})
