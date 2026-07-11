const axios = require("axios");

const API_URL = "http://localhost:5000/api/sensor/data";

console.log("Sensor Simulator Started");

function randomBetween(min, max) {
    return Number((Math.random() * (max - min) + min).toFixed(2));
}

async function sendSensorData() {
    const data = {
        temperature: randomBetween(22, 32),
        humidity: randomBetween(45, 75)
    };

    try {
        const response = await axios.post(API_URL, data);

        console.log(
            `[${new Date().toLocaleTimeString()}]`,
            `${data.temperature}°C`,
            `${data.humidity}%`,
            `${response.status}`
        );
    } catch (error) {
        console.error("Failed to send data");

        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

// Send immediately
sendSensorData();

// Then every 5 seconds
setInterval(sendSensorData, 5000);