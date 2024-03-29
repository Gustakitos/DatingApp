using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  public class AccountController : BaseApiController
  {
    private readonly DataContext _context;
    private readonly ITokenService _tokenService;

    public AccountController(DataContext context, ITokenService tokenService)
    {
      _tokenService = tokenService;
      _context = context;
    }

    [HttpPost("register")] // POST: /api/account/register
    public async Task<ActionResult<UserDto>> Register(RegisterDto dto)
    {
      if (await UserExists(dto.UserName)) return BadRequest("Username is taken");

      using var hmac = new HMACSHA512();
      var user = new AppUser
      {
        UserName = dto.UserName.ToLower(),
        PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password)),
        PasswordSalt = hmac.Key
      };

      _context.Users.Add(user);
      await _context.SaveChangesAsync();

      return new UserDto
      {
        Username = user.UserName,
        Token = _tokenService.CreateToken(user)
      };
    }

    [HttpPost("login")] // POST: /api/account/login
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
      var user = await _context.Users
        .Include(p => p.Photos)
        .SingleOrDefaultAsync(u => u.UserName == loginDto.Username);

      if (user == null) return Unauthorized("invalid username");

      using var hmac = new HMACSHA512(user.PasswordSalt);

      var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
      for (int i = 0; i < computedHash.Length; i++)
      {
        if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("invalid password");
      }

      return new UserDto
      {
        Username = user.UserName,
        Token = _tokenService.CreateToken(user),
        PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url
      };
    }

    private async Task<bool> UserExists(string username)
    {
      return await _context.Users.AnyAsync(u => u.UserName == username.ToLower());
    }
  }
}
