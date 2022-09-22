using Microsoft.WindowsAzure.Storage.Table;

namespace Historico.Api.Application.Infra.TableStorage.Entity
{
    public class TableStorageEntity : TableEntity
    {
        public DateTime Data { get; set; }
        public int Umidade { get; set; }
        public bool Notificado { get; set; }
        public int PlantaId { get; set; }

    }
}
