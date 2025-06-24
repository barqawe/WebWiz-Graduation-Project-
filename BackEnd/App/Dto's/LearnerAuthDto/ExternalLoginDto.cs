namespace App.Dto_s.LearnerAuthDto;
public class ExternalLoginDto
{
    public string Provider { get; set; } = string.Empty;     
    public string IdToken { get; set; } = string.Empty;   
}
