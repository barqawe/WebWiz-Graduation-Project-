using App.Dto_s;
using App.Dto_s.LearnerAuthDto;
using App.Repository;
using App.Service;
using AutoMapper;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace WhateverEnd.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class GoogleAuthController : ControllerBase
    {
        private readonly IGoogleAuthService _googleAuthService;
        private readonly AuthService _authService;
        private readonly TokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly ILogger<GoogleAuthController> _logger;

        public GoogleAuthController(
            IGoogleAuthService googleAuthService,
            AuthService authService,
            TokenService tokenService,
            IMapper mapper,
            ILogger<GoogleAuthController> logger)
        {
            _googleAuthService = googleAuthService;
            _authService = authService;
            _tokenService = tokenService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost("google")]
        public async Task<ActionResult<TokenResponseDto>> GoogleAuthenticate([FromBody] ExternalLoginDto model)
        {
            try
            {
                if (model.Provider.ToLower() != "google" || string.IsNullOrEmpty(model.IdToken))
                {
                    return BadRequest("Invalid or missing Google token");
                }

                // Verify the Google token
                var userInfo = await _googleAuthService.VerifyTokenAsync(model.IdToken);
                if (userInfo == null)
                {
                    return Unauthorized("Invalid Google token");
                }

                // Find or create user
                var user = await _authService.FindOrCreateAsync(userInfo);
                if (user == null)
                {
                    return StatusCode(500, "Failed to create or retrieve user account");
                }

                // Generate JWT tokens
                var tokenResponse = await _tokenService.CreateTokenResponse(user);

                return Ok(tokenResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during Google authentication");
                return StatusCode(500, "An error occurred during authentication");
            }
        }
    }
}