var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('dotenv').config()

app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));


//Insert here all additional routes
const request = require('./src/routes/Request');
app.use('/api/', request);

const solution = require('./src/routes/Solution');
app.use('/api/', solution);

const carrier = require('./src/routes/Carrier');
app.use('/api/', carrier);

const tracking = require('./src/routes/Tracking');
app.use('/api/', tracking);

const csat = require('./src/routes/CSAT');
app.use('/api/', csat);

const user = require('./src/routes/User');
app.use('/api/', user);

const systemValues = require('./src/routes/SystemDefaultValues');
app.use('/api/', systemValues);

const customer = require('./src/routes/Customer');
app.use('/api/', customer);


//ROBOT 
const robotTrigger = require('./src/robotJs/robotTrigger');
app.use('/robot/', robotTrigger);

// View Engine
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//open server on port
app.listen(process.env.PORT, function () {
    //run Uipath Robot at stratup
    console.log('Server is running on port %d', process.env.PORT)
});

