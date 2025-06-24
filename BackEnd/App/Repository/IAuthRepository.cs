using App.Dto_s;
using App.Dto_s.LearnerAuthDto;
using Domain.Entities;

namespace App.Repository;
public interface IAuthRepository
{
    Task<Learner?> AddLearnerAsync(Learner request);
    Task<Learner?> GetLearnerByEmailAsync(string email);
    Task<Learner?> GetLearnerByIdAsync(Guid userId);
    Task<Learner?> GetLearnerByProviderIdAsync(string provider, string providerId);
    Task<Learner?> UpdateLearnerAsync(Learner user);
    Task<bool> LogoutAsync(Guid userId);

    Task<Learner?> IncreaseTotalScore(Guid LearnerId , int Score);
    Task<Learner?> DecreaseTotalScore(Guid LearnerId, int Score);
    Task IncreaseCompletedTask(Guid LearenerId);
    Task DecreaseCompletedTask(Guid LearenerId);
    Task<Learner> SaveRefreshTokenAsync(Learner user);
    Task StoreResetCodeAsync(Guid Id, int resetCode);
    Task<bool> ValidateRestCodeAsync(Guid email, int restCode);
    Task<List<LeaderBoardDto>> GetLeaderBoardAsync();
}
