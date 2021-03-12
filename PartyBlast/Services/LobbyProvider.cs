using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.SignalR;
using PartyBlast.Models;

namespace PartyBlast.Services
{
    public class LobbyProvider : ILobbyProvider
    {
        private readonly IDictionary<string, GameCreator> _gameCreators = new Dictionary<string, GameCreator>(); 
        
        private IDictionary<string, Game> _presentGames = new Dictionary<string, Game>();

        private static readonly Random Random = new();

        private const int LobbyCodeLength = 4;

        private IServiceProvider _serviceProvider;

        public LobbyProvider(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
            _gameCreators.Add("quiz", (GameCreator) serviceProvider.GetService(typeof(QuizGameCreator)));
        }
        
        public string CreateGame(string gameName)
        {
            if (!_gameCreators.ContainsKey(gameName))
            {
                throw new ArgumentException($"no game with name {gameName}");
            }

            var code = GenerateCode();

            var game = _gameCreators[gameName].CreateGame(code);

            _presentGames[code] = game;
            
            return game.GameCode;
        }

        public ConnectResult TryConnect(string lobbyCode, string username)
        {
            if (!_presentGames.ContainsKey(lobbyCode))
            {
                throw new ArgumentException($"no game with lobby code {lobbyCode}");
            }

            return _presentGames[lobbyCode].Connect(username);
        }

        private string GenerateCode()
        {
            string res;
            do
            {
                res = GenerateRandomString();
            } while (_presentGames.ContainsKey(res));
            return res;
        }

        private string GenerateRandomString()
        {
            var res = "";
            for (int i = 0; i < LobbyCodeLength; i++)
            {
                res += (char) Random.Next('A', 'Z');
            }

            return res;
        }
    }
}