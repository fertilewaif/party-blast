using System.ComponentModel.DataAnnotations;

namespace PartyBlast.Models
{
    public class ConnectToLobbyViewModel
    {
        public string Login { get; }
        
        [MinLength(4)]
        [MaxLength(4)]
        public string GameCode { get; }
    }
}