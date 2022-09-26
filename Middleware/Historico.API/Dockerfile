FROM mcr.microsoft.com/dotnet/sdk:6.0-alpine AS build
WORKDIR /build

COPY ["Historico.API/Historico.API.csproj", "Historico.API/Historico.API/"]
COPY ["Historico.API.Library/Historico.API.Application.csproj", "Historico.API.Library/"]

RUN dotnet restore "Historico.API/Historico.API.csproj"
COPY . .
WORKDIR /build/Historico.PJ.API/Historico.PJ.API

FROM build AS publish
RUN dotnet publish "Historico.API.csproj" -c Release -o /publish


FROM mcr.microsoft.com/dotnet/aspnet:6.0-alpine as app
RUN apk --no-cache add tzdata
RUN apk add icu-libs
ENV TZ=America/Sao_Paulo
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

WORKDIR /app
COPY --from=publish /publish .

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["dotnet", "Historico.API.dll", "--urls", "http://+:80"]