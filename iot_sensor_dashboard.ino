//Macros
#include "DHT.h"
#define DHTPIN 2
#define DHTTYPE DHT22

//Creating DHT object
DHT dht(DHTPIN, DHTTYPE);

void setup(){
    Serial.begin(9600); //9600 baud-rate
    dht.begin();
}

void loop(){
    delay(2000);
    float h = dht.readHumidity();
    float t = dht.readTemperature();
    if (isnan(h) || isnan(t)) {
        Serial.println("Failed to read from DHT sensor!");
        return;
    }
    Serial.print("Humidity: "); 
    Serial.print(h); 
    Serial.print("% ");
    Serial.print("Temperature: "); 
    Serial.print(t); 
    Serial.println("°C");
}