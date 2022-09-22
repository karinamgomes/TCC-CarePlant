using AutoMapper;
using Historico.Api.Application.DataTransferObjects.Request;
using Historico.Api.Application.DataTransferObjects.Response;
using Historico.Api.Application.Domain.Contracts;
using Historico.Api.Application.Infra.TableStorage;
using Historico.Api.Application.Infra.TableStorage.Entity;
using Serilog;
using Microsoft.AspNetCore.Http;

namespace Historico.Api.Application.Service
{
    public class HistoricoService : IHistoricoService
    {
        public readonly ITableStorageBase _tableStorageBase;
        private readonly IMapper _mapper;

        public HistoricoService(ITableStorageBase tableStorageBase,
            IMapper mapper)
        {
            _tableStorageBase = tableStorageBase;
            _mapper = mapper;
        }

        public async Task<ResponseObject> GravarHistorico(TableStorageRequest historico)
        {
            try
            {
                var tableExists = await _tableStorageBase.GetTable(historico.TableStorageName);

                if (!tableExists)
                {
                    var mensage = "Tabela não encontrada no Storage Account";
                    Log.Error(mensage);
                    return new ResponseObject() { StatusCode = StatusCodes.Status400BadRequest, Mensagem = mensage };
                }

                var mapResultado = _mapper.Map<TableStorageRequest, TableStorageEntity>(historico);

                await _tableStorageBase.CreateOrUpdate(mapResultado, historico.TableStorageName);

                return new ResponseObject() { StatusCode = StatusCodes.Status200OK, Mensagem = "Sucesso" };
            }
            catch (Exception ex)
            {
                return new ResponseObject() { StatusCode = StatusCodes.Status400BadRequest, Mensagem = ex.Message };
            }            
        }
    }
}
