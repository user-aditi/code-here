const express = require('express')
const app = express();
require('dotenv').config();
const main =  require('./config/db')
const cookieParser =  require('cookie-parser');
const authRouter = require("./routes/userAuth");
const redisClient = require('./config/redis');
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit")
const aiRouter = require("./routes/aiChatting")
const videoRouter = require("./routes/videoCreator");
const dashboardRouter = require("./routes/dashboard");
const adminRouter = require("./routes/admin");
const cors = require('cors')

// console.log("Hello")

app.use(cors({
    origin: (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map((url) => url.trim()),
    credentials: true 
}))

app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',aiRouter);
app.use("/video",videoRouter);
app.use("/dashboard", dashboardRouter);
app.use("/admin", adminRouter);


const InitalizeConnection = async ()=>{
    try{

        await Promise.all([main(),redisClient.connect()]);
        console.log("DB Connected");
        
        const port = process.env.PORT || 3000;
        app.listen(port, ()=>{
            console.log("Server listening at port number: "+ port);
        })

    }
    catch(err){
        console.log("Error: "+err);
    }
}


InitalizeConnection();

