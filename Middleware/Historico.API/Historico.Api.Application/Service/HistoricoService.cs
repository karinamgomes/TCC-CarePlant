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
using Historico.Api.Application.Infra.Repository;

namespace Historico.Api.Application.Service
{
    public class HistoricoService : IHistoricoService
    {
        public readonly ITableStorageBase _tableStorageBase;
        private readonly IMapper _mapper;
        private readonly INotificacaoRepository _notificacaoRepository;

        public HistoricoService(ITableStorageBase tableStorageBase,
            IMapper mapper,
            INotificacaoRepository notificacaoRepository)
        {
            _tableStorageBase = tableStorageBase;
            _mapper = mapper;
            _notificacaoRepository = notificacaoRepository;
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

                if(!historico.Notificado)
                    _notificacaoRepository.EnviarNotificacao(new NotificacaoRequest(historico.Token, "default", ("Sua planta " + historico.NomePlanta + " precisa de Agua!"), "Está na hora de regar sua planta, não à deixe sem agua!", new Dataa("")));

                return new ResponseObject() { StatusCode = StatusCodes.Status200OK, Mensagem = "Sucesso" };
            }
            catch (Exception ex)
            {
                return new ResponseObject() { StatusCode = StatusCodes.Status400BadRequest, Mensagem = ex.Message };
            }
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
                if (result.Count == 0)
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

        public async Task<ResponseObject> BuscarNivelUmidade(string partitionKey, string tableStorageName)
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

                List<TableStorageEntity> result = await _tableStorageBase.Get<TableStorageEntity>(tableStorageName, partitionKey);
                if (result.Count == 0)
                    return new ResponseObject() { StatusCode = StatusCodes.Status200OK, Mensagem = "Não tem notificações", Conteudo = result };

                foreach (var entity in result)
                {
                    entity.Notificado = true;
                    await _tableStorageBase.CreateOrUpdate(entity, tableStorageName);
                }

                return new ResponseObject() { StatusCode = StatusCodes.Status200OK, Mensagem = "Sucesso", Conteudo = result[0] };
            }
            catch (Exception ex)
            {
                return new ResponseObject() { StatusCode = StatusCodes.Status400BadRequest, Mensagem = ex.Message };
            }
        }
    }
}
