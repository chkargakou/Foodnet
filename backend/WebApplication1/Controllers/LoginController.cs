using Microsoft.AspNetCore.Mvc;
using Dapper;

namespace Web.Controllers
{
    [ApiController]
    [Route("Login")]
    public class LoginController : ControllerBase
    {
        int count;
        private readonly IDbConnectionScript _dbConnectionScript;

        public LoginController(IDbConnectionScript dbConnectionscript ,IConfiguration configuration)
        {
            _dbConnectionScript = dbConnectionscript;
        }

        [HttpPost]
        public IActionResult Login(Login login)
        {
            byte[] data = Convert.FromBase64String(login.Password);
            login.Password = System.Text.Encoding.UTF8.GetString(data);
            if (string.IsNullOrEmpty(login.Username) || string.IsNullOrEmpty(login.Password))
            {
                return BadRequest("Username or password cannot be empty.");
            }

            using var db = _dbConnectionScript.CreateConnection();
            string sql = "SELECT password FROM users WHERE username = @Username;";
            string storedEncryptedPassword = db.QuerySingleOrDefault<string>(sql, new { Username = login.Username });

            if (storedEncryptedPassword == null)
            {
                return Unauthorized("Invalid username or password.");
            }
            string decryptedStoredPassword = AesEncryption.Decrypt(storedEncryptedPassword);
            if (login.Password != decryptedStoredPassword)
            {

                return Unauthorized("Invalid username or password.");
            }
            string uuidSql = "select uuid from users where username = @Username;";
            var UUID = db.QuerySingleOrDefault<string>(uuidSql, new { Username = login.Username });
            string roleSql = "select role from users where uuid = @uuid";
            string role = db.QuerySingleOrDefault<string>(roleSql, new { uuid = UUID });
            return Ok(role);
        }
    }
}