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

void updateHistoricoUmidade(String idSensor, int umidadePorcent, String nomePlanta, String nome, bool notificado)
{
  http.begin(API_DNS + "tablestorage");
  http.addHeader("Content-Type", "application/json");
  http.addHeader(AUTH_HEADER[0], AUTH_HEADER[1]);
  String jsonBoby = "{   \"partitionKey\": \"@idSensor\",   \"rowKey\": \"@stringNumRegistro\",   \"eTag\": \"string\",   \"data\": \"@date\",   \"umidade\": @umidadePorcent,   \"notificado\": @notificado,   \"nomePlanta\": \"@nomePlanta\",   \"nome\": \"@nome\",   \"tableStorageName\": \"HistoricoUmidade\" }";
  jsonBoby.replace("@idSensor", idSensor);
  jsonBoby.replace("@stringNumRegistro", retornaNumeroRegistro());
  jsonBoby.replace("@umidadePorcent", String(umidadePorcent));
  jsonBoby.replace("@nomePlanta", nomePlanta);
  jsonBoby.replace("@nome", nome);
  jsonBoby.replace("@date", retornaTempoISO8601());
  jsonBoby.replace("@notificado", boolToString(notificado));
  Serial.println("\nJson Enviado: ");
  Serial.println(jsonBoby);
  int httpResponseCode = http.PUT(jsonBoby);
  checkForErrorOnSend(httpResponseCode);
  http.end();
}

int getMinimalHumidity(String plantName, String username)
{
  String almostTheUrl = API_DNS + "GravarPlantas/Nivel?rowKey=" + plantName + "&tableStorageName=Planta";
  const char *URL = almostTheUrl.c_str();
  RequestOptions options;
  options.method = "GET";
  options.headers["partitionKey"] = username;
  options.headers["Accept"] = "* /*";

  Response response = fetch(URL, options);
  String data = response.text();
  String formatedData = data.substring(2);
  int lastIndex = formatedData.length() - 1;
  String test = formatedData.substring(0, lastIndex);

  StaticJsonDocument<192> doc;
  DeserializationError error = deserializeJson(doc, test);

  if (error)
  {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.c_str());
    return -5;
  }

  JsonObject conteudo = doc["conteudo"];
  int conteudo_nivelUmidade = conteudo["nivelUmidade"];
  const char *conteudo_nomePlanta = conteudo["nomePlanta"];
  const char *conteudo_nome = conteudo["nome"];

  return conteudo_nivelUmidade;
}
