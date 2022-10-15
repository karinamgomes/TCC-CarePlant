using Historico.Api.Application.Domain.Contracts;
using Historico.Api.Application.Domain.Contracts.Service;
using Historico.Api.Application.Infra.TableStorage;
using Historico.Api.Application.Service;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Globalization;

namespace Historico.Api.Application.Infra.IOC
{
    public static class ExtensaoConfiguracao
    {
        public static IServiceCollection ConfigureLanguage(this IServiceCollection services)
        {
            var cultureInfo = new CultureInfo("pt-BR");

            CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
            CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;

            return services;
        }

        public static IServiceCollection ConfigureDependencies(this IServiceCollection services, IConfiguration configuration)
        {           
            services.AddSingleton(configuration);

            //Infra           

            //Repository
            services.AddTransient<ITableStorageBase, TableStorageBase>();
            services.AddTransient<IPlantaTableStorage, PlantaTableStorage>();

            //Services
            services.AddTransient<IHistoricoService, HistoricoService>();
            services.AddTransient<IPlantaService, PlantaService>();

            services.AddSingleton<TableStorageBase>();
            return services;
        }
    }
}
