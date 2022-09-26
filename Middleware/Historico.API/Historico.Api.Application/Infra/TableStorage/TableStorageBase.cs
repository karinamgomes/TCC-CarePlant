using Historico.Api.Application.Infra.TableStorage.Entity;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Historico.Api.Application.Infra.TableStorage
{
    public class TableStorageBase : ITableStorageBase
    {
        private readonly CloudTableClient _tableClient;

        public TableStorageBase(CloudTableClient tableClient)
        {
            _tableClient = tableClient;
        }

        public async Task CreateOrUpdate(TableStorageEntity entity, string table)
        {
            var operation = TableOperation.InsertOrReplace(entity);

            CloudTable cloudTable = _tableClient.GetTableReference(table);

            await cloudTable.ExecuteAsync(operation);
        }

        public async Task<bool> GetTable(string table)
        {
            return await _tableClient.GetTableReference(table).ExistsAsync();
        }
    }
}
