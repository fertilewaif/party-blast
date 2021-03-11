using Microsoft.AspNetCore.SignalR;
using PartyBlast.Models;

namespace PartyBlast.Services
{
    public interface ILobbyProvider
    {
        public Game CreateGame(string gameName);

        public ConnectResult TryConnect(string lobbyCode, string username);
    }
}