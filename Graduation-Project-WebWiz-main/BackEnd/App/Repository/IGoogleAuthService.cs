
using App.Dto_s.LearnerAuthDto;

namespace App.Repository;
public interface IGoogleAuthService
{
    Task<ExternalUserDto> VerifyTokenAsync(string idToken);
}
