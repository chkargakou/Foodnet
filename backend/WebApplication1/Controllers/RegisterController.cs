using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RegisterController : ControllerBase
    {


        private static List<RegisterResult> myList = new List<RegisterResult>();
        private static int index = 0;

        private readonly ILogger<RegisterController> _logger;

        public RegisterController(ILogger<RegisterController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<RegisterResult> GetAll()
        {
            return myList;
        }

        [HttpGet("{id}")]
        public ActionResult<RegisterResult> Get([FromRoute] long id)
        {
            var reg =  myList.FirstOrDefault(x => x.Id == id);
            if (reg != null)
            {
                return reg;
            } else
            {
                return NotFound();
            }
        }

        [HttpPost]
        public ActionResult<RegisterResult> Create(Register reg)
        {
            RegisterResult result = new RegisterResult();
            result.Username = reg.Username;
            result.Password = reg.Password;
            myList.Add(result);
            result.Id = ++index;
            Console.WriteLine(result.Username);
            Console.WriteLine(result.Password);
            return result;
        }
    }
}
