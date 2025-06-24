using System.Text.Json.Serialization;

namespace App.Dto_s.LearnerAuthDto;

public class GithubEmailDto
{
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("primary")]
    public bool Primary { get; set; }

    [JsonPropertyName("verified")]
    public bool Verified { get; set; }

    [JsonPropertyName("visibility")]
    public string? Visibility { get; set; }
}
