﻿using Historico.Api.Application.DataTransferObjects.Request;
using Historico.Api.Application.DataTransferObjects.Response;

namespace Historico.Api.Application.Domain.Contracts
{
    public interface IHistoricoService
    {
        Task<ResponseObject> GravarHistorico(TableStorageRequest historico);
    }
}
