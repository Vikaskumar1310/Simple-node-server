const express = require('express');
const app = express();
const userRouter = require('./router/user')
require('./db/mongoose');

app.use(express.json());
app.use(userRouter)

app.listen(4000, ()=>{
    console.log("Server is listening on PORT : 4000 " )
})