using Microsoft.AspNetCore.SignalR;

namespace testeSocket
{
    public class ChatHub : Hub
    {
        public async Task SendMenssage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
