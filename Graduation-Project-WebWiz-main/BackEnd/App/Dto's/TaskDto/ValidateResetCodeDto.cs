namespace App.Dto_s.LearnerAuthDto;
public class ValidateResetCodeDto
{
    public required string Email { get; set; }
    public required int ResetCode { get; set; }
}