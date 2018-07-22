using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.DTO
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username{get;set;}
        [Required]
        [StringLength(8,MinimumLength=4,ErrorMessage="You must specify a password")]
        public string Password{get;set;}
    }
}