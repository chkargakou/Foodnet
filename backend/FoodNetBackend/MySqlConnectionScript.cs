using MySql.Data.MySqlClient;
using System.Data;
public interface IDbConnectionScript
{
    IDbConnection CreateConnection();
}

public class MySqlConnectionScript : IDbConnectionScript
{
    private readonly string _connectionString;

    public MySqlConnectionScript(IConfiguration configuration)
    {
        _connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");                       
    }

    public IDbConnection CreateConnection()
    {
        return new MySqlConnection(_connectionString);
    }
}
