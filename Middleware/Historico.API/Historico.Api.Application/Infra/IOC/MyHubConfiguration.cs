using Historico.Api.Application.Domain.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Historico.Api.Application.Infra.IOC
{
    public class MyHubConfiguration : Hub
    {
        //public Notificacao Notificacoes()
        //{
        //    var n = new Notificacao();
        //    n.Id = 1;
        //    n.Umidade = 100;
        //    n.NomePlanta = "Planta Teste";
        //    return n;
        //}

        public async Task Notificacoes(CancellationToken cancellationToken)
        {         
            while (true)
            {
                string hora = DateTime.UtcNow.ToString();
                await Clients.All.SendAsync("ReceiveMenssage", hora);
                await Task.Delay(1000, cancellationToken);
            }            
        }
    }
}
