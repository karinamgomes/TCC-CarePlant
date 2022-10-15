using Microsoft.WindowsAzure.Storage.Table;

namespace Historico.Api.Application.DataTransferObjects.Request
{   
    public class TableStorageRequest : TableEntity
    {
        public DateTime Data { get; set; }
        public int Umidade { get; set; }
        public bool Notificado { get; set; }
        public int plantaId { get; set; }
        public string TableStorageName { get; set; }
    }
}
