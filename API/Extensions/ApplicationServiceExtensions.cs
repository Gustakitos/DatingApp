using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Data.Mutations;
using API.Data.Repositories;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
  public static class ApplicationServiceExtensions
  {
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
      IConfiguration config)
    {
      services.AddDbContext<DataContext>(options =>
      {
        options.UseSqlite(config.GetConnectionString("DefaultConnection"));
      });
      // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
      services.AddEndpointsApiExplorer();
      services.AddSwaggerGen();
      services.AddCors();

      services.AddGraphQLServer()
        .AddQueryType<Query>()
        .AddMutationType<Mutation>()
        .AddProjections()
        .AddFiltering()
        .AddSorting()
        .AddType<UploadType>()
        .AddApolloTracing()
        .AddMutationConventions();

      services.AddScoped<ITokenService, TokenService>();
      services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
      services.AddScoped<IUserRepository, UserRepository>();

      services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

      services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
      services.AddScoped<IPhotoService, PhotoService>();

      return services;
    }
  }
}
