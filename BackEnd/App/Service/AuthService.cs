using App.Dto_s.LearnerAuthDto;
using App.Repository;
using AutoMapper;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace App.Service;

public sealed class AuthService
{
    private readonly ILogger<AuthService> _logger;
    private readonly AppSettings _appSettings;
    private readonly IPasswordHasher<Learner> _passwordHasher;
    private readonly TokenService _tokenService;
    private readonly IAuthRepository _authRepository;
    private readonly IMapper _mapper;
    private readonly IEmailSender _emailSender;
    private readonly IDesignStorageService _cloudinaryService;
    public AuthService(IOptions<AppSettings> appSettings,
        ILogger<AuthService> logger, IPasswordHasher<Learner> passwordHasher,
        TokenService tokenService, IAuthRepository authRepository, IMapper mapper, IEmailSender emailSender, IDesignStorageService cloudinaryService
        )
    {
        _appSettings = appSettings.Value;
        _logger = logger;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _authRepository = authRepository;
        _mapper = mapper;
        _emailSender = emailSender;
        _cloudinaryService = cloudinaryService;
    }
    public async Task<TokenResponseDto?> LoginAsync(LoginLearnerDto request)
    {
        Learner? user = await _authRepository.GetLearnerByEmailAsync(request.Email);
        if (user is null)
        {
            _logger.LogWarning("User not found: {Email}", request.Email);
            return null;
        }
        if (_passwordHasher.VerifyHashedPassword(user, user.PasswordHash!, request.Password) == PasswordVerificationResult.Failed)
        {
            _logger.LogWarning("Invalid password for user: {Email}", request.Email);
            return null;
        }
        return await _tokenService.CreateTokenResponse(user);
    }

    public async Task<LearnerResDto?> RegisterAsync(LearnerReqDto request)

    {
        Learner? learner = await _authRepository.GetLearnerByEmailAsync(request.Email);
        if (learner is not null)
        {
            _logger.LogWarning("User already exists: {Email}", request.Email);
            return null;
        }

        LearnerResDto? registeredLearner = _mapper.Map<LearnerResDto>(await _authRepository.AddLearnerAsync(_mapper.Map<Learner>(request)));
        if (registeredLearner is null)
        {
            _logger.LogError("Failed to register user: {Email}", request.Email);
            return null;
        }
        return registeredLearner;
    }
    public async Task<Learner?> FindOrCreateAsync(ExternalUserDto externalUser)
    {
        // First try to find by provider ID
        var user = await _authRepository.GetLearnerByProviderIdAsync(externalUser.Provider, externalUser.ProviderId);

        // If not found by provider ID, try email (for account linking)
        if (user == null && !string.IsNullOrEmpty(externalUser.Email))
        {
            user = await _authRepository.GetLearnerByEmailAsync(externalUser.Email);

            // If found by email but not yet linked to this provider, update the provider info
            if (user != null && (user.Provider != externalUser.Provider || user.ProviderId != externalUser.ProviderId))
            {
                user.Provider = externalUser.Provider;
                user.ProviderId = externalUser.ProviderId;
                user.ProfileImageUrl = externalUser.ProfileImage;
                user = await _authRepository.UpdateLearnerAsync(user);
                _logger.LogInformation("Linked existing account to {Provider}: {Email}",
                    externalUser.Provider, externalUser.Email);
                return user;
            }
        }

        // If user still not found, create a new account
        if (user == null)
        {
            user = _mapper.Map<Learner>(externalUser);
            if (string.IsNullOrEmpty(user.Username) || user.Username == string.Empty)
            {
                user.Username = GenerateUsername(externalUser);
            }

            user = await _authRepository.AddLearnerAsync(user);
            if (user == null)
            {
                _logger.LogError("Failed to create user from external provider: {Email}", externalUser.Email);
                return null;
            }
            _logger.LogInformation("User created successfully from {Provider}: {Email}",
                externalUser.Provider, externalUser.Email);
        }

        return user;
    }
    public async Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request)
    {
        Learner? user = await _tokenService.ValidateRefreshTokenAsync(request.UserId, request.RefreshToken);
        if (user is null)
        {
            _logger.LogWarning("Invalid refresh token for user ID: {UserId}", request.UserId);
            return null;
        }

        return await _tokenService.CreateTokenResponse(user);
    }

    public async Task<bool> LogoutAsync(Guid userId)
    {
        return await _authRepository.LogoutAsync(userId);
    }
    private string GenerateUsername(ExternalUserDto externalUser)
    {
        string baseUsername;

        if (!string.IsNullOrEmpty(externalUser.Email) && externalUser.Email.Contains('@'))
        {
            baseUsername = externalUser.Email.Split('@')[0];
        }
        else if (!string.IsNullOrEmpty(externalUser.Name))
        {
            // Use name if email is not available
            baseUsername = externalUser.Name.Replace(" ", "_").ToLower();
        }
        else
        {
            // Last resort: use provider and provider ID
            baseUsername = $"{externalUser.Provider.ToLower()}_{externalUser.ProviderId}";
        }

        // Ensure username is not too long and add unique suffix
        if (baseUsername.Length > 20)
        {
            baseUsername = baseUsername.Substring(0, 20);
        }

        return baseUsername + "_" + Guid.NewGuid().ToString("N").Substring(0, 5);
    }

    public async Task<bool> UpdatePasswordAsync(UpdatePasswordDto request)
    {
        if (string.IsNullOrEmpty(request.NewPassword) || request.NewPassword.Length < 6)
        {
            _logger.LogWarning("Invalid password update attempt for user ID: {Email}", request.Email);
            return false;
        }

        Learner? user = await _authRepository.GetLearnerByEmailAsync(request.Email);
        if (user is null)
        {
            _logger.LogWarning("User not found for password update: {Email}", request.Email);
            return false;
        }
        user.PasswordHash = _passwordHasher.HashPassword(user, request.NewPassword);
        return await _authRepository.UpdateLearnerAsync(user) != null;
    }
    public async Task<bool> SendResetCodeAsync(string email)
    {
        Learner? user = await _authRepository.GetLearnerByEmailAsync(email);
        if (user is null)
        {
            _logger.LogWarning("User not found: {Email}", email);
            return false;
        }

        int resetCode = new Random().Next(100000, 999999);

        try
        {
            await _emailSender.SendEmailAsync(
                email,
                "Password Reset Code",
$@"<!DOCTYPE html>
<html lang=""en"">
<head>
  <meta charset=""UTF-8"">
  <title>Verification Code</title>
</head>
<body>
  <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;"">
    <tr>
      <td align=""center"">
        <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""max-width: 600px; background-color: #ffffff; border: 1px solid #ddd; padding: 30px;"">
          <tr>
            <td align=""center"">
              <img src=""https://cdn.pixabay.com/photo/2025/04/18/12/47/ai-generated-9542301_1280.png"" alt=""Logo"" width=""100"" height=""200"" style=""margin-bottom: 10px;"" />
            </td>
          </tr>
          <tr>
            <td>
              <h2 style=""color: #333;"">Verification Code</h2>
              <p style=""font-size: 16px; color: #555;"">
                Your verification code is:
                <strong style=""font-size: 18px; color: #000;"">{resetCode}</strong>
              </p>
              <p style=""font-size: 14px; color: #888;"">
                This code will expire in <strong>5 minutes</strong>.
              </p>
              <p style=""font-size: 12px; color: #aaa;"">
                If you didn't request this code, please ignore this message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>");
            await _authRepository.StoreResetCodeAsync(user.Id, resetCode);

            _logger.LogInformation("Reset code sent to {Email}", email);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", email);
            return false;
        }
    }
    public async Task<bool> ValidateRestCodeAsync(string email, int restCode)
    {
        Learner? learner = await _authRepository.GetLearnerByEmailAsync(email);
        if (learner is null)
            return false;

        bool result = await _authRepository.ValidateRestCodeAsync(learner.Id, restCode);
        if (!result)
            return false;

        return true;
    }
    public async Task<List<LeaderBoardDto>> GetLeaderBoardAsync()
    {
        List<LeaderBoardDto> leaderBoard = await _authRepository.GetLeaderBoardAsync();
        if (leaderBoard is null || leaderBoard.Count == 0)
        {
            _logger.LogWarning("No leaderboard data found.");
            return new List<LeaderBoardDto>();
        }
        _logger.LogInformation("Retrieved leaderboard with {Count} entries.", leaderBoard.Count);
        return leaderBoard;
    }
    public async Task<bool> UploadProfilePictureAsync(Guid userId, IFormFile file)
    {
        if (file is null || file.Length == 0)
        {
            _logger.LogWarning("No file uploaded for user ID: {UserId}", userId);
            return false;
        }

        Learner? user = await _authRepository.GetLearnerByIdAsync(userId);
        if (user is null)
        {
            _logger.LogWarning("User not found for profile picture upload: {UserId}", userId);
            return false;
        }
        try
        {
            string imageUrl = await _cloudinaryService.UploadImageAsync(file);
            if (string.IsNullOrEmpty(imageUrl))
            {
                _logger.LogError("Failed to upload profile picture for user ID: {UserId}", userId);
                return false;
            }

            user.ProfileImageUrl = imageUrl;
            var updatedUser = await _authRepository.UpdateLearnerAsync(user);
            if (updatedUser is null)
            {
                _logger.LogError("Failed to update user profile picture for user ID: {UserId}", userId);
                return false;
            }

            _logger.LogInformation("Profile picture uploaded successfully for user ID: {UserId}", userId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading profile picture for user ID: {UserId}", userId);
            return false;
        }
    }
    public async Task<ProfilePictureDto?> GetProfilePictureAsync(Guid userId)
    {
        Learner? user = await _authRepository.GetLearnerByIdAsync(userId);
        if (user is null)
        {
            _logger.LogWarning("User not found for profile picture retrieval: {UserId}", userId);
            return null;
        }
        if (string.IsNullOrEmpty(user.ProfileImageUrl))
        {
            _logger.LogInformation("No profile picture set for user ID: {UserId}", userId);
            return null;
        }
        _logger.LogInformation("Retrieved profile picture for user ID: {UserId}", userId);
        return _mapper.Map<ProfilePictureDto>(user);
    }
}
