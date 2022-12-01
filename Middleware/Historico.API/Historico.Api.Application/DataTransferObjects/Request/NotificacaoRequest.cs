using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Historico.Api.Application.DataTransferObjects.Request
{
   

    public class NotificacaoRequest
    {
        public NotificacaoRequest(string To, string Sound,  string Title, string Body, Dataa Data)
        {
            to = To;
            sound = Sound;
            title = Title;
            body = Body;
            data = Data;
        }

        public string to { get; set; }
        public string sound { get; set; }
        public string title { get; set; }
        public string body { get; set; }
        public Dataa data { get; set; }
    }
    

    public class Dataa
    {
        public Dataa(string someData)
        {
            this.someData = someData;
        }

        public string someData { get; set; }
    }
}
