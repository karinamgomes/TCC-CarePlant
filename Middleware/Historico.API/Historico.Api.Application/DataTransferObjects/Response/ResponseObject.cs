using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Historico.Api.Application.DataTransferObjects.Response
{
    public class ResponseObject
    {
        [JsonIgnore]
        public int StatusCode { get; set; }

        public string Mensagem { get; set; }

        public dynamic Conteudo { get; set; }
    }
}
