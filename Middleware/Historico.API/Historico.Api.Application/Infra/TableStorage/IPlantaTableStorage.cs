using Historico.Api.Application.DataTransferObjects.Request;
using Historico.Api.Application.Infra.TableStorage.Entity;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Historico.Api.Application.Infra.TableStorage
{
    public interface IPlantaTableStorage
    {
        Task CreateOrUpdate(PlantaEntity entity, string table);
        Task<bool> GetTable(string table);
        Task<List<T>> Get<T>(string tableStorageName, string partitionKey) where T : PlantaEntity, new();
        Task Delete(DeletePlantaRequest entity);
    }
}
