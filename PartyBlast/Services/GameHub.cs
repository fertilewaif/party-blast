using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace PartyBlast.Services
{
    [Authorize]
    public class GameHub : Hub
    {
        private ILobbyProvider _lobbyProvider;

        public GameHub(ILobbyProvider lobbyProvider)
        {
            _lobbyProvider = lobbyProvider;
        }
    }
}