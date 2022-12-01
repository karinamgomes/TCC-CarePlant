using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Historico.Api.Application.Infra.TableStorage.Entity
{
    public class PlantaEntity : TableEntity
    {
        public string Nome { get; set; }
        public int NivelDeUmidade { get; set; }
        public string CodigoSensor { get; set; }
        public DateTime? DataAlarme { get; set; }
        public bool Sensor { get; set; }
        public string UrlFotoPlanta { get; set; }
        public string Token { get; set; }
    }
}
