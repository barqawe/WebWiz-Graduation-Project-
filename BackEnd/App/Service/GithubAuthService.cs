using App.Dto_s.LearnerAuthDto;
using App.Repository;
using Domain.Entities;
using Google.Apis.Auth;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Text.Json;


namespace App.Service
{
    public class GithubAuthService : IGithubAuthService
    {

        private readonly GithubAuthSettings _githubSettings;
        private readonly ILogger<GithubAuthService> _logger;
        private readonly HttpClient _httpClient;

        public GithubAuthService(IOptions<GithubAuthSettings> githubSettings, ILogger<GithubAuthService> logger, HttpClient httpClient
            )
        {
            _githubSettings = githubSettings.Value;
            _logger = logger;
            _httpClient = httpClient;
        }
        public async Task<ExternalUserDto> VerifyCodeAsync(string code)
        {

            try
            {
                var tokenRequest = new HttpRequestMessage(HttpMethod.Post, "https://github.com/login/oauth/access_token");
                tokenRequest.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                tokenRequest.Content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                {"client_id", _githubSettings.ClientId},
                {"client_secret", _githubSettings.ClientSecret},
                {"code", code}
            });

                _logger.LogInformation("Requesting GitHub access token for code: {CodePrefix}...", code.Substring(0, Math.Min(8, code.Length)));

                var tokenResponse = await _httpClient.SendAsync(tokenRequest);
                tokenResponse.EnsureSuccessStatusCode();
                var tokenResult = await tokenResponse.Content.ReadAsStringAsync();
                var tokenData = JsonSerializer.Deserialize<Dictionary<string, string>>(tokenResult);
                var accessToken = tokenData?["access_token"];

                if (string.IsNullOrEmpty(accessToken))
                    throw new Exception("Access token not found");

                _logger.LogInformation("Successfully obtained GitHub access token");

                var userRequest = new HttpRequestMessage(HttpMethod.Get, "https://api.github.com/user");
                userRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                userRequest.Headers.UserAgent.ParseAdd("WebWiz");

                var userResponse = await _httpClient.SendAsync(userRequest);
                userResponse.EnsureSuccessStatusCode();

                var userResult = await userResponse.Content.ReadAsStringAsync();
                var githubData = JsonSerializer.Deserialize<GithubUserDto>(userResult);

                if (githubData == null)
                    throw new Exception("Failed to deserialize GitHub user data");

                _logger.LogInformation("Retrieved GitHub user data for user: {Login}", githubData.Login);                // Get user's email if not provided in the main response
                string userEmail = githubData.Email ?? "";
                if (string.IsNullOrEmpty(userEmail))
                {
                    _logger.LogInformation("User email not provided in main response, attempting to retrieve from emails endpoint");
                    userEmail = await GetUserEmailAsync(accessToken);

                    // If still no email, create a warning but don't fail the authentication
                    if (string.IsNullOrEmpty(userEmail))
                    {
                        _logger.LogWarning("Could not retrieve email for GitHub user {Login}. User will be created without email.", githubData.Login);
                    }
                }
                else
                {
                    _logger.LogInformation("Email found in main user response: {Email}", userEmail.Substring(0, Math.Min(3, userEmail.Length)) + "***");
                }

                var result = new ExternalUserDto
                {
                    Email = userEmail,
                    Name = githubData.Name ?? githubData.Login,
                    ProfileImage = githubData.AvatarUrl ?? "",
                    Provider = "GitHub",
                    ProviderId = githubData.Id.ToString()
                };

                _logger.LogInformation("Successfully created ExternalUserDto for GitHub user. Has email: {HasEmail}, Has profile image: {HasImage}",
                    !string.IsNullOrEmpty(result.Email), !string.IsNullOrEmpty(result.ProfileImage));

                return result;


            }
            catch (InvalidJwtException ex)
            {
                _logger.LogWarning(ex, "Invalid github token");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying github token");
                throw;
            }

        }

        private async Task<string> GetUserEmailAsync(string accessToken)
        {
            try
            {
                _logger.LogInformation("Attempting to retrieve user emails from GitHub emails endpoint");

                var emailsRequest = new HttpRequestMessage(HttpMethod.Get, "https://api.github.com/user/emails");
                emailsRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                emailsRequest.Headers.UserAgent.ParseAdd("WebWiz"); var emailsResponse = await _httpClient.SendAsync(emailsRequest);

                if (!emailsResponse.IsSuccessStatusCode)
                {
                    _logger.LogWarning("GitHub emails API returned status code: {StatusCode}. Response: {Response}",
                        emailsResponse.StatusCode, await emailsResponse.Content.ReadAsStringAsync());
                    return string.Empty;
                }

                var emailsResult = await emailsResponse.Content.ReadAsStringAsync();
                _logger.LogInformation("GitHub emails API response: {Response}", emailsResult);

                var emailsData = JsonSerializer.Deserialize<List<GithubEmailDto>>(emailsResult);

                if (emailsData == null || !emailsData.Any())
                {
                    _logger.LogWarning("No emails found for GitHub user");
                    return string.Empty;
                }

                _logger.LogInformation("Found {Count} emails for GitHub user", emailsData.Count);

                // Prioritize primary and verified emails
                var primaryEmail = emailsData.FirstOrDefault(e => e.Primary && e.Verified);
                if (primaryEmail != null)
                {
                    _logger.LogInformation("Using primary verified email");
                    return primaryEmail.Email;
                }

                // Fallback to any verified email
                var verifiedEmail = emailsData.FirstOrDefault(e => e.Verified);
                if (verifiedEmail != null)
                {
                    _logger.LogInformation("Using first verified email");
                    return verifiedEmail.Email;
                }

                // Last resort: use the first email
                _logger.LogWarning("No verified emails found, using first available email");
                return emailsData.First().Email;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving GitHub user emails");
                return string.Empty;
            }
        }
    }
}