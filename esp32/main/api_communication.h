#ifndef API_COMMUNICATION_H
#define API_COMMUNICATION_H
#include <Arduino.h>
#include <HTTPClient.h>
#include <string>

void sendPutRequest(String endpoint, String body);

void updateHistoricoUmidade(String idSensor, int umidadePorcent, String nomePlanta, String nome, bool notificado);

int getMinimalHumidity(String plantName, String username);

#endif
