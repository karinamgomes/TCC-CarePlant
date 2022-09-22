using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.WindowsAzure.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Historico.Api.Application.Infra.IOC
{
    public static class ExtensaoTableStorage
    {
        public static void TableStorageBase(this IServiceCollection services, IConfiguration configuration)
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(configuration.GetConnectionString("StorageConnectionString"));

            var tableClient = storageAccount.CreateCloudTableClient();

            services.AddSingleton(tableClient);
        }
    }
}
