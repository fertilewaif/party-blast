using System.ComponentModel.DataAnnotations;

namespace PartyBlast.Models
{
    public class CreateLobbyViewModel
    {
        [Required]
        public string GameName { get; set; } 
    }
}