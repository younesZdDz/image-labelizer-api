Promise = require('bluebird');
const mongoose = require('mongoose');
const express = require('express')
const { mongoURI } = require('./config/index')
const apiRouter = require('./api-router')
const frontendRouter = require('./frontend-router')
const bodyParser = require('body-parser')
const path = require('path');

const app = express()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

mongoose.Promise = Promise;
mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
});
if (process.env.NODE_ENV === 'production')
    mongoose.set('debug', false);
mongoose.connect(
    mongoURI, {
    keepAlive: 1,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use('/api', apiRouter)
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/', frontendRouter)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.warn(`listening on ${PORT}`)
})


