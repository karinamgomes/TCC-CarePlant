#ifndef SERVER_H
#define SERVER_H
#include <WiFi.h>
#include <WiFiManager.h>
#include <Arduino.h>
#include <string>

void initServer();

void debugOnServer(float h, float t, float hic, int soilValue, int humidityPercent);

void printOnServer(String message);

#endif
