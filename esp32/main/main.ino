/*
 * Sensor de umidade no solo
 *  - Quanto mais úmido, menor o valor apresentado
 *  - Quanto mais seco, maior
 */

// TODO - Necesário criar um validador para verificar se as requisições foram enviadas para a API com sucesso, retentar enviar até conseguir ou desconsiderar;
// TODO - Fila de requisições não enviadas?
// TODO (IMPORTANTE) - No futuro, fazer com que as medições não sejam iniciadas quando o usuário entrar no webserver.

#include <WiFi.h>
#include <WiFiManager.h>
#include "DHT.h"
#include "api_communication.h"
#include "util.h"
#include <iostream>
#include <chrono>

#define DHTTYPE DHT11

const int soilSensorPin = 32;
const int DHTPin = 22;

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

const char *ntpServer = "pool.ntp.org";
const long gmtOffset_sec = -18000; // UTC Brasileiro -5 é igual a -18000
const int daylightOffset_sec = 0;  // No brasil não temos mais o horário de verão
uint64_t chipIdMain = ESP.getEfuseMac();

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
    analogStr = "\nValor analogo humidade: ";
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

int const verificacaoSeguranca = 7;
int const QTD_VEZES_QUE_UMA_NOVA_UMIDADE_SE_REPETIU = 4;
int umidadeMinima = 15; // Valor no futuro deveria ser obtido atráves da API.

bool isNovaUmidadeConfiavel(int confianca)
{
    return confianca >= QTD_VEZES_QUE_UMA_NOVA_UMIDADE_SE_REPETIU;
}

void monitoraHumidadeNoSolo(int umidadeAtual)
{
    static int confianca = 0;
    static int umidadeAntiga = -1;
    if (umidadeAtual < (umidadeAntiga - verificacaoSeguranca) || umidadeAtual > (umidadeAntiga + verificacaoSeguranca))
    {
        confianca += 1;
        if (isNovaUmidadeConfiavel(confianca))
        {
            printOnServer(" Nova humidade detectada.");
            Serial.println("Nova umidade detectada.");
            if (umidadeAtual < umidadeMinima)
            {
                printOnServer("\nUmidade menor que a mínima detectada.");
                Serial.println("Umidade menor que a mínima detectada.");
                updateHistoricoUmidade(mac2String((byte *)&chipIdMain), umidadeAtual, 0, true);
            }
            else if (umidadeAtual > umidadeAntiga)
            {
                updateHistoricoUmidade(mac2String((byte *)&chipIdMain), umidadeAtual, 0, false);
                printOnServer("\nO nível de umidade aumentou.");
                Serial.println("O nível de umidade aumentou.");
            }
            else
            {
                // Umidade atual menor que a ultima
                updateHistoricoUmidade(mac2String((byte *)&chipIdMain), umidadeAtual, 0, false);
                printOnServer("\nO nível de umidade diminuiu.");
                Serial.println("O nível de umidade diminuiu.");
            }
            umidadeAntiga = umidadeAtual;
            confianca = 0;
        }
    }
    else
    {
        confianca = 0;
    }
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
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
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

                    int porcentHumidade = calcularPorcentagemUmidadeNoSolo(soilSensorValue);

                    // You can delete the following Serial.print's, it's just for debugging purposes
                    printHumidity(h);
                    printTemperature(t);
                    printHeatIndex(hic);
                    printHumidity(soilSensorValue);
                    printHumidityPorcentage(porcentHumidade);
                    monitoraHumidadeNoSolo(porcentHumidade);
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
