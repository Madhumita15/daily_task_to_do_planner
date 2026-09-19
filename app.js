const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require('dotenv').config()

const express = require('express');
const dbCon = require("./src/config/dbCon");
const app = express()
const router = require('./src/router/index')
require('./src/jobs/reminder.jobs')
require('./src/jobs/summeryEmail.jobs')

dbCon()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(router)




const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`app is listening on http://localhost:${PORT}`)
})