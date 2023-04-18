using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  public class AccountController : BaseApiController
  {
    private readonly DataContext _context;

    public AccountController(DataContext context)
    {
      _context = context;
    }

    [HttpPost("register")] // POST: /api/account/register
    public async Task<ActionResult<AppUser>> Register(RegisterDto dto)
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

      return user;
    }

    [HttpPost("login")] // POST: /api/account/login
    public async Task<ActionResult<AppUser>> Login(LoginDto loginDto)
    {
      var user = await _context.Users.SingleOrDefaultAsync(u => u.UserName == loginDto.Username);

      if (user == null) return Unauthorized("invalid username");

      using var hmac = new HMACSHA512(user.PasswordSalt);

      var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
      for (int i = 0; i < computedHash.Length; i++)
      {
        if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("invalid password");
      }

      return user;
    }

    private async Task<bool> UserExists(string username)
    {
      return await _context.Users.AnyAsync(u => u.UserName == username.ToLower());
    }
  }
}
