using Microsoft.AspNetCore.SignalR;
using PartyBlast.Models;

namespace PartyBlast.Services
{
    public interface ILobbyProvider
    {
        public string CreateGame(string gameName);

        public ConnectResult TryConnect(string lobbyCode, string username);
    }
}