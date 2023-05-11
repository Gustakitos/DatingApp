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
      try
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
      catch (Exception ex)
      {
        Console.WriteLine($" Error: {ex}");
        throw new Exception("Deu ruim");
      }
    }

    public async Task<UserDto> Login([Service] IUserRepository repo, LoginDto loginDto)
    {
      try
      {
        var user = await repo.GetUserByUsernameAsync(loginDto.Username);

        if (user == null) throw new Exception("invalid username");

        using var hmac = new HMACSHA512(user.PasswordSalt);

        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
        for (int i = 0; i < computedHash.Length; i++)
        {
          if (computedHash[i] != user.PasswordHash[i]) throw new Exception("invalid password");
        }

        return new UserDto
        {
          Username = user.UserName,
          Token = _tokenService.CreateToken(user)
        };
      }
      catch (Exception ex)
      {
        throw new Exception($"Error ${ex}");
      }
    }
  }
}
