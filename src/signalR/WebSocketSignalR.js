import * as signalR from "@microsoft/signalr";

class WebSocketSignalR {
  static async initSocketConnection(callback) {
    if (!this.connection) {
      this.connection = await new signalR.HubConnectionBuilder()
        .withUrl(`https://middleware-arduino.azurewebsites.net/notificacao`, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .withHubProtocol(new signalR.JsonHubProtocol())
        .configureLogging(LogLevel.Information)

        .build();
				
     	WebSocketSignalR.startConnection(callback);
    }
  }
	
  static startConnection(callback = undefined) {
    Object.defineProperty(WebSocket, 'OPEN', { value: 1 });
    this.connection
      .start()
      .then(callback)
      .catch(() => setTimeout(() => WebSocketSignalR.startConnection(), 5000));
  }
	
  static onReceiveMessage(name, callback) {
    this.connection.on(name, callback);
  }
	
  static unsubscribeMessage(name, callback) {
    this.connection.off(name, callback);
  }
}

export default WebSocketSignalR;