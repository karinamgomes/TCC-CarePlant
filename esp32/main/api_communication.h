#ifndef API_COMMUNICATION_H
#define API_COMMUNICATION_H
#include <Arduino.h>
#include <HTTPClient.h>
#include <string>

void sendPutRequest(String endpoint, String body);

void updateHistoricoUmidade(String idSensor, int umidadePorcent, int plantId, boolean notificado);

#endif
