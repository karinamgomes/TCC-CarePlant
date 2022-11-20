using Historico.Api.Application.DataTransferObjects.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Historico.Api.Application.Infra.Repository
{
    public interface INotificacaoRepository
    {
        Task EnviarNotificacao(NotificacaoRequest notificacaoRequest);
    }
}
