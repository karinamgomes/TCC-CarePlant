using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Historico.Api.Application.Domain.Models
{
    public class Notificacao
    {
        public int Id { get; set; }
        public DateTime data { get; set; }
        public int Umidade { get; set; }
        public string NomePlanta { get; set; }
    }
}
