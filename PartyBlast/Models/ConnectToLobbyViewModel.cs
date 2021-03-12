using System.ComponentModel.DataAnnotations;

namespace PartyBlast.Models
{
    public class ConnectToLobbyViewModel
    {
        [Required]
        public string Login { get; set; }
        
        [Required]
        [MinLength(4)]
        [MaxLength(4)]
        public string GameCode { get; set; }
    }
}