using Historico.Api.Application.Domain.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Historico.Api.Application.Infra.IOC
{
    public class ChatHub : Hub
    {
        public async Task SendMenssage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message); 
        }

    }
}
