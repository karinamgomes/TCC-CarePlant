#include "api_communication.h"
#include "util.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <string>
#include <Fetch.h>

HTTPClient http;
String API_DNS = "https://middleware-arduino.azurewebsites.net/";
const char *AUTH_HEADER[2] = {"Cookie", "ARRAffinity=79e06db539acb57119e709978d2cf1da299e8341753d6f6345007fcab3f69bc5; ARRAffinitySameSite=79e06db539acb57119e709978d2cf1da299e8341753d6f6345007fcab3f69bc5"};
uint64_t chipIdAPI = ESP.getEfuseMac();
StaticJsonDocument<1024> jsonBuffer; // upgrade para arduinoJson versão 6??????

String retornaNumeroRegistro()
{
  String numRegistro;
  numRegistro = "chip";
  String chipId = mac2String((byte *)&chipIdAPI);
  String finalChipId = chipId.substring(0, 5);
  numRegistro += finalChipId;
  return numRegistro;
}

bool checkForErrorOnSend(int httpResponseCode)
{
  if (httpResponseCode > 0)
  {
    String response = http.getString();
    Serial.println(httpResponseCode);
    Serial.println(response);
    return true;
  }
  else
  {
    Serial.print("Error on sending PUT: ");
    Serial.println(httpResponseCode);
    return false;
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

bool updateHistoricoUmidade(String idSensor, int umidadePorcent, String nomePlanta, String nome, bool notificado, String token)
{
  http.begin(API_DNS + "tablestorage");
  http.addHeader("Content-Type", "application/json");
  http.addHeader(AUTH_HEADER[0], AUTH_HEADER[1]);
  String jsonBoby = "{   \"partitionKey\": \"@idSensor\",   \"rowKey\": \"@stringNumRegistro\",   \"eTag\": \"string\",   \"data\": \"@date\",   \"umidade\": @umidadePorcent,   \"notificado\": @notificado,   \"nomePlanta\": \"@nomePlanta\",   \"nome\": \"@nome\",   \"tableStorageName\": \"HistoricoUmidade\",   \"token\": \"@token\" }";
  jsonBoby.replace("@idSensor", idSensor);
  jsonBoby.replace("@stringNumRegistro", retornaNumeroRegistro());
  jsonBoby.replace("@umidadePorcent", String(umidadePorcent));
  jsonBoby.replace("@nomePlanta", nomePlanta);
  jsonBoby.replace("@nome", nome);
  jsonBoby.replace("@date", retornaTempoISO8601());
  jsonBoby.replace("@notificado", boolToString(notificado));
  jsonBoby.replace("@token", token);
  Serial.println("\nJson Enviado: ");
  Serial.println(jsonBoby);
  int httpResponseCode = http.PUT(jsonBoby);
  bool isErrorOnPut = checkForErrorOnSend(httpResponseCode);
  http.end();
  return isErrorOnPut;
}

JsonObject getClientInfo(String idSensor)
{
  String almostTheUrl = API_DNS + "GravarPlantas/Nivel?tableStorageName=Planta";
  const char *URL = almostTheUrl.c_str();
  RequestOptions options;
  options.method = "GET";
  options.headers["codigoSensor"] = idSensor;
  options.headers["Accept"] = "* /*";

  Response response = fetch(URL, options);
  String data = response.text();
  String formatedData = data.substring(2);
  int lastIndex = formatedData.length() - 1;
  String requestFormatada = formatedData.substring(0, lastIndex);
  
  Serial.print(requestFormatada);

  DynamicJsonDocument doc(2048);
  DeserializationError error = deserializeJson(doc, requestFormatada);

  if (error)
  {
    Serial.print("\ndeserializeJson() failed: ");
    Serial.println(error.c_str());
    return doc["error"] = error.c_str();
  }
  
  JsonObject conteudo = doc["conteudo"];

  return conteudo;
}
