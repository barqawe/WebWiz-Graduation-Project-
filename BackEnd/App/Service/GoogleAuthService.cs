using App.Dto_s;
using App.Repository;
using Google.Apis.Auth;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Domain.Entities;
using App.Dto_s.LearnerAuthDto;

public class GoogleAuthService : IGoogleAuthService
{
    private readonly GoogleAuthSettings _googleSettings;
    private readonly ILogger<GoogleAuthService> _logger;

    public GoogleAuthService(IOptions<GoogleAuthSettings> googleSettings, ILogger<GoogleAuthService> logger)
    {
        _googleSettings = googleSettings.Value;
        _logger = logger;
    }

    public async Task<ExternalUserDto> VerifyTokenAsync(string idToken)
    {
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _googleSettings.ClientId },
                IssuedAtClockTolerance = TimeSpan.FromMinutes(5),
                ExpirationTimeClockTolerance = TimeSpan.FromMinutes(5)
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            if(payload is null)
            {
                _logger.LogWarning("Google token validation failed: payload is null");
                throw new InvalidJwtException("Invalid Google token");
            }
            _logger.LogInformation("Successfully validated Google token for user: {Email}", payload.Email);

            return new ExternalUserDto
            {
                Email = payload.Email,
                Name = payload.Name,
                ProfileImage = payload.Picture,
                Provider = "Google",
                ProviderId = payload.Subject
            };
        }
        catch (InvalidJwtException ex)
        {
            _logger.LogWarning(ex, "Invalid Google token");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying Google token");
            throw;
        }
    }
}
