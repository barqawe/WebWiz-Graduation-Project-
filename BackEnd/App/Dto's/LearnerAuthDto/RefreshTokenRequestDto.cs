namespace App.Dto_s.LearnerAuthDto;
public class RefreshTokenRequestDto
{
    public Guid UserId { get; set; }
    public required string RefreshToken { get; set; }
}
