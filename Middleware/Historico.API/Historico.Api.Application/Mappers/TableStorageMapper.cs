using AutoMapper;
using Historico.Api.Application.DataTransferObjects.Request;
using Historico.Api.Application.Domain.Models;
using Historico.Api.Application.Infra.TableStorage.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Historico.Api.Application.Mappers
{
    public class TableStorageMapper : Profile
    {
        public TableStorageMapper()
        {
            CreateMap<TableStorageRequest, TableStorageEntity>().ReverseMap();
            CreateMap<TableStorageRequest, Notificacao>().ReverseMap();
            CreateMap<PlantaRequest, PlantaEntity>().ReverseMap();
        }
    }
}
