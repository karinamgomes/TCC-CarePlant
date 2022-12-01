using Historico.Api.Application.DataTransferObjects.Request;
using Historico.Api.Application.DataTransferObjects.Response;

namespace Historico.Api.Application.Domain.Contracts
{
    public interface IHistoricoService
    {
        Task<ResponseObject> GravarHistorico(TableStorageRequest historico);
        Task<ResponseObject> BuscarHistorico(string partitionKey, string tableStorageName);
        Task<ResponseObject> BuscarNotificacao(string partitionKey, string tableStorageName);
        Task<ResponseObject> BuscarNivelUmidade(string partitionKey, string tableStorageName);
    }
}
