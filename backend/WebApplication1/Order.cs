namespace Web
{
    public class Order
    {
        public string StoreName { get; set; }
        public string ProductList { get; set; }
        public float OrderValue { get; set; }
        public string Username{ get; set; }
        public string Address { get; set;}
        public string TelNumber { get; set;}
        public string DeliveryOrders { get; set;}
        public string PostNumber { get; set;}
        public bool POSOption {get; set;}
    }
}