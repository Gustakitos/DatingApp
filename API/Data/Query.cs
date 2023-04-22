using API.Data;
using API.Entities;

public class Query
{
  [UseProjection]
  [UseFiltering]
  [UseSorting]
  public IEnumerable<AppUser> GetUsers([Service] DataContext context) => context.Users.ToList();
  public AppUser GetUserById(int id, [Service] DataContext context) =>
    context.Users.Where(u => u.Id == id).FirstOrDefault();

}
