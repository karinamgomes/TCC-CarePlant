/*
 * Sensor de umidade no solo
 *  - Quanto mais úmido, menor o valor apresentado
 *  - Quanto mais seco, maior
 */

#include <WiFi.h>
#include <WiFiManager.h>
#include "DHT.h"
#include "api_communication.h"
#define DHTTYPE DHT11

const int soilSensorPin = 32;
const int DHTPin = 22;
// const char *SSID = "2.4Leonardo";     // wifi id
// const char *PASSWORD = "Leonardi789"; // password
// const int WIFITIMEOUT = 15000;

WiFiServer server(80);
WiFiClient client;
DHT dht(DHTPin, DHTTYPE);

// Temporary variables
static char celsiusTemp[7];
static char fahrenheitTemp[7];
static char humidityTemp[7];

// Client variables
char linebuf[80];
int charcount = 0;

void printHumidity(float h)
{
    String humidtyStr;
    humidtyStr = "\n\nHumidity: ";
    humidtyStr += h;
    humidtyStr += "%";
    printOnServer(humidtyStr);
}

void printTemperature(float t)
{
    String tempStr;
    tempStr = "\nTemperature: ";
    tempStr += t;
    tempStr += "*C";
    printOnServer(tempStr);
}

void printHeatIndex(float ht)
{
    String heatInStr;
    heatInStr = "\nÍndice de calor: ";
    heatInStr += ht;
    heatInStr += "*C";
    printOnServer(heatInStr);
}

void printHumidity(int soilValue)
{
    String analogStr;
    analogStr = "\nAnalog Value : ";
    analogStr += soilValue;
    printOnServer(analogStr);
}

void printHumidityPorcentage(int humidityPorcentage)
{
    String porctString;
    porctString = "\nPorcentagem de humidade: ";
    porctString += humidityPorcentage;
    porctString += "%";
    printOnServer(porctString);
}

int calcularPorcentagemUmidadeNoSolo(int soilValue)
{
    const int valorSeco = 3280;
    const int valorMolhado = 1460;
    int porcentagemHumidade = map(soilValue, valorMolhado, valorSeco, 100, 0);
    return porcentagemHumidade;
}

void connectToWifiFi()
{
    WiFi.mode(WIFI_STA);
    WiFiManager wm;
    bool res;

    // wm.autoConnect automatically connect using saved credentials,
    // if connection fails, it starts an access point with the specified name
    // then goes into a blocking loop awaiting configuration and will return success result
    Serial.print("\nConnecting to internet.");
    res = wm.autoConnect("AutoConnectAP", "password123"); // password protected ap
    if (!res)
    {
        Serial.println("Failed to connect - Restarting ESP");
        wm.resetSettings();
        ESP.restart();
        delay(5000);
    }
    else
    {
        Serial.println("\nWiFi connected - Server at IP address: ");
        Serial.println(WiFi.localIP());
        server.begin();
    }
}

bool isWifiConnected()
{
    return WiFi.status() == WL_CONNECTED;
}

void printOnServer(String message)
{
    if (!isWifiConnected())
    {
        Serial.println("Conexão Wifi necessária");
        return;
    }
    client.print(message);
}

void setup()
{
    dht.begin();
    Serial.begin(9600);
    while (!Serial)
    {
        ; // wait for serial port to connect. Needed for native USB port only
    }
    connectToWifiFi();
    sendPutRequest("tablestorage", "{   \"partitionKey\": \"teste2\",   \"rowKey\": \"teste2\",   \"timestamp\": \"2022-09-16T17:33:52.885Z\",   \"eTag\": \"string\",   \"data\": \"2022-09-16T17:33:52.885Z\",   \"umidade\": 6,   \"notificado\": false,   \"plantaId\": 6,   \"tableStorageName\": \"HistoricoUmidade\" }");
}

void loop()
{
    // listen for incoming clients
    client = server.available();
    if (client)
    {
        Serial.println("New client");
        memset(linebuf, 0, sizeof(linebuf));
        charcount = 0;
        // an http request ends with a blank line
        boolean currentLineIsBlank = true;
        while (client.connected())
        {
            if (client.available())
            {
                // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
                float h = dht.readHumidity();    // Read temperature as Celsius (the default)
                float t = dht.readTemperature(); // Read temperature as Fahrenheit (isFahrenheit = true)
                float f = dht.readTemperature(true);
                int soilSensorValue = analogRead(soilSensorPin);

                // Check if any reads failed and exit early (to try again).
                if (isnan(h) || isnan(t) || isnan(f))
                {
                    Serial.println("Failed to read from DHT sensor!");
                    strcpy(celsiusTemp, "Failed");
                    strcpy(fahrenheitTemp, "Failed");
                    strcpy(humidityTemp, "Failed");
                }
                else if (isnan(soilSensorValue))
                {
                    Serial.println("Failed to read data from soil sensor!");
                }
                else
                {
                    // Computes temperature values in Celsius + Fahrenheit and Humidity
                    float hic = dht.computeHeatIndex(t, h, false);
                    dtostrf(hic, 6, 2, celsiusTemp);

                    float hif = dht.computeHeatIndex(f, h);
                    dtostrf(hif, 6, 2, fahrenheitTemp);
                    dtostrf(h, 6, 2, humidityTemp);

                    // You can delete the following Serial.print's, it's just for debugging purposes
                    printHumidity(h);
                    printTemperature(t);
                    printHeatIndex(hic);
                    printHumidity(soilSensorValue);
                    printHumidityPorcentage(calcularPorcentagemUmidadeNoSolo(soilSensorValue));
                }
                delay(2500);
            }
        }
        // give the web browser time to receive the data
        delay(2500);

        // close the connection:
        client.stop();
        Serial.println("client disconnected");
    }
}
