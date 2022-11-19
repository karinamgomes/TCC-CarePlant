using Historico.Api.Application.DataTransferObjects.Request;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Historico.Api.Application.Infra.Repository
{
    public class NotificacaoRepository : INotificacaoRepository
    {
        public async Task EnviarNotificacao(NotificacaoRequest notificacaoRequest)
        {
            try{
                HttpClient client = new HttpClient();
                client.DefaultRequestHeaders.AcceptEncoding.Add(new System.Net.Http.Headers.StringWithQualityHeaderValue("gzip"));
                client.DefaultRequestHeaders.AcceptEncoding.Add(new System.Net.Http.Headers.StringWithQualityHeaderValue("deflate"));
                client.DefaultRequestHeaders.AcceptEncoding.Add(new System.Net.Http.Headers.StringWithQualityHeaderValue("br"));
                client.DefaultRequestHeaders.Add("Connection", "keep-alive");
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var url = "https://exp.host/--/api/v2/push/send";
                var data = JsonConvert.SerializeObject(notificacaoRequest);
                var content = new StringContent(data, null, "application/json");
                var x = await client.PostAsync(url, content);

            }catch(Exception ex)
            {
                throw;
            }
        }
    }
}
