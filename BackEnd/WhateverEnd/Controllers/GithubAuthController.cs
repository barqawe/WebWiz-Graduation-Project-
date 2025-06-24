using App.Dto_s;
using App.Dto_s.LearnerAuthDto;
using App.Repository;
using App.Service;
using AutoMapper;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WhateverEnd.Controllers
{

    [Route("api/auth")]
    [ApiController]
    public class GithubAuthController : ControllerBase
    {

        private readonly IGithubAuthService _githubAuthService;
        private readonly AuthService _authService;
        private readonly TokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly ILogger<GithubAuthController> _logger;

        public GithubAuthController(IGithubAuthService githubAuthService, AuthService authService, TokenService tokenService,
            IMapper mapper, ILogger<GithubAuthController> logger)
        {
            _githubAuthService = githubAuthService;
            _authService = authService;
            _tokenService = tokenService;
            _mapper = mapper;
            _logger = logger;
        }



        [HttpPost("Github")]
        public async Task<ActionResult<TokenResponseDto>> GithubAuthenticate([FromBody] ExternalLoginDto model)
        {
            try
            {
                if (model.Provider.ToLower() != "github" || string.IsNullOrEmpty(model.IdToken))
                {
                    _logger.LogWarning("Invalid GitHub provider or missing IdToken");
                    return BadRequest("Invalid or missing GitHub code");
                }

                // Verify the GitHub code
                var userInfo = await _githubAuthService.VerifyCodeAsync(model.IdToken);
                if (userInfo == null)
                {
                    _logger.LogWarning("GitHub code verification failed for token: {Token}", model.IdToken);
                    return Unauthorized("Invalid GitHub code");
                }

                // Find or create user
                var user = await _authService.FindOrCreateAsync(userInfo);
                if (user == null)
                {
                    _logger.LogError("Failed to create or retrieve user account for GitHub user: {UserInfo}", userInfo);
                    return StatusCode(500, "Failed to create or retrieve user account");
                }

                var tokenResponse = await _tokenService.CreateTokenResponse(user);

                return Ok(tokenResponse);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during GitHub authentication");

                return StatusCode(500, $"Error: {ex.Message} \n {ex.StackTrace}");
            }
        }




    }
}