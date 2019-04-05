using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data {
    public class DataContext : DbContext {
        public DataContext(DbContextOptions<DataContext>  options) : base (options) {}

        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Likes { get; set; }

        protected override void OnModelCreating(ModelBuilder builder){
            builder.Entity<Like>()
            .HasKey(x=>new {x.LikerId, x.LikeeId});

            builder.Entity<Like>()
            .HasOne(x=>x.Likee)
            .WithMany(u=>u.Likers)
            .HasForeignKey(u=>u.LikeeId)
            .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Like>()
            .HasOne(x=>x.Liker)
            .WithMany(u=>u.Likees)
            .HasForeignKey(u=>u.LikerId)
            .OnDelete(DeleteBehavior.Restrict);
        }
    }

}