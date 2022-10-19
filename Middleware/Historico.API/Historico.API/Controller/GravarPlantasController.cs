using Historico.Api.Application.DataTransferObjects.Request;
using Historico.Api.Application.Domain.Contracts.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.WindowsAzure.Storage.Table;

namespace Historico.API.Controller
{
    [Route("[controller]")]
    [ApiController]
    public class GravarPlantasController : ControllerBase
    {
        public readonly IPlantaService _plantaService;

        public GravarPlantasController(IPlantaService plantaService)
        {
            _plantaService = plantaService;
        }
        /// <summary>
        /// Cria uma nova planta.
        /// </summary>
        /// <remarks>
        /// Exemplo de request:
        ///
        /// </remarks>
        /// <response code="200">Sucesso.</response>
        /// <response code="400">Erros de validações.</response>
        /// <response code="500">Erro interno no servidor.</response>

        [HttpPut]
        public async Task<IActionResult> GravarPlanta([FromBody] PlantaRequest query)
        {
            var resultado = await _plantaService.GravarPlanta(query);

            return new ObjectResult(resultado) { StatusCode = resultado.StatusCode, Value = resultado };
        }

        /// <summary>
        /// Busca as plantas.
        /// </summary>
        /// <remarks>
        /// Exemplo de request:
        ///
        /// </remarks>
        /// <response code="200">Sucesso.</response>
        /// <response code="400">Erros de validações.</response>
        /// <response code="500">Erro interno no servidor.</response>

        [HttpGet]
        public async Task<IActionResult> BuscarHistorico([FromHeader] string partitionKey, string tableStorageName)
        {
            var resultado = await _plantaService.BuscarPlanta(partitionKey, tableStorageName);

            return new ObjectResult(resultado) { StatusCode = resultado.StatusCode, Value = resultado };
        }

        /// <summary>
        /// Deleta uma planta.
        /// </summary>
        /// <remarks>
        /// Exemplo de request:
        ///
        /// </remarks>
        /// <response code="200">Sucesso.</response>
        /// <response code="400">Erros de validações.</response>
        /// <response code="500">Erro interno no servidor.</response>

        [HttpPost]
        public async Task<IActionResult> DeletarPlanta([FromBody] DeletePlantaRequest query)
        {
            var resultado = await _plantaService.DeletePlanta(query);

            return new ObjectResult(resultado) { StatusCode = resultado.StatusCode, Value = resultado };
        }


        /// <summary>
        /// Busca as plantas.
        /// </summary>
        /// <remarks>
        /// Exemplo de request:
        ///
        /// </remarks>
        /// <response code="200">Sucesso.</response>
        /// <response code="400">Erros de validações.</response>
        /// <response code="500">Erro interno no servidor.</response>

        [HttpGet]
        [Route("Nivel")]
        public async Task<IActionResult> BuscarNivelUmidade([FromHeader] string partitionKey, string rowKey, string tableStorageName)
        {
            var resultado = await _plantaService.BuscarNivel(partitionKey, rowKey, tableStorageName);

            return new ObjectResult(resultado) { StatusCode = resultado.StatusCode, Value = resultado };
        }
    }
}
