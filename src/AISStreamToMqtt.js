const mqtt = require('mqtt');
const util = require('util');

const WebSocket = require('ws');



class AISStreamToMqtt {

    constructor(mqttHost, mqttPrefix, mqttOptions, aisStreamAPIKey, aisStreamMMSI, aisStreamBoundingBoxes) {
        this.mqttHost = mqttHost;
        this.mqttPrefix = mqttPrefix;
        this.mqttOptions = mqttOptions;
        this.aisStreamAPIKey = aisStreamAPIKey;
        this.aisStreamMMSI = aisStreamMMSI;
        this.aisStreamBoundingBoxes = aisStreamBoundingBoxes;
    

        global._client = {};
        this._state = {
            mqttConnected: false
        }
    }

    async connect() {
        await this._setupConnection(this.mqttHost, this.mqttOptions);
        while (!this._state.mqttConnected) {
            console.log(`Connecting to mqtt server ${this.mqttHost}...`);
            await this._delay(1000);            
        }
    }

    async start() {
        console.log('Start monitor...');
        const socket = new WebSocket("wss://stream.aisstream.io/v0/stream");
        let apiKey = this.aisStreamAPIKey;
        let mmsi = this.aisStreamMMSI;
        let boundingBoxes = this.aisStreamBoundingBoxes;
        let mqttPrefix = this.mqttPrefix;
 
       // console.log(boundingBox);
        socket.onopen = function (_) {

            //console.log(apiKey);
            let subscriptionMessage = {
                ApiKey: apiKey,
                BoundingBoxes: boundingBoxes,
                FiltersShipMMSI: mmsi,
                //FilterMessageTypes: ["PositionReport"]
            }

            console.log(util.inspect(subscriptionMessage, {showHidden: false, depth: null, colors: true}));
            socket.send(JSON.stringify(subscriptionMessage));

            // Disco topic
            const discoTopic = `${mqttPrefix}/device_tracker/aisstreammqtt`;        

             // Data topic
            const dataTopic = `aisstreammqtt`; 
           
            mmsi.forEach( object => {            
                // Define the JSON payload for Autodiscovery
                const autodiscoveryPayload = {
                    name: `AISMessageMQTT-${object}`,
                    uniq_id: `aisstream-mqtt-${object}`,  
                    json_attributes_topic: `${dataTopic}/${object}/attributes`,  
                    source_type: 'gps',
                    icon: 'mdi:ship',
                };
                
                if(_client != undefined) {        
                    console.log(`Publish discovery topic for ${discoTopic}/${object}/config `);     

                    _client.publish(`${discoTopic}/${object}/config`,JSON.stringify(autodiscoveryPayload), { qos: 0, retain: true}, (err)=> {
                    if (err) {
                        console.error('Error publishing Autodiscovery message:', err);
                        } else {
                        console.log('Autodiscovery message published successfully');
                        }
                    }) ;
                    }

                });
        }

        let context = this;
                
        console.log('Start AISStream interaction...');  
        socket.onmessage = function (event) {
            let aisMessage = JSON.parse(event.data);   
            console.log('Message: ');       
            console.log(aisMessage);
            if(aisMessage["MessageType"] === "PositionReport") {
                context._publishAISMessage(aisMessage, context.mqttPrefix);
            }           
        }
    }

    async _publishAISMessage(aisMessage, mqttPrefix) {      
        // Disco topic
        const discoTopic = `${mqttPrefix}/device_tracker/aisstreammqtt`; 
        // Data topic
        const dataTopic = `aisstreammqtt`; 
        
        let payLoad = {
           "latitude" : aisMessage.MetaData.latitude,
           "longitude" : aisMessage.MetaData.longitude,
           "gps_accuracy": 1.2,
           "shipName" : aisMessage.MetaData.ShipName
        };
        
        console.log(`Publish attributes topic for ${dataTopic}/${aisMessage.MetaData.MMSI}/attributes`);      
        await _client.publish( `${dataTopic}/${aisMessage.MetaData.MMSI}/attributes`, JSON.stringify(payLoad), { qos: 0, retain: true}, (err)=> {
            if (err) {
                console.error('Error publishing ais message:', err);
            } else {
                console.log('AIS message published successfully');
            }
        });
    }

  

    async _setupConnection(mqttHost, options = {}) {
        try {
            _client = await mqtt.connect(mqttHost, options)
            _client.on('connect', () => this._connectionHandler())
            _client.on('close', () => this._disconnectionHandler())
            _client.on('message', (topic, payload) => this._messageHandler(topic, payload))
            _client.on('error', (error) => this._errorHandler(error))
        } catch (error) {
            console.error(`Error connecting to to ${mqttHost}: ${error}`)
        }
    }

    _connectionHandler () {
        console.info('MQTT Connection established!')  
        this._state.mqttConnected = true
      }

    async _delay(t) {
        return new Promise(function (resolve) {
            setTimeout(resolve, t)
        })
    }

    _errorHandler(error) {
        console.error(`Error: ${error}`)
    }

    _disconnectionHandler () {
        console.info('MQTT Connection lost!')
        for (const topic in this._routingTable) {
          this._unsubscribe(topic)
          this._routingTable.delete(topic)
        }
        this._routingTable = new Map()
      }
}

module.exports = AISStreamToMqtt;