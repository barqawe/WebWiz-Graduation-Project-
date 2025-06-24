using Domain.Entities;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using App.Dto_s;
using App.Repository;
using Microsoft.Extensions.Logging;
using App.Dto_s.LearnerAuthDto;

namespace App.Service;
public sealed class TokenService
{
    private readonly IAuthRepository _authRepository;
    private readonly IOptions<AppSettings> _appSettings;
    private readonly ILogger<TokenService> _logger;
    public TokenService(IOptions<AppSettings> appSettings, IAuthRepository authRepository,ILogger<TokenService> logger)
    {
        _appSettings = appSettings;
        _authRepository = authRepository;
        _logger = logger;
    }

    public string CreateToken(Learner learner)
    {
        List<Claim> claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, learner.Username),
            new Claim(ClaimTypes.NameIdentifier, learner.Id.ToString()),
            new Claim(ClaimTypes.Email, learner.Email),
            new Claim("CanCreateTask", learner.CanCreateTask.ToString())
        };

        SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.Value.Token));
        SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        JwtSecurityToken tokenDescriptor = new JwtSecurityToken(
            issuer: _appSettings.Value.Issuer,
            audience: _appSettings.Value.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }

    public string GenerateRefreshToken()
    {
        byte [] randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
    public async Task<TokenResponseDto> CreateTokenResponse(Learner learner)
    {
        return new TokenResponseDto
        {
            AccessToken = CreateToken(learner),
            RefreshToken = await GenerateAndSaveRefreshTokenAsync(learner)
        };
    }

    public async Task<Learner?> ValidateRefreshTokenAsync(Guid learnerId, string refreshToken)
    {
        Learner? learner = await _authRepository.GetLearnerByIdAsync(learnerId);
        if (learner is null || learner.RefreshToken != refreshToken)
        {
            _logger.LogWarning("Token not valid for user ID: {UserId}", learnerId);
            return null;
        }
        return learner;
    }
    public async Task<string> GenerateAndSaveRefreshTokenAsync(Learner learner)
    {
        string refreshToken = GenerateRefreshToken();
        learner.RefreshToken = refreshToken;
        learner.RefreshTokenExpiryTime = DateTime.UtcNow.AddSeconds(10);
        await _authRepository.SaveRefreshTokenAsync(learner);
        return refreshToken;
    }
}