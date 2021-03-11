using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.SignalR;
using PartyBlast.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace PartyBlast.Models
{
    public abstract class Game
    {
        protected readonly IHubContext<GameHub> _gameHubContext;

        protected ISet<string> _registeredUsers;

        protected string _gameCode;

        protected IConfiguration _configuration;

        protected Game(IConfiguration configuration, IHubContext<GameHub> gameHubContext, string gameCode)
        {
            _configuration = configuration;
            _gameHubContext = gameHubContext;
            _gameCode = gameCode;
        }

        public ConnectResult Connect(string username)
        {
            if (_registeredUsers.Contains(username))
            {
                throw new ArgumentException($"user with username {username} already connected");
            }

            _registeredUsers.Add(username);
            
            // generating jwt token for connecting to lobby
            var issuedAt = DateTime.UtcNow;

            var expiresAt = issuedAt.AddHours(1);

            var tokenHandler = new JwtSecurityTokenHandler();

            var claimsIdentity = new ClaimsIdentity(new[]
            {
                new Claim("username", username),
                new Claim("game_code", _gameCode)
            });

            var jwt = new JwtSecurityToken(
                issuer: _configuration["Issuer"],
                audience: _configuration["audience"],
                notBefore: issuedAt,
                claims: claimsIdentity.Claims,
                expires: expiresAt,
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration["JwtKey"])),
                    SecurityAlgorithms.HmacSha256
                )
            );

            var encodedJwt = tokenHandler.WriteToken(jwt);
            return new ConnectResult
            {
                Token = encodedJwt
            };
        } 
    }
}