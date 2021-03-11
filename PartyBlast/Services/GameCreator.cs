using Microsoft.AspNetCore.SignalR;
using PartyBlast.Models;

namespace PartyBlast.Services
{
    public interface GameCreator
    {
        Game CreateGame(string gameCode);
    }
}