using Historico.Api.Application.DataTransferObjects.Request;
using Historico.Api.Application.DataTransferObjects.Response;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Historico.Api.Application.Domain.Contracts.Service
{
    public interface IPlantaService
    {
        Task<ResponseObject> GravarPlanta(PlantaRequest Planta);
        Task<ResponseObject> BuscarPlanta(string partitionKey, string tableStorageName);
        Task<ResponseObject> DeletePlanta(DeletePlantaRequest Planta);
    }
}
