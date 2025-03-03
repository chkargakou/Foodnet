using Microsoft.AspNetCore.Mvc;
using Dapper;
using System.Linq.Expressions;

namespace Web.Controllers
{
    [ApiController]
    [Route("register")]
    public class RegisterController : ControllerBase
    {
        private readonly IDbConnectionScript _dbConnectionScript;

        public RegisterController(IDbConnectionScript dbConnectionscript, IConfiguration configuration)
        {
            _dbConnectionScript = dbConnectionscript;
        }

        [HttpPost]
        public ActionResult<RegisterResult> Register(Register reg)
        {
            RegisterResult result = new RegisterResult();
            result.Username = reg.Username;
            using var db = _dbConnectionScript.CreateConnection();
            string checkSql = "select count(*) from users where username = @Username;";
            int existingUserCount = db.QuerySingle<int>(checkSql, new { Username = reg.Username });
            if (existingUserCount == 1)
            {
                return Conflict("Username already exists. Please choose a different one.");
            }
            byte[] data = Convert.FromBase64String(reg.Password);
            reg.Password = System.Text.Encoding.UTF8.GetString(data);
            result.Password = reg.Password;
            String EncryptedPassword = AesEncryption.Encrypt(result.Password);
            string uuid = Guid.NewGuid().ToString();
            string regdate = DateTime.UtcNow.ToString("yyyy-MM-dd");
            string sql = @"insert into users (uuid, username, password , regdate,role)
                           values (@UUID, @Username, @Password, @RegDate,@Role);";
            var userId = db.ExecuteScalar<long>(sql, new
            {
                UUID = uuid,
                Username = reg.Username,
                Password = EncryptedPassword,
                RegDate = regdate,
                Role = "User"
            });

            return Ok(result);
        }
        [HttpPost("RemoveUser")]
        public IActionResult RemoveUser(User user)
        {
            using var db = _dbConnectionScript.CreateConnection();
            string checkSql = "select count(*) from users where username = @Username;";
            var userExists = db.Execute(checkSql, new { Username = user.Username });

            if (userExists == 0)
            {
                return NotFound("User not found.");
            }
            
            string deleteSql = "delete from users where username = @Username;";
            try
            {
                int rowsAffected = db.Execute(deleteSql, new { Username = user.Username });
                if (rowsAffected > 0)
                {
                    return Ok("User removed successfully.");
                }
            }
            catch (Exception ex)
            {
                return Conflict($"{ex.Message}");
            }

            return Conflict("Could not remove user.");
        }

    }
}
