using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;

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
    [Authorize]
    public async Task<bool> UpdateUser(
      [Service] IUserRepository repo,
      [Service] IHttpContextAccessor httpContextAccessor,
      [Service] IMapper mapper,
      MemberUpdateDto dto
    )
    {
      try
      {
        ClaimsPrincipal claimUser = httpContextAccessor.HttpContext.User;

        var userName = claimUser.GetUsername();

        var user = await repo.GetUserByUsernameAsync(userName);

        if (user == null) return false;

        mapper.Map(dto, user);

        if (await repo.SaveAllAsync()) return true;

        return false;
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Erro: {ex}");
        throw new Exception(ex.Message, ex.InnerException);
      }
    }

    public async Task<PhotoDto> UploadUserImage(
      [Service] IUserRepository repo,
      [Service] IHttpContextAccessor httpContextAccessor,
      [Service] IPhotoService photoService,
      IFile file
    )
    {
      Console.WriteLine("something? ");
      try
      {
        ClaimsPrincipal claimUser = httpContextAccessor.HttpContext.User;

        var userName = claimUser.GetUsername();

        var user = await repo.GetUserByUsernameAsync(userName);

        if (user == null) throw new Exception("Problem adding photo");

        var result = await photoService.AddPhotoMutationAsync(file);

        if (result.Error != null) throw new Exception("Problem adding photo");

        var photo = new Photo
        {
          Url = result.SecureUrl.AbsoluteUri,
          PublicId = result.PublicId,
        };

        if (user.Photos.Count == 0) photo.IsMain = true;

        user.Photos.Add(photo);

        if (await repo.SaveAllAsync())
        {
          return new PhotoDto
          {
            Id = photo.Id,
            Url = result.SecureUrl.AbsoluteUri,
            IsMain = photo.IsMain
          };
        }

        throw new Exception("Problem adding photo");
      }
      catch (Exception ex)
      {
        throw new Exception($"Problem adding photo, {ex}");
      }
    }
  }
}
