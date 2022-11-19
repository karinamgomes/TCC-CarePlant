using Historico.Api.Application.DataTransferObjects.Request;
using Historico.Api.Application.DataTransferObjects.Response;

namespace Historico.Api.Application.Domain.Contracts.Service
{
    public interface IPlantaService
    {
        Task<ResponseObject> GravarPlanta(PlantaRequest Planta);
        Task<ResponseObject> AlterarPlanta(PlantaRequest Planta);
        Task<ResponseObject> BuscarPlanta(string partitionKey, string tableStorageName);
        Task<ResponseObject> BuscarNivel(string codigoSensor, string tableStorageName);
        Task<ResponseObject> DeletePlanta(DeletePlantaRequest Planta);
    }
}
