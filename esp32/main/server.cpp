#include "server.h"
#include "util.h"

WiFiServer server(80);
WiFiClient client;
char linebuf[80];
int charcount = 0;

void debugOnServer(float h, float t, float hic, int soilValue, int humidityPercent)
{

    // Servidor n foi iniciado como normalmente, troquei while for if
    // Recorer a threads?
    if (!client) {
        printOnBasicConsole("Cliente is null");
        client = server.available();
        Serial.println("New client");
    }
    if (client)
    {
        memset(linebuf, 0, sizeof(linebuf));
        charcount = 0;
        // an http request ends with a blank line
        boolean currentLineIsBlank = true;
        if (client.connected())
        {
            if (client.available())
            {
              /*
                printOnBasicConsole("Cliente is available");
                printOnServer(returnHumidityString(h));
                printOnServer(returnTemperatureString(t));
                printOnServer(returnHeatIndexString(hic));
                printOnServer(returnHumidityString(soilValue));
                printOnServer(returnHumidityPorcentageString(humidityPercent));
                */
            }
            // give the web browser time to receive the data
            delay(2500);
        }
        else
        {
            // close the connection:
            client.stop();
            Serial.println("client disconnected");
        }
    }
}

void printOnServer(String message)
{
    if (client)
    {
        // TODO - Remover hardcode no futuro.
        //  Serial.println("Necessário estar conectado a rede: http://192.168.0.22/");
        return;
    }
    client.print(message);
}

void initServer()
{
    server.begin();
}
