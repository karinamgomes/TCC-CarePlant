using AutoMapper;
using Historico.Api.Application.DataTransferObjects.Request;
using Historico.Api.Application.DataTransferObjects.Response;
using Historico.Api.Application.Domain.Contracts.Service;
using Historico.Api.Application.Infra.TableStorage;
using Historico.Api.Application.Infra.TableStorage.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.WindowsAzure.Storage.Table;
using Serilog;

namespace Historico.Api.Application.Service
{
    public class PlantaService : IPlantaService
    {
        public readonly IPlantaTableStorage _plantaTableStorage;
        private readonly IMapper _mapper;

        public PlantaService(IPlantaTableStorage plantaTableStorage, IMapper mapper)
        {
            _plantaTableStorage = plantaTableStorage;
            _mapper = mapper;
        }

        public async Task<ResponseObject> GravarPlanta(PlantaRequest Planta)
        {
            try
            {
                var tableExists = await _plantaTableStorage.GetTable(Planta.NomeTableStorage);

                if (!tableExists)
                {
                    var mensage = "Tabela não encontrada no Storage Account";
                    Log.Error(mensage);
                    return new ResponseObject() { StatusCode = StatusCodes.Status400BadRequest, Mensagem = mensage };
                }

                var mapResultado = _mapper.Map<PlantaRequest, PlantaEntity>(Planta);

                await _plantaTableStorage.CreateOrUpdate(mapResultado, Planta.NomeTableStorage);

                return new ResponseObject() { StatusCode = StatusCodes.Status200OK, Mensagem = "Sucesso" };
            }
            catch (Exception ex)
            {
                return new ResponseObject() { StatusCode = StatusCodes.Status400BadRequest, Mensagem = ex.Message };
            }
        }

        public async Task<ResponseObject> BuscarPlanta(string partitionKey, string tableStorageName)
        {
            try
            {
                var tableExists = await _plantaTableStorage.GetTable(tableStorageName);

                if (!tableExists)
                {
                    var mensage = "Tabela não encontrada no Storage Account";
                    Log.Error(mensage);
                    return new ResponseObject() { StatusCode = StatusCodes.Status400BadRequest, Mensagem = mensage };
                }

                var result = _plantaTableStorage.Get<PlantaEntity>(tableStorageName, partitionKey);

                return new ResponseObject() { StatusCode = StatusCodes.Status200OK, Mensagem = "Sucesso", Conteudo = result };
            }
            catch (Exception ex)
            {
                return new ResponseObject() { StatusCode = StatusCodes.Status400BadRequest, Mensagem = ex.Message };
            }
        }

        public async Task<ResponseObject> DeletePlanta(DeletePlantaRequest Planta)
        {
            try
            {
                var tableExists = await _plantaTableStorage.GetTable(Planta.NomeTableStorage);

                if (!tableExists)
                {
                    var mensage = "Tabela não encontrada no Storage Account";
                    Log.Error(mensage);
                    return new ResponseObject() { StatusCode = StatusCodes.Status400BadRequest, Mensagem = mensage };
                }

                //var mapResultado = _mapper.Map<DeletePlantaRequest, PlantaEntity>(Planta);

                await _plantaTableStorage.Delete(Planta);

                return new ResponseObject() { StatusCode = StatusCodes.Status200OK, Mensagem = "Sucesso" };
            }
            catch (Exception ex)
            {
                return new ResponseObject() { StatusCode = StatusCodes.Status400BadRequest, Mensagem = ex.Message };
            }
        }
    }
}
