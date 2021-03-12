using System;
using Microsoft.AspNetCore.Mvc;
using PartyBlast.Models;
using PartyBlast.Services;

namespace PartyBlast.Controllers
{
    [ApiController]
    [Route("api/lobby/")]
    public class LobbyController : Controller
    {
        private ILobbyProvider _lobbyProvider;

        public LobbyController(ILobbyProvider lobbyProvider)
        {
            _lobbyProvider = lobbyProvider;
        }

        [HttpPost]
        [Route("create")]
        public IActionResult CreateLobby([FromBody] CreateLobbyViewModel createLobbyViewModel)
        {
            try
            {
                var gameCode = _lobbyProvider.CreateGame(createLobbyViewModel.GameName);

                var result = new
                {
                    RoomCode = gameCode
                };

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("connect")]
        public IActionResult ConnectToLobby([FromBody] ConnectToLobbyViewModel connectToLobbyViewModel)
        {
            try
            {
                var connectResult =
                    _lobbyProvider.TryConnect(connectToLobbyViewModel.GameCode, connectToLobbyViewModel.Login);

                return Ok(connectResult);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}