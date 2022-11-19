#ifndef UTIL_H
#define UTIL_H
#include <Arduino.h>
#include <string>

void printOnBasicConsole(String message);

String retornaTempoISO8601();

String mac2String(byte ar[]);

String returnHumidityString(float h);

String returnTemperatureString(float t);

String returnHeatIndexString(float ht);

String returnHumidityString(int soilValue);

String returnHumidityPorcentageString(int humidityPorcentage);

int calcularPorcentagemUmidadeNoSolo(int soilValue);

#endif
