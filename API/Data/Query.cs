using API.DTOs;
using API.Entities;
using API.Interfaces;

public class Query
{

  [UseProjection]
  [UseFiltering]
  [UseSorting]
  public async Task<IEnumerable<AppUser>> GetUsersAsync([Service] IUserRepository repo) => await repo.GetUsersAsync();
  public IEnumerable<MemberDto> GetMembers([Service] IUserRepository repo)
  {
    try
    {
      return repo.GetMembers();
    }
    catch (Exception ex)
    {
      Console.WriteLine($" Error: {ex}");
      throw new Exception("Deu ruim");
    }
  }
  public async Task<AppUser> GetUserByIdAsync([Service] IUserRepository repo, int id) => await repo.GetUserByIdAsync(id);
  public async Task<MemberDto> GetMemberAsync([Service] IUserRepository repo, string username) => await repo.GetMemberAsync(username);
  public async Task<IEnumerable<MemberDto>> GetMembersAsync([Service] IUserRepository repo)
  {
    try
    {
      Console.WriteLine("Here");
      var members = await repo.GetMembersAsync();

      if (members.Count() > 0) return members;

      members.Append(new MemberDto());
      return members;
    }
    catch (Exception ex)
    {
      Console.WriteLine($" Error: {ex}");
      throw new Exception("Deu ruim");
    }
  }
  public async Task<AppUser> GetUserByUsernameAsync([Service] IUserRepository repo, string username) => await repo.GetUserByUsernameAsync(username);
}
