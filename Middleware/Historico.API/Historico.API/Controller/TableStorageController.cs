using Historico.Api.Application.DataTransferObjects.Request;
using Historico.Api.Application.Domain.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace Historico.API.Controller
{
    [Route("[controller]")]
    [ApiController]
    public class TableStorageController : ControllerBase
    {
        public readonly IHistoricoService _historicoService;

        public TableStorageController(IHistoricoService historicoService)
        {
            _historicoService = historicoService;
        }
        /// <summary>
        /// Cria um historico de umidade.
        /// </summary>
        /// <remarks>
        /// Exemplo de request:
        ///
        /// </remarks>
        /// <response code="200">Sucesso.</response>
        /// <response code="400">Erros de validações.</response>
        /// <response code="500">Erro interno no servidor.</response>

        [HttpPut]
        public async Task<IActionResult> GravarHistorico([FromBody] TableStorageRequest query)
        {
            var resultado = await _historicoService.GravarHistorico(query);

            return new ObjectResult(resultado) { StatusCode = resultado.StatusCode, Value = resultado };
        }

        /// <summary>
        /// Busca o historico de umidade.
        /// </summary>
        /// <remarks>
        /// Exemplo de request:
        ///
        /// </remarks>
        /// <response code="200">Sucesso.</response>
        /// <response code="400">Erros de validações.</response>
        /// <response code="500">Erro interno no servidor.</response>

        [HttpGet]
        [Route("Historico")]
        public async Task<IActionResult> BuscarHistorico([FromHeader] string partitionKey, string tableStorageName)
        {
            var resultado = await _historicoService.BuscarHistorico(partitionKey, tableStorageName);

            return new ObjectResult(resultado) { StatusCode = resultado.StatusCode, Value = resultado };
        }

        /// <summary>
        /// Busca o historico de umidade.
        /// </summary>
        /// <remarks>
        /// Exemplo de request:
        ///
        /// </remarks>
        /// <response code="200">Sucesso.</response>
        /// <response code="204">Sucesso, mas não tem notificções</response>
        /// <response code="400">Erros de validações.</response>
        /// <response code="500">Erro interno no servidor.</response>

        [HttpGet]
        [Route("Notificacao")]
        public async Task<IActionResult> BuscarNotificacao([FromHeader] string partitionKey, string tableStorageName)
        {
            var resultado = await _historicoService.BuscarNotificacao(partitionKey, tableStorageName);

            return new ObjectResult(resultado) { StatusCode = resultado.StatusCode, Value = resultado };
        }

        [HttpGet]
        [Route("NivelUmidade")]
        public async Task<IActionResult> BuscarNivelUmidade([FromHeader] string partitionKey, string tableStorageName)
        {
            var resultado = await _historicoService.BuscarNivelUmidade(partitionKey, tableStorageName);

            return new ObjectResult(resultado) { StatusCode = resultado.StatusCode, Value = resultado };
        }
    }
}
