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
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse("DefaultEndpointsProtocol=https;AccountName=tccbase;AccountKey=zq5GRbMIEU3yvgmqfRW4gffN4n3hU/eFHDJ2OcPY1IWwuK5BB2szmcudanYwqsCt1ndVUvZ+xEFu+ASt2Sx/lQ==;EndpointSuffix=core.windows.net");

            var tableClient = storageAccount.CreateCloudTableClient();

            services.AddSingleton(tableClient);
        }
    }
}
