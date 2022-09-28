#include "api_communication.h"
#include <HTTPClient.h>
#include <string>

HTTPClient http;
String API_DNS = "https://middleware-arduino.azurewebsites.net/";
const char* AUTH_HEADER[2] = { "Cookie", "ARRAffinity=79e06db539acb57119e709978d2cf1da299e8341753d6f6345007fcab3f69bc5; ARRAffinitySameSite=79e06db539acb57119e709978d2cf1da299e8341753d6f6345007fcab3f69bc5" };

void sendPutRequest(String endpoint, String body)
{
    http.begin(API_DNS + endpoint);
    http.addHeader("Content-Type", "application/json");
    http.addHeader(AUTH_HEADER[0], AUTH_HEADER[1]);
    int httpResponseCode = http.PUT(body);
    if (httpResponseCode > 0)
    {
        String response = http.getString();
        Serial.println(httpResponseCode);
        Serial.println(response);
    }
    else
    {
        Serial.print("Error on sending PUT: ");
        Serial.println(httpResponseCode);
    }
    // Free resources
    http.end();
}
