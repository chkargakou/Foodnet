using Microsoft.AspNetCore.Mvc;
using Dapper;

namespace Web.Controllers
{
    [ApiController]
    [Route("Management")]
    public class ManagementController : ControllerBase
    {
        private readonly IDbConnectionScript _dbConnectionScript;

        public ManagementController(IDbConnectionScript dbConnectionscript ,IConfiguration configuration)
        {
            _dbConnectionScript = dbConnectionscript;
        }
        [HttpPost("getuuid")]
        public IActionResult GetUUID(User user)
        {
            UserResult result = new UserResult();
            result.Username = user.Username;
            using var db = _dbConnectionScript.CreateConnection();
            string sql = "select uuid from users where username = @Username;";
            var uuid = db.QuerySingleOrDefault<string>(sql, new { Username = user.Username });

            if (uuid == null)
            {
                return NotFound("User not found.");
            }

            return Ok(new { UUID = uuid });
        }
        [HttpPost("makeaccowner")]
        public IActionResult ConvertToOwner(string UUID)
        {
            using var db = _dbConnectionScript.CreateConnection();
            var sql = "update users set role = 'owner' where uuid = @uuid;";
            var result = db.Query(sql, new { uuid = UUID });
            if (result == null)
            {
                return Conflict("User is already an owner");
            }
            return Ok("User changed to owner");
        }
        [HttpGet("isOwner")]
        public ActionResult IsOwner(string UUID)
        {
            using var db = _dbConnectionScript.CreateConnection();
            var sql = "select role from users where uuid = @uuid and role = 'owner';";
            try
            {
                string res = db.QuerySingleOrDefault<string>(sql, new { uuid = UUID });

                if (res == "owner")
                {
                    return Ok(true);
                }
                else
                {
                    return Ok(false);
                }
            }
            catch (Exception ex)
            {
                return Conflict($"{ex.Message}");
            }
        }

        [HttpGet("isAdmin")]
        public ActionResult IsAdmin(string UUID)
        {
            using var db = _dbConnectionScript.CreateConnection();
            var sql = "select role from users where uuid = @uuid and role = 'admin';";
            try
            {
                string res = db.QuerySingleOrDefault<string>(sql, new { uuid = UUID });

                if (res == "admin")
                {
                    return Ok(true);
                }
                else
                {
                    return Ok(false);
                }
            }
            catch (Exception ex)
            {
                return Conflict($"{ex.Message}");
            }
        }

        [HttpPost("insertTimestamp")]
        public IActionResult InsertTimestamp(Timestamp timestamp)
        {
            using var db = _dbConnectionScript.CreateConnection();
            var sql = "update users set timestamp = @TimestampSql where uuid = @uuid;";
            db.Query(sql, new { TimestampSql = timestamp.timestampNum, uuid = timestamp.UUID });
            if (sql == null)
            {
                return Conflict();
            }
            else
            {
                return Ok();
            }
        }
        [HttpPost("getusername")]
        public IActionResult GetUserName(string UUID)
        {
            using var db = _dbConnectionScript.CreateConnection();
            string sql = "select username from users where uuid = @uuid;";
            var username = db.QuerySingleOrDefault<string>(sql, new { uuid = UUID });

            if (username == null)
            {
                return NotFound("User not found.");
            }
            return Ok(username);
        }
    }
}