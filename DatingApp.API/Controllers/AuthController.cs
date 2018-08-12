using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.DTO;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System;
using Microsoft.Extensions.Configuration;
using AutoMapper;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly IAuthRepository _repo;

        private readonly IConfiguration _config;

        public IMapper _mapper { get; }

        public AuthController(IAuthRepository repo,IConfiguration config, IMapper mapper)
        {
            this._repo = repo;
            _config = config;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]UserForRegisterDto userDto){
            if(!string.IsNullOrEmpty(userDto.Username))
                userDto.Username = userDto.Username.ToLower();

            if(await _repo.UserExists(userDto.Username)){
                ModelState.AddModelError("Username","Username already taken");
            }

            //validate request
            if(!ModelState.IsValid){
            return BadRequest(ModelState);
            }
            
            var userToCreate = new User{
                Username = userDto.Username
            };

            var createUser = await _repo.Register(userToCreate,userDto.Password);

            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserForLoginDto userForLogin){            

            var userFromRepo = _repo.VerifyUsername(userForLogin.Username.ToLower());

            if(userFromRepo == null){
                ModelState.AddModelError("Username","Computer says no!");
            }

            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

           string username= "";
            

            if(await _repo.UserExists(userForLogin.Username.ToLower())){
                username = userForLogin.Username;
            }
            else{
                return Unauthorized();
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config.GetSection("AppSettings:Token").Value);

            var tokenDescriptor = new SecurityTokenDescriptor{
              Subject = new ClaimsIdentity(new Claim[]
              {
                  new Claim(ClaimTypes.NameIdentifier,userFromRepo.Id.ToString()),
                  new Claim(ClaimTypes.Name, username)
              }),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha512Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            var user = _mapper.Map<UserForListDto>(userFromRepo);

            return Ok(new {
                tokenString,
                user
                });
            }

        }
    }