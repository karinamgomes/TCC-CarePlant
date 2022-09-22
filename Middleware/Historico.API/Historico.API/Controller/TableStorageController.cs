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
        public async Task<IActionResult> BuscarHistorico([FromBody] TableStorageRequest query)
        {
            var resultado = await _historicoService.GravarHistorico(query);

            return new ObjectResult(resultado) { StatusCode = resultado.StatusCode, Value = resultado };
        }
    }
}
