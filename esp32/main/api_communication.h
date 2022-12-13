#ifndef API_COMMUNICATION_H
#define API_COMMUNICATION_H
#include <Arduino.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <string>

void sendPutRequest(String endpoint, String body);

bool updateHistoricoUmidade(String idSensor, int umidadePorcent, String nomePlanta, String nome, bool notificado, String token);

JsonObject getClientInfo(String idSensor);

#endif
