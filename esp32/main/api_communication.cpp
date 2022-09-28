#include "api_communication.h"
#include "util.h"
#include <HTTPClient.h>
#include <string>

HTTPClient http;
String API_DNS = "https://middleware-arduino.azurewebsites.net/";
const char *AUTH_HEADER[2] = {"Cookie", "ARRAffinity=79e06db539acb57119e709978d2cf1da299e8341753d6f6345007fcab3f69bc5; ARRAffinitySameSite=79e06db539acb57119e709978d2cf1da299e8341753d6f6345007fcab3f69bc5"};
uint64_t chipIdAPI = ESP.getEfuseMac();

String retornaNumeroRegistro()
{
  String numRegistro;
  String randomNum = String(random(10000000));
  String date = retornaTempoISO8601();
  String finalChipId = mac2String((byte *)&chipIdAPI).substring(0, -3);
  numRegistro += date;
  numRegistro += finalChipId;
  numRegistro += ".";
  numRegistro += randomNum;
  return numRegistro;
}

void checkForErrorOnSend(int httpResponseCode)
{
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
}

String boolToString(bool b)
{
  if (b)
  {
    return "true";
  }
  else
  {
    return "false";
  }
}

void updateHistoricoUmidade(String idSensor, int umidadePorcent, int plantId, bool notificado)
{

  http.begin(API_DNS + "tablestorage");
  http.addHeader("Content-Type", "application/json");
  http.addHeader(AUTH_HEADER[0], AUTH_HEADER[1]);
  String jsonBoby = "{   \"partitionKey\": \"@idSensor\",   \"rowKey\": \"@stringNumRegistro\",   \"eTag\": \"string\",   \"data\": \"@date\",   \"umidade\": @umidadePorcent,   \"notificado\": @notificado,   \"plantaId\": @plantId,   \"tableStorageName\": \"HistoricoUmidade\" }";
  jsonBoby.replace("@idSensor", idSensor);
  jsonBoby.replace("@stringNumRegistro", retornaNumeroRegistro());
  jsonBoby.replace("@umidadePorcent", String(umidadePorcent));
  jsonBoby.replace("@plantId", String(plantId));
  jsonBoby.replace("@date", retornaTempoISO8601());
  jsonBoby.replace("@notificado", boolToString(notificado));
  Serial.println("\nJson Enviado: ");
  Serial.println(jsonBoby);
  int httpResponseCode = http.PUT(jsonBoby);
  checkForErrorOnSend(httpResponseCode);
  http.end();
}

void sendPutRequest(String endpoint, String body)
{
  http.begin(API_DNS + endpoint);
  http.addHeader("Content-Type", "application/json");
  http.addHeader(AUTH_HEADER[0], AUTH_HEADER[1]);
  int httpResponseCode = http.PUT(body);
  checkForErrorOnSend(httpResponseCode);
  http.end();
}
