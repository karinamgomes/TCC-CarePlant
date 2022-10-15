using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Historico.Api.Application.DataTransferObjects.Request
{
    public class PlantaRequest : TableEntity
    {
        public string Nome { get; set; }
        public int NivelDeUmidade { get; set; } 
        public string NomeTableStorage { get; set; }
        public string CodigoSensor { get; set; }
    }
}
