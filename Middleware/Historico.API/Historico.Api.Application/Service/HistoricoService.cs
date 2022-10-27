using AutoMapper;
using Historico.Api.Application.DataTransferObjects.Request;
using Historico.Api.Application.DataTransferObjects.Response;
using Historico.Api.Application.Infra.TableStorage;
using Historico.Api.Application.Infra.TableStorage.Entity;
using Serilog;
using Microsoft.AspNetCore.Http;
using Historico.Api.Application.Domain.Models;
using Historico.Api.Application.Infra.IOC;
using Historico.Api.Application.Domain.Contracts;

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

                EnvioNotificacao(historico);

                return new ResponseObject() { StatusCode = StatusCodes.Status200OK, Mensagem = "Sucesso" };
            }
            catch (Exception ex)
            {
                return new ResponseObject() { StatusCode = StatusCodes.Status400BadRequest, Mensagem = ex.Message };
            }
        }

        public Notificacao EnvioNotificacao(TableStorageRequest request)
        {
            var mapResultado = _mapper.Map<TableStorageRequest, Notificacao>(request);
            new ChatHub().SendMenssage("teste", "teste");

            return mapResultado; 
        }

        public async Task<ResponseObject> BuscarHistorico(string partitionKey, string tableStorageName)
        {
            try
            {
                var tableExists = await _tableStorageBase.GetTable(tableStorageName);

                if (!tableExists)
                {
                    var mensage = "Tabela não encontrada no Storage Account";
                    Log.Error(mensage);
                    return new ResponseObject() { StatusCode = StatusCodes.Status400BadRequest, Mensagem = mensage };
                }

                 var result = _tableStorageBase.Get<TableStorageEntity>(tableStorageName, partitionKey);

                return new ResponseObject() { StatusCode = StatusCodes.Status200OK, Mensagem = "Sucesso", Conteudo = result };
            }
            catch (Exception ex)
            {
                return new ResponseObject() { StatusCode = StatusCodes.Status400BadRequest, Mensagem = ex.Message };
            }
        }

        public async Task<ResponseObject> BuscarNotificacao(string partitionKey, string tableStorageName)
        {
            try
            {
                var tableExists = await _tableStorageBase.GetTable(tableStorageName);

                if (!tableExists)
                {
                    var mensage = "Tabela não encontrada no Storage Account";
                    Log.Error(mensage);
                    return new ResponseObject() { StatusCode = StatusCodes.Status400BadRequest, Mensagem = mensage };
                }

                List<TableStorageEntity> result = await _tableStorageBase.GetNotificacao<TableStorageEntity>(tableStorageName, partitionKey);
                if(result.Count == 0)
                    return new ResponseObject() { StatusCode = StatusCodes.Status200OK, Mensagem = "Não tem notificações", Conteudo = result };

                foreach (var entity in result)
                {
                    entity.Notificado = true;
                    await _tableStorageBase.CreateOrUpdate(entity, tableStorageName);
                }

                return new ResponseObject() { StatusCode = StatusCodes.Status200OK, Mensagem = "Sucesso", Conteudo = result };
            }
            catch (Exception ex)
            {
                return new ResponseObject() { StatusCode = StatusCodes.Status400BadRequest, Mensagem = ex.Message };
            }
        }
    }
}
