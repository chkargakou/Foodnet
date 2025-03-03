using Microsoft.AspNetCore.Mvc;
using Dapper;
namespace Web.Controllers
{
    [ApiController]
    [Route("Product")]
    public class ProductController : ControllerBase
    {
        int count;
        private readonly IDbConnectionScript _dbConnectionScript;

        public ProductController(IDbConnectionScript dbConnectionscript, IConfiguration configuration)
        {
            _dbConnectionScript = dbConnectionscript;
        }
        [HttpGet("getproducts")]
        public ActionResult<IEnumerable<ProductsResult>> GetProducts(Product product, int page = 1, int size = 1000)
        {
            using var db = _dbConnectionScript.CreateConnection();
            string sql = "select * from products where storename = @storename LIMIT @Size OFFSET @Offset;";
            var products = db.Query<ProductsResult>(sql, new { storename = product.Storename, Size = size, Offset = (page - 1) * size }).ToList();

            return Ok(products);
        }

        [HttpPost("addproduct")]
        public IActionResult AddProduct(AddProduct product)
        {
            using var db = _dbConnectionScript.CreateConnection();
            var sql = "select * from stores join users on stores.owner = uuid Where uuid = @uuid and users.role = 'owner';";
            var result = db.Query(sql, new { uuid = product.ownerUUID });
            if (result == null)
            {
                return Conflict("User is not an Owner or the owner of this store");
            }
            var countSql = "select count(*) from products;";
            count = db.ExecuteScalar<int>(countSql);

            var insertSql = "insert into products(storename,productname,price,id)values(@storename,@productName,@price,@id);";
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
        [HttpPost("removeproduct")]
        public IActionResult RemoveProduct(AddProduct product)
        {
            var db = _dbConnectionScript.CreateConnection();
            var ownerShipSql = "select * from stores where owner = @Owneruuid and name = @Storename;";
            var res = db.Execute(ownerShipSql,new {Owneruuid = product.ownerUUID , Storename = product.StoreName});
            if (res == 0)
            {
                return Conflict("You are not the Owner of the store that has this product");
            }
            var sql = "delete from products where storename = @StoreName and productname = @Productname and price = @Price;";
            try
            {
                int rowsAffected = db.Execute(sql, new
                {
                    StoreName = product.StoreName,
                    Productname = product.ProductName,
                    price = product.ProductPrice
                });
                if (rowsAffected == 0)
                {
                    return NotFound("Product not found");
                }
                return Ok("Product removed successfully.");
            }
            catch (Exception ex)
            {
                return Conflict($"Store could not be removed: {ex.Message}");
            }

        }
    }
}