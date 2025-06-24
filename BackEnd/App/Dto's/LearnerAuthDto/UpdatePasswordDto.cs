namespace App.Dto_s.LearnerAuthDto;
public class UpdatePasswordDto
{
    public required string Email { get; set; }
    
    public required string NewPassword { get; set; }
}
