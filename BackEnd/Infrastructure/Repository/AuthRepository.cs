using App.Dto_s;
using App.Dto_s.LearnerAuthDto;
using App.Repository;
using Domain.Entities;
using Infrastructure.DataHandler;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace Infrastructure.Repository;

public class AuthRepository : IAuthRepository
{
    private readonly ILogger<AuthRepository> _logger;
    private readonly AppDbContext _context;
    private readonly IPasswordHasher<Learner> _passwordHasher;

    public AuthRepository(ILogger<AuthRepository> logger, AppDbContext context, IPasswordHasher<Learner> passwordHasher)
    {
        _logger = logger;
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<Learner?> AddLearnerAsync(Learner request)
    {
        try
        {
            if (await _context.Learners.AnyAsync(u => u.Email == request.Email))
            {
                _logger.LogWarning("Email already exists: {Email}", request.Email);
                return null;
            }
            if (request.PasswordHash == string.Empty || request.PasswordHash is null)
            {
                // For external auth users, we don't need a password
                if (string.IsNullOrEmpty(request.Provider) || string.IsNullOrEmpty(request.ProviderId))
                {
                    _logger.LogWarning("Password cannot be empty for non-external auth users!");
                    return null;
                }
            }
            else
            {
                request.PasswordHash = _passwordHasher.HashPassword(request, request.PasswordHash);
            }

            request.Id = Guid.NewGuid();

            var companyEmailRegex = new System.Text.RegularExpressions.Regex(@"^[^@]+@(?!(gmail|yahoo|outlook|hotmail|icloud|aol|protonmail|zoho|mail|gmx|yandex)\.).+\..+$", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            if (companyEmailRegex.IsMatch(request.Email))
            {
                request.CanCreateTask = true;
            }
            else
            {
                request.CanCreateTask = false;
            }

            await _context.Learners.AddAsync(request);
            await _context.SaveChangesAsync();
            _logger.LogInformation("User created successfully: {Username}", request.Username);
            return request;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while adding user: {Username}", request.Username);
            throw;
        }
    }

    public async Task<Learner?> GetLearnerByIdAsync(Guid userId)
    {
        try
        {
            Learner? user = await _context.Learners.FirstOrDefaultAsync(u => u.Id == userId);
            if (user is null)
            {
                _logger.LogWarning("User not found with ID: {UserId}", userId);
                return null;
            }
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving user by ID: {UserId}", userId);
            throw;
        }
    }

    public async Task<Learner?> GetLearnerByEmailAsync(string email)
    {
        try
        {
            Learner? user = await _context.Learners.FirstOrDefaultAsync(u => u.Email == email);
            if (user is null)
            {
                _logger.LogWarning("User not found with Email: {Email}", email);
                return null;
            }
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving user by Email: {Email}", email);
            throw;
        }
    }

    public async Task<Learner?> GetLearnerByProviderIdAsync(string provider, string providerId)
    {
        try
        {
            Learner? user = await _context.Learners
                .FirstOrDefaultAsync(u => u.Provider == provider && u.ProviderId == providerId);

            if (user is null)
            {
                _logger.LogWarning("User not found with Provider {Provider} and ProviderId: {ProviderId}",
                    provider, providerId);
                return null;
            }
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving user by Provider {Provider} and ProviderId: {ProviderId}",
                provider, providerId);
            throw;
        }
    }

    public async Task<Learner?> UpdateLearnerAsync(Learner user)
    {
        try
        {
            _context.Learners.Update(user);
            await _context.SaveChangesAsync();
            _logger.LogInformation("User updated successfully: {UserId}", user.Id);
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating user: {UserId}", user.Id);
            throw;
        }
    }

    public async Task<bool> LogoutAsync(Guid userId)
    {
        try
        {
            Learner? user = await _context.Learners.FindAsync(userId);
            if (user is null)
            {
                _logger.LogWarning("User not found with ID: {UserId}", userId);
                return false;
            }

            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            await _context.SaveChangesAsync();
            _logger.LogInformation("User logged out successfully: {UserId}", userId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while logging out user: {UserId}", userId);
            throw;
        }
    }

    public async Task<Learner> SaveRefreshTokenAsync(Learner user)
    {
        try
        {
            await _context.SaveChangesAsync();
            _logger.LogInformation("Refresh token saved successfully for user: {UserId}", user.Id);
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while saving refresh token for user: {UserId}", user.Id);
            throw;
        }
    }

    public async Task<Learner?> IncreaseTotalScore(Guid LearnerId, int Score)
    {
        try
        {
            Learner? learner = await _context.Learners
            .FirstOrDefaultAsync(l => l.Id == LearnerId);

            if (learner is null)
            {
                _logger.LogWarning("User not found with ID: {UserId}", LearnerId);
                return null;
            }
            learner.TotalScore = (learner.TotalScore ?? 0) + Score;
            _context.Learners.Update(learner);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Added {Score} to learner {LearnerId}. New Total: {Total}", Score, LearnerId, learner.TotalScore);
            return learner;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding score to learner {LearnerId}", LearnerId);
            throw;
        }
    }

    public async Task<Learner?> DecreaseTotalScore(Guid LearnerId, int Score)
    {
        try
        {
            Learner? learner = await _context.Learners
            .FirstOrDefaultAsync(l => l.Id == LearnerId);
            if (learner is null)
            {
                _logger.LogWarning("User not found with ID: {UserId}", LearnerId);
                return null;
            }
            learner.TotalScore = (learner.TotalScore ?? 0) - Score;
            _context.Learners.Update(learner);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Subtracted {Score} from learner {LearnerId}. New Total: {Total}", Score, LearnerId, learner.TotalScore);
            return learner;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error subtracting score from learner {LearnerId}", LearnerId);
            throw;
        }
    }

    public async Task IncreaseCompletedTask(Guid LearnerId)
    {
        try
        {
            Learner? learner = await _context.Learners
             .FirstOrDefaultAsync(l => l.Id == LearnerId);
            if (learner is null)
            {
                _logger.LogWarning("User not found with ID: {UserId}", LearnerId);
                return;
            }
            learner.CompletedTask = (learner.CompletedTask ?? 0) + 1;
            _context.Learners.Update(learner);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Completed task incremented for learner {LearnerId}. New count: {Count}", LearnerId, learner.CompletedTask);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error incrementing completed tasks for learner {LearnerId}", LearnerId);
            throw;
        }
    }

    public async Task DecreaseCompletedTask(Guid LearnerId)
    {
        try
        {
            Learner? learner = await _context.Learners
             .FirstOrDefaultAsync(l => l.Id == LearnerId);
            if (learner is null)
            {
                _logger.LogWarning("User not found with ID: {UserId}", LearnerId);
                return;
            }
            learner.CompletedTask = (learner.CompletedTask ?? 0) - 1;
            _context.Learners.Update(learner);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Completed task decremented for learner {LearnerId}. New count: {Count}", LearnerId, learner.CompletedTask);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error decrementing completed tasks for learner {LearnerId}", LearnerId);
            throw;
        }
    }

    public async Task StoreResetCodeAsync(Guid Id, int resetCode)
    {
        IQueryable<RestCode> expiredCodes = _context.RestCodes
               .Where(r => r.ExpiryTime < DateTime.Now);

        if (expiredCodes.Count() > 0)
            _context.RestCodes.RemoveRange(expiredCodes);

        RestCode rstcode = new RestCode
        {
            Code = resetCode,
            CreatedAt = DateTime.Now,
            ExpiryTime = DateTime.Now.AddMinutes(5),
            LearnerId = Id
        };
        await _context.RestCodes.AddAsync(rstcode);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ValidateRestCodeAsync(Guid learnerId, int restCode)
    {
        var exists = await _context.RestCodes
            .AnyAsync(r => r.LearnerId == learnerId && r.Code == restCode);

        return exists;
    }

    public async Task<List<LeaderBoardDto>> GetLeaderBoardAsync()
    {
        var leaderBoard = await _context.Learners
            .Where(l => l.TotalScore > 0)
            .OrderByDescending(l => l.TotalScore)
            .Select(l => new LeaderBoardDto
            {
                UserName = l.Username,
                TotalScore = l.TotalScore ?? 0,
                CompletedTask = l.CompletedTask ?? 0
            })
            .Take(10)
            .ToListAsync();

        if (leaderBoard == null || leaderBoard.Count == 0)
        {
            _logger.LogWarning("No leaderboard data found.");
            return null!;
        }
        _logger.LogInformation("Retrieved leaderboard with {Count} entries.", leaderBoard.Count);

        return leaderBoard;
    }

}