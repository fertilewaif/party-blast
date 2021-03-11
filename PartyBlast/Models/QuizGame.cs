using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using PartyBlast.Services;

namespace PartyBlast.Models
{
    public class QuizGame : Game
    {
        public QuizGame(IConfiguration configuration, IHubContext<GameHub> gameHubContext, string gameCode) : 
            base(configuration, gameHubContext, gameCode)
        {
        }
    }
}