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
            Console.WriteLine("Register");
            Console.WriteLine(result.Username);
            Console.WriteLine(result.Password);
            Console.WriteLine(result.Id);
            return result;
        }

        [HttpPost("login")]
        public IActionResult Login(Login login)
        {
            if (string.IsNullOrEmpty(login.Username) || string.IsNullOrEmpty(login.Password))
            {
                return BadRequest("Username or password cannot be empty.");
            }

            var user = myList.FirstOrDefault(u => u.Username == login.Username && u.Password == login.Password);

            if (user != null)
            {
                Console.WriteLine("Successful login");
                Console.WriteLine(login.Username);
                Console.WriteLine(login.Password);
                return Ok(new { Message = "Login successful", UserId = user.Id });    
            }
            else
            {
                return Unauthorized("Invalid username or password.");
            }
        }
    }
}
