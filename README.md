# AISStream.io MQTT Docker Node.js Process

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue.svg)](https://github.com/matthijssn/aisstream-mqtt.git)
![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/matthijssn/aisstream-mqtt/main)

[![DockerHub](https://img.shields.io/badge/DockerHub-Repository-blue.svg)](https://hub.docker.com/r/matthijssn/aisstream-mqtt)
![Docker Image Version (latest semver)](https://img.shields.io/docker/v/matthijssn/wifi-analyzer-mqtt)



## Overview

The AISStream.io MQTT Docker Node.js Process is a containerized application that retrieves AIS information from AISStream.io via a websocket connection and publishes this information to an MQTT broker. It accepts several parameters to configure its behavior, such as the ais credentials, coordinates to monitor, MQTT broker settings, and authentication credentials.

## How it Works

TBD

## Usage

To use this Dockerized Node.js process, follow these steps:

1. Clone the GitHub repository:
   ```sh
   git clone https://github.com/matthijssn/aistream-mqtt.git

2. Navigate to the project directory:
   ```sh
   cd aisstream-mqtt

3. Build the Docker image:
   ```sh
   docker build -t aisstream-mqtt .

4. Run the Docker container, passing the required parameters as environment variables
   ```sh
            mqttHost=mqtt.example.com \
            mqttTopic=wifi-data \
            mqttUserName=myusername \
            mqttPassword=mypassword \
            aisStreamAPIKey: ''  \  
            aisStreamMMSI: []    \
            aisStreamBoxCornerOneLat: 0 \
            aisStreamBoxCornerOneLon: 0 \
            aisStreamBoxCornerTwoLat: 0 \
            aisStreamBoxCornerTwoLon: 0 \
    ```           
   Replace the environment variables with your desired values.



# Example
Here's an example of how to run the AISStream MQTT Docker Node.js Process:

## Docker run ##
```sh
docker run -e mqttHost=mqtt.example.com \
           -e mqttTopic=wifi-data \
           -e mqttUserName=myusername \
           -e mqttPassword=mypassword \
           -e aisStreamAPIKey: ''  \  
           -e aisStreamMMSI: []    \
           -e aisStreamBoxCornerOneLat: 0 \
           -e aisStreamBoxCornerOneLon: 0 \
           -e aisStreamBoxCornerTwoLat: 0 \
           -e aisStreamBoxCornerTwoLon: 0 \
           aisstream-mqtt
```           

## Docker compose ##

```
services:
  aisstreammqtt:
    image: aisstreammqtt
    build:
      context: .
      dockerfile: ./Dockerfile
    environment:
      NODE_ENV: production
      mqttHost: 'mqtt://host'
      mqttTopic: 'topic/'
      mqttUserName: ''
      mqttPassword: ''
      aisStreamAPIKey: ''      
      aisStreamMMSI: []    
      aisStreamBoxCornerOneLat: 0
      aisStreamBoxCornerOneLon: 0
      aisStreamBoxCornerTwoLat: 0
      aisStreamBoxCornerTwoLon: 0

```

This command will start the docker container, connects with aisstream.io and subscribes to the given mmssi objects to receive updates. Every mmsi will be pushed to mqtt with the given prefix as a HomeAssistant device-tracker discovery message.
After that, when an update is received, the updates are pushed to mqtt to the correct mmsi attributes topic.

# Contributing
If you'd like to contribute to this project, please refer to the GitHub repository for more information on how to get involved.

# License
This project is licensed under the MIT License - see the LICENSE file for details.