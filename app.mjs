import express from "express"
import cors from "cors"
import './database/db.mjs';
import Router from './routes-api/router.mjs';
import Coolieparser from 'cookie-parser';
const app = express();

app.use(express.json())
app.use(cors())
app.use(Router)
app.use(Coolieparser)
 
// app.get("/", (req, res)=>{
//     res.status(201).json("server is working")
// })

const Port = process.env.PORT || 4000;

 app.listen(Port,()=>{
    console.log(` localhost ${Port}`)
 })