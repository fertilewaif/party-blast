using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using PartyBlast.Models;

namespace PartyBlast.Services
{
    public class QuizGameCreator : GameCreator
    {
        private IConfiguration _configuration;

        private IHubContext<GameHub> _gameHubContext;

        public QuizGameCreator(IConfiguration configuration, IHubContext<GameHub> gameHubContext)
        {
            _configuration = configuration;
            _gameHubContext = gameHubContext;
        }

        public Game CreateGame(string gameCode)
        {
            return new QuizGame(_configuration, _gameHubContext, gameCode);
        }
    }
}