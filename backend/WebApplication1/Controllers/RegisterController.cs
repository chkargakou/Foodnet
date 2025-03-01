using Microsoft.AspNetCore.Mvc;
using Dapper;
using System.Data;
using System.Security.Cryptography.X509Certificates;

namespace Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RegisterController : ControllerBase
    {
        int count;
        private readonly IDbConnectionScript _dbConnectionScript;

        public RegisterController(IDbConnectionScript dbConnectionscript ,IConfiguration configuration)
        {
            _dbConnectionScript = dbConnectionscript;
        }

        [HttpPost]
        public ActionResult<RegisterResult> Create(Register reg)
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

            return result;
        }

        [HttpPost("login")]
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
        [HttpGet("getstores")]
        public ActionResult<IEnumerable<Store>> GetStores(int page = 1, int size = 1000)
        {
            using var db = _dbConnectionScript.CreateConnection();
            string sql = "SELECT * FROM stores LIMIT @Size OFFSET @Offset;";
            var stores = db.Query<Store>(sql, new { Size = size, Offset = (page - 1) * size }).ToList();

            return Ok(stores);
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

        [HttpGet("getproducts")]
        public ActionResult<IEnumerable<ProductsResult>> GetProducts(Product product, int page = 1, int size = 1000)
        {
            using var db = _dbConnectionScript.CreateConnection();
            string sql = "SELECT * FROM products where storename = @storename LIMIT @Size OFFSET @Offset;";
            var products = db.Query<ProductsResult>(sql, new { storename = product.Storename, Size = size, Offset = (page - 1) * size }).ToList();

            return Ok(products);
        }

        [HttpPost("addproduct")]
        public IActionResult AddProduct(AddProduct product)
        {
            using var db = _dbConnectionScript.CreateConnection();
            var sql = "select * from stores join users on stores.owner = uuid Where uuid = @uuid and users.role = 'owner';";
            db.Query(sql, new { uuid = product.ownerUUID });
            if (sql == null)
            {
                return Conflict("User is not an Owner or the owner of this store");
            }
            var countSql = "select count(*) from products;";
            count = db.ExecuteScalar<int>(countSql);

            var insertSql = "insert into stores(id,name,location,price)values(@id,@storeName,@productName,@price);";
            try
            {

                db.Query(insertSql, new { id = count + 1, storeName = product.StoreName, productName = product.ProductName, price = product.ProductPrice });
                return Ok("Product Added");
            }
            catch
            {
                return Conflict("Product could not be added");
            }
        }
        [HttpPost("addstore")]
        public IActionResult AddStore(AddRemoveStore addStore)
        {
            using var db = _dbConnectionScript.CreateConnection();
            var sql = "select * from users where uuid = @uuid and role = 'owner';";
            db.Query(sql, new { uuid = addStore.ownerUUID });
            if (sql == null)
            {
                return Conflict("User is not an owner");
            }
            var checkSql = "select(*) from stores where name = @Name and location = @Location;";
            int count = db.ExecuteScalar<int>(checkSql, new { Name = addStore.StoreName, Location = addStore.location });

            if (count > 0)
            {
                return Conflict("A store with this name and location already exists.");
            }
            var countSql = "select count(*) from stores;";
            count = db.ExecuteScalar<int>(countSql);


            var insertSql = @"insert into stores (id, name, location, owner,regdate)
                            VALUES (@Id, @Name, @Location, @Owner,@regdate);";
            string regdate = DateTime.UtcNow.ToString("yyyy-MM-dd");
            try
            {
                db.Execute(insertSql, new
                {
                    Id = count + 1,
                    Name = addStore.StoreName,
                    Location = addStore.location,
                    Owner = addStore.ownerUUID
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
            using var db = _dbConnectionScript.CreateConnection();
            var sql = "delete from stores where name = @StoreName and location = @Location and owner = @OwnerUUID;";
            try
            {
                 db.Execute(sql, new
                {
                    Id = count + 1,
                    StoreName = removeStore.StoreName,
                    Location = removeStore.location,
                    OwnerUUID = removeStore.ownerUUID
                });
                return Ok("Store removed successfully.");
            }
            catch (Exception ex)
            {
                return Conflict($"Store could not be removed: {ex.Message}");
            }

        }

        [HttpPost("makeaccowner")]
        public IActionResult ConvertToOwner(string UUID)
        {
            using var db = _dbConnectionScript.CreateConnection();
            var sql = "update users set role = 'owner' where uuid = @uuid;";
            db.Query(sql, new { uuid = UUID });
            if (sql == null)
            {
                return Conflict("User is already an owner");
            }
            return Ok("User changed to owner");
        }
        [HttpPost("addorder")]
        public IActionResult AddOrder(Order order)
        {
            using var db = _dbConnectionScript.CreateConnection();

            var sql = "insert into orders(id,storename,productlist,ordervalue,address,isCompleted,telNumber,deliveryOrders,postNumber,posOption,uuid)values(@id,@storeName,@productlist,@ordervalue,@address,@isCompleted,@telNumber,@deliveryOrders,@postNumber,@posOption,@uuid);";
            try
            {
                db.Query(sql, new { id = 0, storename = order.StoreName, productlist = order.ProductList, ordervalue = order.OrderValue, address = order.Address, isCompleted = false, telNumber = order.TelNumber, deliveryOrders = order.DeliveryOrders, postNumber = order.PostNumber, posOption = order.POSOption, uuid = order.UUID });
                return Ok("order added");
            }
            catch (Exception ex)
            {
                return Conflict($"order could not be added: {ex.Message}");
            }
        }

        [HttpGet("getOrdersUser")]
        public ActionResult<IEnumerable<Order>> GetOrdersUsers(string UUID, int page = 1, int size = 1000)
        {
            using var db = _dbConnectionScript.CreateConnection();
            string sql = "select * from orders where uuid = @uuid LIMIT @Size OFFSET @Offset;";
            var orders = db.Query<Order>(sql, new { uuid = UUID, Size = size, Offset = (page - 1) * size }).ToList();

            return Ok(orders);
        }
        [HttpGet("getOrdersStore")]
        public ActionResult<IEnumerable<OrderStore>> GetOrdersStore(string StoreName, int page = 1, int size = 1000)
        {
            using var db = _dbConnectionScript.CreateConnection();
            string sql = "select * from orders where storename = @storename LIMIT @Size OFFSET @Offset;";
            var orders = db.Query<OrderStore>(sql, new { storename = StoreName, Size = size, Offset = (page - 1) * size }).ToList();

            return Ok(orders);
        }

        [HttpPost("completeorder")]
        public IActionResult CompleteOrder(int id)
        {
            using var db = _dbConnectionScript.CreateConnection();
            string sql = "update orders set is_delivered = true where id = @orderID;";
            var orders = db.Query(sql, new { orderId = id });
            return Ok("order has been completed");
        }

        [HttpGet("isOwner")]
        public ActionResult IsOwner(string UUID)
        {
            using var db = _dbConnectionScript.CreateConnection();
            var sql = "select * from users where uuid = @uuid and role = 'owner';";
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