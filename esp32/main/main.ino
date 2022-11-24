/*
 * Sensor de umidade no solo
 *  - Quanto mais úmido, menor o valor apresentado
 *  - Quanto mais seco, maior
 */

// TODO (IMPORTANTE) - No futuro, fazer com que as medições não sejam iniciadas quando o usuário entrar no webserver.

#include <WiFi.h>
#include <WiFiManager.h>
#include <ArduinoJson.h>
#include "DHT.h"
#include "api_communication.h"
#include "util.h"
#include "server.h"
#include <iostream>
#include <chrono>

#define DHTTYPE DHT11

const int soilSensorPin = 32;
const int DHTPin = 22;

DHT dht(DHTPin, DHTTYPE);

// Temporary variables
static char celsiusTemp[7];
static char fahrenheitTemp[7];
static char humidityTemp[7];

const char *ntpServer = "pool.ntp.org";
const long gmtOffset_sec = -18000; // UTC Brasileiro -5 é igual a -18000
const int daylightOffset_sec = 0;  // No brasil não temos mais o horário de verão
const int NENHUMA_UMIDADE_OBTIDA = -5;
uint64_t chipIdMain = ESP.getEfuseMac();

String usuario = "";
String planta = "";
String token = "";
bool debug = false;

void connectToWifiFi()
{
    WiFi.mode(WIFI_STA);
    WiFiManager wm;
    bool res;

    // wm.autoConnect automatically connect using saved credentials,
    // if connection fails, it starts an access point with the specified name
    // then goes into a blocking loop awaiting configuration and will return success result
    res = wm.autoConnect("AutoConnectAP", "password123"); // password protected ap
    if (!res)
    {
        wm.resetSettings();
        ESP.restart();
        delay(5000);
    }
    else
    {
        Serial.println(WiFi.localIP());
        initServer();
    }
}

bool isWifiConnected()
{
    return WiFi.status() == WL_CONNECTED;
}

int const verificacaoSeguranca = 7;
int const QTD_VEZES_QUE_UMA_NOVA_UMIDADE_SE_REPETIU = 4;
int umidadeMinima = NENHUMA_UMIDADE_OBTIDA;

bool isNovaUmidadeConfiavel(int confianca)
{
    return confianca >= QTD_VEZES_QUE_UMA_NOVA_UMIDADE_SE_REPETIU;
}

void monitoraHumidadeNoSolo(int umidadeAtual)
{
    static int confianca = 0;
    static int umidadeAntiga = -1;
    bool isUpdateOK = false;
    if (umidadeAtual < (umidadeAntiga - verificacaoSeguranca) || umidadeAtual > (umidadeAntiga + verificacaoSeguranca))
    {
        confianca += 1;
        if (isNovaUmidadeConfiavel(confianca))
        {
            printOnServer("Nova humidade detectada.");
            printOnBasicConsole("Nova umidade detectada.");
            if (umidadeAtual < umidadeMinima)
            {
                isUpdateOK = updateHistoricoUmidade(mac2String((byte *)&chipIdMain), umidadeAtual, planta, usuario, false, token);
                printOnServer("\nUmidade menor que a mínima detectada.");
                printOnBasicConsole("Umidade menor que a mínima detectada.");
            }
            else if (umidadeAtual > umidadeAntiga)
            {
                isUpdateOK = updateHistoricoUmidade(mac2String((byte *)&chipIdMain), umidadeAtual, planta, usuario, true, token);
                printOnServer("\nO nível de umidade aumentou.");
                printOnBasicConsole("O nível de umidade aumentou.");
            }
            else
            {
                // Umidade atual menor que a ultima
                isUpdateOK = updateHistoricoUmidade(mac2String((byte *)&chipIdMain), umidadeAtual, planta, usuario, true, token);
                printOnServer("\nO nível de umidade diminuiu.");
                printOnBasicConsole("O nível de umidade diminuiu.");
            }
            if (isUpdateOK)
            {
                umidadeAntiga = umidadeAtual;
                confianca = 0;
            }
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
    JsonObject clientInfo = getClientInfo(mac2String((byte *)&chipIdMain));
    umidadeMinima = clientInfo["nivelUmidade"];
    planta = clientInfo["nomePlanta"].as<String>();
    usuario = clientInfo["nome"].as<String>();
    token = clientInfo["token"].as<String>();
    
    Serial.println("\nUmidade Mínima Obtida: " + String(umidadeMinima));
    
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

        if (debug)
        {
            debugOnServer(h, t, hic, soilSensorValue, porcentHumidade);
        }
        else
        {
            printOnBasicConsole(returnHumidityString(h));
            printOnBasicConsole(returnTemperatureString(t));
            printOnBasicConsole(returnHeatIndexString(hic));
            printOnBasicConsole(returnHumidityString(soilSensorValue));
            printOnBasicConsole(returnHumidityPorcentageString(porcentHumidade));
        }
        
        if (umidadeMinima == NENHUMA_UMIDADE_OBTIDA)
        {
            printOnServer("Não foi possível obter a umidade mínima pela API");
        }
        else
        {
            monitoraHumidadeNoSolo(porcentHumidade);
        }
    }
    //Delay de aproximadamente 2 segundos para respeitar o tempo de atualização do sensor de umidade.
    delay(2500);
}
