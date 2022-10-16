using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Historico.Api.Application.DataTransferObjects.Request
{
    public class DeletePlantaRequest: TableEntity
    {
        public string NomeTableStorage { get; set; }
    }
}
