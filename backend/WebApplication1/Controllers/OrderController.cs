using Microsoft.AspNetCore.Mvc;
using Dapper;

namespace Web.Controllers
{
    [ApiController]
    [Route("Order")]
    public class OrderController : ControllerBase
    {
        private readonly IDbConnectionScript _dbConnectionScript;

        public OrderController(IDbConnectionScript dbConnectionscript ,IConfiguration configuration)
        {
            _dbConnectionScript = dbConnectionscript;
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
        public ActionResult<IEnumerable<OrderStore>> GetOrdersStore(Ownership ownership, int page = 1, int size = 1000)
        {
            using var db = _dbConnectionScript.CreateConnection();
            string sql = "select * from orders inner join stores on stores.name = orders.storename where orders.storename = @storeName and stores.owner = @UUID   LIMIT @Size OFFSET @Offset;";
            var orders = db.Query<OrderStore>(sql, new { storeName = ownership.storeName , UUID = ownership.UUID , Size = size, Offset = (page - 1) * size }).ToList();
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
    }
}