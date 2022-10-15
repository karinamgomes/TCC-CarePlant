using Dapper;

namespace Historico.Api.Application.Domain.Contracts.Repositories
{
    public interface IBaseRepository
    {
        Task<IEnumerable<T>> DbQueryAsync<T>(string sql, object? parameters = null);
        Task<T> DbQuerySingleAsync<T>(string sql, object parameters);
        Task<bool> DbExecuteAsync(string sql, object parameters);
        Task<bool> DbExecuteScalarAsync(string sql, object parameters);
        Task<T> DbExecuteScalarDynamicAsync<T>(string sql, object? parameters = null);
        Task<(IEnumerable<T> Data, TRecordCount RecordCount)> DbQueryMultipleAsync<T, TRecordCount>(string sql, object? parameters = null);
        Task<IEnumerable<T>> DbQueryAsyncTransacional<T>(string sql, object? parameters = null);
        Task<T> DbQuerySingleAsyncTransacional<T>(string sql, object parameters);
        Task<bool> DbExecuteAsyncTransacional(string sql, object parameters);
        Task<bool> DbExecuteScalarAsyncTransacional(string sql, object parameters);
        Task<T> DbExecuteScalarDynamicAsyncTransacional<T>(string sql, object? parameters = null);
        Task<(IEnumerable<T> Data, TRecordCount RecordCount)> DbQueryMultipleAsyncTransacional<T, TRecordCount>(string sql, object? parameters = null);
        DynamicParameters MapearParametros(object obj);
        void IniciarTransacao();
        void Commit();
        void Rollback();

    }
}
