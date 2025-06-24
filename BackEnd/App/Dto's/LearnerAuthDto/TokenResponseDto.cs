namespace App.Dto_s.LearnerAuthDto;
public class TokenResponseDto
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
}
