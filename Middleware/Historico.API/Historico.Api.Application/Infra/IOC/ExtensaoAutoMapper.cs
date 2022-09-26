using Microsoft.Extensions.DependencyInjection;

namespace Historico.Api.Application.Infra.IOC
{
    public static class ExtensaoAutoMapper
    {
        public static void ConfigureAutoMapper(this IServiceCollection services) => services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
    }
}
