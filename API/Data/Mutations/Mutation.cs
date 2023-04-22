using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Interfaces;

namespace API.Data.Mutations
{
  public class Mutation
  {
    private readonly ITokenService _tokenService;

    public Mutation(ITokenService tokenService)
    {
      _tokenService = tokenService;
    }

    public async Task<UserDto> Register([Service] DataContext context, RegisterDto dto)
    {
      using var hmac = new HMACSHA512();

      var user = new AppUser
      {
        UserName = dto.UserName.ToLower(),
        PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password)),
        PasswordSalt = hmac.Key
      };

      context.Users.Add(user);
      await context.SaveChangesAsync();


      return new UserDto
      {
        Username = user.UserName,
        Token = _tokenService.CreateToken(user)
      };
    }
  }
}
