using Historico.Api.Application.Infra.TableStorage.Entity;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Historico.Api.Application.Infra.TableStorage
{
    public class PlantaTableStorage : IPlantaTableStorage
    {
        private readonly CloudTableClient _tableClient;

        public PlantaTableStorage(CloudTableClient tableClient)
        {
            _tableClient = tableClient;
        }

        public async Task CreateOrUpdate(PlantaEntity entity, string table)
        {
            var operation = TableOperation.InsertOrReplace(entity);

            CloudTable cloudTable = _tableClient.GetTableReference(table);

            await cloudTable.ExecuteAsync(operation);
        }

        public async Task<bool> GetTable(string table)
        {
            return await _tableClient.GetTableReference(table).ExistsAsync();
        }

        public async Task<List<T>> Get<T>(string tableStorageName, string partitionKey) where T : PlantaEntity, new()
        {
            try
            {
                TableQuery<T> tableQuery = new TableQuery<T>()
                .Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, partitionKey));

                TableContinuationToken continuationToken = null;

                List<T> historico = new List<T>();

                CloudTable cloudTable = _tableClient.GetTableReference(tableStorageName);

                do
                {
                    Task<TableQuerySegment<T>> task = cloudTable.ExecuteQuerySegmentedAsync(tableQuery, continuationToken);

                    TableQuerySegment<T> querySegment = task.Result;

                    historico.AddRange(querySegment.ToList());
                    continuationToken = querySegment.ContinuationToken;

                } while (continuationToken != null);

                return historico;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
