using Microsoft.AspNetCore.Mvc;
using Dapper;
using MySql.Data.MySqlClient;
using System.Data;
using System.Security.Cryptography.X509Certificates;

namespace Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RegisterController : ControllerBase
    {
        int count;
        private readonly string _connectionString;
        private readonly ILogger<RegisterController> _logger;

        public RegisterController(IConfiguration configuration, ILogger<RegisterController> logger)
        {
            _connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
            _logger = logger;
        }

        private IDbConnection Connection => new MySqlConnection(_connectionString);

        [HttpPost]
        public ActionResult<RegisterResult> Create(Register reg)
        {
            RegisterResult result = new RegisterResult();
            result.Username = reg.Username;
            using var db = Connection;
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

            using var db = Connection;
            string sql = "SELECT password FROM users WHERE username = @Username;";
            string storedEncryptedPassword = db.QuerySingleOrDefault<string>(sql, new { Username = login.Username });

            if (storedEncryptedPassword == null)
            {
                return Unauthorized("Invalid username or password.");
            }

            string decryptedStoredPassword = AesEncryption.Decrypt(storedEncryptedPassword);
            if (login.Password == decryptedStoredPassword)
            {
                return Ok("Login successful!");
            }
            else
            {
                return Unauthorized("Invalid username or password.");
            }
        }
        [HttpGet("getstores")]
        public ActionResult<IEnumerable<Store>> GetStores(int page = 1, int size = 1000)
        {
            using var db = Connection;
            string sql = "SELECT * FROM stores LIMIT @Size OFFSET @Offset;";
            var stores = db.Query<Store>(sql, new { Size = size, Offset = (page - 1) * size }).ToList();

            return Ok(stores);
        }
        [HttpPost("getuuid")]
        public IActionResult GetUUID(User user)
        {
            UserResult result = new UserResult();
            result.Username = user.Username;
            using var db = Connection;
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
            using var db = Connection;
            string sql = "SELECT * FROM products where storename = @storename LIMIT @Size OFFSET @Offset;";
            var products = db.Query<ProductsResult>(sql, new { storename = product.Storename, Size = size, Offset = (page - 1) * size }).ToList();

            return Ok(products);
        }

        [HttpPost("addproduct")]
        public IActionResult AddProduct(AddProduct product)
        {
            using var db = Connection;
            var sql = "select * from stores join users on stores.owner = username Where username = @Username and users.role = 'owner';";
            db.Query(sql, new { Username = product.OwnerName });
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
        public IActionResult AddStore(AddStore addStore)
        {
            using var db = Connection;
            var sql = "select * from users where username = @Username and role = 'owner';"; ;
            db.Query(sql, new { Username = addStore.OwnerName });
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


            var insertSql = @"insert into stores (id, name, location, owner) VALUES (@Id, @Name, @Location, @Owner);";
            try
            {
                db.Execute(insertSql, new
                {
                    Id = count + 1,
                    Name = addStore.StoreName,
                    Location = addStore.location,
                    Owner = addStore.OwnerName
                });

                return Ok("Store added successfully.");
            }
            catch (Exception ex)
            {
                return Conflict($"Store could not be added: {ex.Message}");
            }
        }

        [HttpPost("makeaccowner")]
        public IActionResult ConvertToOwner(User user)
        {
            using var db = Connection;
            var sql = "update users set roleusing var db = Connection; = 'owner' where username = @Username;";
            db.Query(sql, new { Username = user.Username });
            if (sql == null)
            {
                return Conflict("User is already an owner");
            }
            return Ok("User changed to owner");
        }
        [HttpPost("addorder")]
        public IActionResult ConvertToOwner(Order order)
        {
            using var db = Connection;
            var countSql = "select count(*) from order;";
            count = db.ExecuteScalar<int>(countSql);

            var sql = "insert into orders(id,storename,productlist,ordervalue,username,address)values(@id,@storeName,@productlist,@ordervalue,@username,@address);";
            try
            {

                db.Query(sql, new { id = count + 1,storename = order.StoreName , productlist = order.ProductList ,ordervalue = order.OrderValue ,username = order.Username , address = order.Address});
                return Ok("order added");
            }
            catch (Exception ex)
            {
                return Conflict($"order could not be added: {ex.Message}");
            }
        }

        [HttpGet("getorders")]
        public ActionResult<IEnumerable<Order>> Getorders(User user, int page = 1, int size = 1000)
        {
            using var db = Connection;
            string sql = "SELECT * FROM orders where storename = @storename or username = @username LIMIT @Size OFFSET @Offset;";
            var orders = db.Query<Order>(sql, new { storename = user.Username,username = user.Username, Size = size, Offset = (page - 1) * size }).ToList();

            return Ok(orders);
        }
    }
}