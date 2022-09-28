#ifndef API_COMMUNICATION_H
#define API_COMMUNICATION_H
#include <Arduino.h>
#include <string>

void sendPutRequest(String endpoint, String body);

#endif
