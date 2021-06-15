const express = require('express'); 
const app = express();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet')
const morgan = require('morgan');

const userRoute = require('./routes/users'); 
const authRoute = require('./routes/auth'); 
const postRoute = require('./routes/posts');  

dotenv.config(); 

mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log('connected to Mongo !'); 
}); 

//middlewares 

//adding body parser to parse different http reqeust 
app.use(express.json()); 
app.use(helmet()); 
app.use(morgan('common')); 

//everytime user goes to the api/users url userRoute will run 
app.use('/api/users', userRoute); 
//everytime the client accesses the api/auth endpoint authRoute will be called
app.use('/api/auth', authRoute); 

app.use('/api/posts', postRoute);


app.listen(8800, () => {
    console.log('connected!')
})