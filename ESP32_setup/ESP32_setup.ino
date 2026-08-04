#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <time.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>

const char* ssid = "TILAK_DH_internet"; //Put the name of your own network
const char* password = "2793@2793"; //Put the password of your own network your connecting internet is mandatory
const char* serverUrl = "http://192.168.18.10:5000/api/sensor/data"; //Put the IP address of your own network and don't change the port number

#define DHTPIN 4
#define DHTTYPE DHT22
#define READING_INTERVAL 10000
#define WIFI_TIMEOUT 30000
#define SENSOR_RETRY 3
#define RELAY_PIN 25
#define WEBSOCKET_PORT 5000
#define MQ135_PIN 34
#define MQ135_WARMUP_TIME 30000
#define MQ135_SAMPLES 100

WebSocketsClient webSocket;
DHT dht(DHTPIN, DHTTYPE);

unsigned long lastReadingTime = 0;
bool wifiConnected = false;
int mq135Baseline = 0;
int maxDifference = 1;

void setup() {
    Serial.begin(115200);
    delay(1000);
    
    Serial.println("\n[SYSTEM] Initializing...");
    
    dht.begin();
    Serial.println("[SYSTEM] DHT22 sensor initialized");

    connectToWiFi();
    
    configTime(0, 0, "pool.ntp.org", "time.nist.gov"); 
    Serial.println("[SYSTEM] NTP time synchronized");

    pinMode(MQ135_PIN, INPUT);
    calibrateMQ135();

    pinMode(RELAY_PIN, OUTPUT);
    digitalWrite(RELAY_PIN, HIGH);

    Serial.println("[SYSTEM] Relay initialized");

    

    webSocket.begin("192.168.18.10", WEBSOCKET_PORT,"/esp32");

    webSocket.onEvent(webSocketEvent);
    webSocket.setReconnectInterval(5000);
}

void loop() {
    webSocket.loop();
    if (WiFi.status() != WL_CONNECTED) {
        wifiConnected = false;
        Serial.println("[WIFI] Connection lost. Reconnecting...");
        connectToWiFi();
    } else if (!wifiConnected) {
        wifiConnected = true;
        Serial.println("[WIFI] Connection restored");
    }
    unsigned long currentMillis = millis();
    if (currentMillis - lastReadingTime >= READING_INTERVAL) {
        lastReadingTime = currentMillis;
        readAndSendData();
    }
}

void calibrateMQ135() {
    Serial.println("[MQ135] Warming up sensor...");
    for (int i = 0; i < MQ135_WARMUP_TIME / 1000; i++) {
        Serial.print(".");
        delay(1000);
    }

    Serial.println();
    long total = 0;
    Serial.println("[MQ135] Calibrating...");
    for (int i = 0; i < MQ135_SAMPLES; i++) {
        total += analogRead(MQ135_PIN);
        delay(50);
    }
    mq135Baseline = total / MQ135_SAMPLES;
    maxDifference = 1;
    Serial.print("[MQ135] Baseline: ");
    Serial.println(mq135Baseline);
    Serial.println("[MQ135] Calibration complete.");
}

int getAirQualityScore(int currentReading) {

    int difference = mq135Baseline - currentReading;

    if (difference < 0)
        difference = 0;

    // Learn the largest drop we've seen
    if (difference > maxDifference)
        maxDifference = difference;

    int score = map(difference, 0, maxDifference, 100, 0);

    score = constrain(score, 0, 100);

    return score;
}

String getAirQualityStatus(int score) {
    if (score >= 90)
        return "Excellent";
    if (score >= 70)
        return "Good";
    if (score >= 50)
        return "Moderate";
    if (score >= 30)
        return "Poor";
    return "Very Poor";
}

void pressRelay(){
    digitalWrite(RELAY_PIN, LOW);
    delay(200);
    digitalWrite(RELAY_PIN, HIGH);
    delay(500);
}

void controlMistMaker(bool state){

    if(state){
        // ON button pressed
        Serial.println("[MIST] ON COMMAND");
        pressRelay();
    }
    else{
        // OFF button pressed
        Serial.println("[MIST] OFF COMMAND");
        
        pressRelay();
        delay(500);
        pressRelay();
    }
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length){
    switch(type){
        case WStype_ERROR:
            Serial.println("[WS] Error");
            break;
        case WStype_CONNECTED:
            Serial.println("[WS] Connected");
            break;
        case WStype_DISCONNECTED:
            Serial.println("[WS] Disconnected");
            break;
        case WStype_TEXT:
            Serial.print("[WS] Message: ");
            Serial.println((char*)payload);

            StaticJsonDocument<200> doc;
            DeserializationError error = deserializeJson(doc, payload);

            if(error){
                Serial.println("[WS] JSON parse failed");
                return;
            }

            if(doc.containsKey("state")){
                bool state = doc["state"];
                controlMistMaker(state);
            }
            break;
    }
}

void connectToWiFi() {
    Serial.print("[WIFI] Connecting to ");
    Serial.println(ssid);
    
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    
    unsigned long startAttemptTime = millis();
    
    while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < WIFI_TIMEOUT) {
        delay(500);
        Serial.print(".");
    }
    
    Serial.println("");
    
    if (WiFi.status() == WL_CONNECTED) {
        Serial.print("[WIFI] Connected. IP: ");
        Serial.println(WiFi.localIP());
        wifiConnected = true;
    } else {
        Serial.println("[WIFI] Connection failed. Will retry in loop.");
        wifiConnected = false;
    }
}

void readAndSendData() {
    float temperature = 0.0;
    float humidity = 0.0;
    bool sensorValid = false;
    
    for (int attempt = 0; attempt < SENSOR_RETRY; attempt++) {
        temperature = dht.readTemperature();
        humidity = dht.readHumidity();
        
        if (!isnan(temperature) && !isnan(humidity)) {
            sensorValid = true;
            break;
        }
        delay(100);
    }
    
    if (!sensorValid) {
        Serial.println("[SENSOR] Failed to read after multiple attempts");
        return;
    }

    int mqReading = analogRead(MQ135_PIN);
    int difference = mq135Baseline - mqReading;

    if (difference < 0) difference = 0;
    int airQualityScore = getAirQualityScore(mqReading);
    String airQualityStatus = getAirQualityStatus(airQualityScore);
    
    Serial.println("--- Sensor Reading ---");

    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" C");

    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");

    Serial.print("Baseline: ");
    Serial.println(mq135Baseline);

    Serial.print("MQ135 ADC: ");
    Serial.println(mqReading);

    Serial.print("Difference: ");
    Serial.println(difference);

    Serial.print("Max Difference: ");
    Serial.println(maxDifference);

    Serial.print("Air Quality Score: ");
    Serial.println(airQualityScore);

    Serial.print("Air Quality: ");
    Serial.println(airQualityStatus);

    Serial.println("----------------------");
    
    sendToBackend(temperature, humidity, mqReading, airQualityScore, airQualityStatus);
}

void sendToBackend(float temperature, float humidity, int mqReading, int airQualityScore, String airQualityStatus) {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("[HTTP] No WiFi connection. Data not sent.");
        return;
    }
    
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    char jsonPayload[256];

    snprintf(
        jsonPayload,
        sizeof(jsonPayload),
        "{\"temperature\":%.2f,\"humidity\":%.2f,\"mq135\":%d,\"airQualityScore\":%d,\"airQualityStatus\":\"%s\"}",
        temperature,
        humidity,
        mqReading,
        airQualityScore,
        airQualityStatus.c_str()
    );
    
    Serial.print("[HTTP] Sending: ");
    Serial.println(jsonPayload);
    
    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
        Serial.print("[HTTP] Response code: ");
        Serial.println(httpResponseCode);
        
        String response = http.getString();
        if (response.length() > 0) {
            Serial.print("[HTTP] Server response: ");
            Serial.println(response);
        }
    } else {
        Serial.print("[HTTP] Error code: ");
        Serial.println(httpResponseCode);
        
        if (httpResponseCode == -1) {
            Serial.println("[HTTP] Connection refused. Check server URL and firewall.");
        } else if (httpResponseCode == -11) {
            Serial.println("[HTTP] Connection timeout. Server not responding.");
        }
    }
    
    http.end();
}