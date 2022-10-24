#include "util.h"
#include "server.h"

String retornaTempoISO8601()
{
  time_t rawtime;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo))
  {
    Serial.println("Failed to obtain time");
  }
  else
  {
    char timeStringBuff[50];
    strftime(timeStringBuff, sizeof(timeStringBuff), "%Y-%m-%dT%H:%M:%S.885Z", &timeinfo);
    return String(timeStringBuff);
  }
}

String mac2String(byte ar[])
{
  String s;
  for (byte i = 0; i < 6; ++i)
  {
    char buf[3];
    sprintf(buf, "%02X", ar[i]); // J-M-L: slight modification, added the 0 in the format for padding
    s += buf;
    if (i < 5)
      s += ':';
  }
  return s;
}

void printOnBasicConsole(String message)
{
    Serial.println(message);
}

String returnHumidityString(float h)
{
  String humidtyStr;
  humidtyStr = "\n\nHumidity: ";
  humidtyStr += h;
  humidtyStr += "%";
  return humidtyStr;
}

String returnTemperatureString(float t)
{
  String tempStr;
  tempStr = "\nTemperature: ";
  tempStr += t;
  tempStr += "*C";
  return tempStr;
}

String returnHeatIndexString(float ht)
{
  String heatInStr;
  heatInStr = "\nÍndice de calor: ";
  heatInStr += ht;
  heatInStr += "*C";
  return heatInStr;
}

String returnHumidityString(int soilValue)
{
  String analogStr;
  analogStr = "\nValor analogo humidade: ";
  analogStr += soilValue;
  return analogStr;
}

String returnHumidityPorcentageString(int humidityPorcentage)
{
  String porctString;
  porctString = "\nPorcentagem de humidade: ";
  porctString += humidityPorcentage;
  porctString += "%";
  return porctString;
}

int calcularPorcentagemUmidadeNoSolo(int soilValue)
{
  const int valorSeco = 3361;
  const int valorMolhado = 1460;
  int porcentagemHumidade = map(soilValue, valorMolhado, valorSeco, 100, 0);
  return porcentagemHumidade;
}
