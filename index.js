if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

const AISStreamToMqtt = require('./src/AISStreamToMqtt');

const mqttPrefix = process.env.mqttPrefix //'homeassistant'
const mqttHost =  process.env.mqttHost //'eg. mqtt://broker.hivemq.com'
const aisStreamAPIKey = process.env.aisStreamAPIKey 
const aisStreamMMSI = JSON.parse(process.env.aisStreamMMSI)

const aisStreamBoxCornerOneLat=parseFloat( process.env.aisStreamBoxCornerOneLat)
const aisStreamBoxCornerOneLon=parseFloat(process.env.aisStreamBoxCornerOneLon)
const aisStreamBoxCornerTwoLat=parseFloat(process.env.aisStreamBoxCornerTwoLat)
const aisStreamBoxCornerTwoLon=parseFloat(process.env.aisStreamBoxCornerTwoLon)

const aisStreamBoundingBoxes = new Array();
const aisStreamBoundingBox =
    [
        [aisStreamBoxCornerOneLat,aisStreamBoxCornerOneLon],
        [aisStreamBoxCornerTwoLat,aisStreamBoxCornerTwoLon]
    ];

aisStreamBoundingBoxes.push(aisStreamBoundingBox);


const mqttOptions = {
    username: process.env.mqttUserName,
    password : process.env.mqttPassword
};

async function start() {


    let as = new AISStreamToMqtt(mqttHost, mqttPrefix, mqttOptions, aisStreamAPIKey, aisStreamMMSI, aisStreamBoundingBoxes);

    await as.connect();

    await as.start();
}

start();