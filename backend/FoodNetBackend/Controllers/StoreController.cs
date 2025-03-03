using Microsoft.AspNetCore.Mvc;
using Dapper;
using System.Security.Cryptography.X509Certificates;
namespace Web.Controllers
{
    [ApiController]
    [Route("Store")]
    public class StoreController : ControllerBase
    {
        int count;
        private readonly IDbConnectionScript _dbConnectionScript;

        public StoreController(IDbConnectionScript dbConnectionscript, IConfiguration configuration)
        {
            _dbConnectionScript = dbConnectionscript;
        }
        [HttpGet("getstores")]
        public ActionResult<IEnumerable<Store>> GetStores(int page = 1, int size = 1000)
        {
            using var db = _dbConnectionScript.CreateConnection();
            string sql = "SELECT * FROM stores LIMIT @Size OFFSET @Offset;";
            var stores = db.Query<Store>(sql, new { Size = size, Offset = (page - 1) * size }).ToList();

            return Ok(stores);
        }
        [HttpPost("addstore")]
        public IActionResult AddStore(AddRemoveStore addStore)
        {
            using var db = _dbConnectionScript.CreateConnection();
            var sql = "select * from users where uuid = @uuid and role = 'owner';";
            var result = db.Query(sql, new { uuid = addStore.ownerUUID });
            if (result == null)
            {
                return Conflict("User is not an owner");
            }
            var checkSql = "select count(*) from stores where name = @Name;";
            int count = db.ExecuteScalar<int>(checkSql, new { Name = addStore.StoreName });
            if (count > 0)
            {
                return Conflict("A store with this name already exists");
            }
            var countSql = "select count(*) from stores;";
            count = db.ExecuteScalar<int>(countSql);
            var insertSql = "insert into stores (name, location,createdat,store_id,owner)values(@Name,@Location,@regdate,@Id,@Owner);";
            string registrationdate = DateTime.UtcNow.ToString("yyyy-MM-dd");
            try
            {
                db.Execute(insertSql, new
                {
                    Id = count + 1,
                    Name = addStore.StoreName,
                    Location = addStore.location,
                    Owner = addStore.ownerUUID,
                    regdate = registrationdate
                });

                return Ok("Store added successfully.");
            }
            catch (Exception ex)
            {
                return Conflict($"Store could not be added: {ex.Message}");
            }
        }
        [HttpPost("removestore")]
        public IActionResult RemoveStore(AddRemoveStore removeStore)
        {
            var db = _dbConnectionScript.CreateConnection();
            var sql = "delete from stores where name = @StoreName and location = @Location and owner = @OwnerUUID;";
            try
            {
                int rowsAffected = db.Execute(sql, new
                {
                    StoreName = removeStore.StoreName,
                    Location = removeStore.location,
                    OwnerUUID = removeStore.ownerUUID
                });
                if (rowsAffected == 0)
                {
                    return NotFound("Store not found or you do not have permission to delete it.");
                }
                var deleteSql = "delete from products where storename = @StoreName";
                db.Execute(deleteSql , new {StoreName =removeStore.StoreName});
                return Ok("Store removed successfully.");
            }
            catch (Exception ex)
            {
                return Conflict($"Store could not be removed: {ex.Message}");
            }
        }
        [HttpGet("getStoresOwned")]
        public ActionResult<IEnumerable<Store>> GetStoresOwned(string UUID, int page = 1, int size = 1000)
        {
            var db = _dbConnectionScript.CreateConnection();
            string sql = "select * from stores where owner = @uuid;";
            var stores = db.Query<Store>(sql, new { uuid = UUID, Size = size, Offset = (page - 1) * size }).ToList();

            return Ok(stores);
        }
    }
}