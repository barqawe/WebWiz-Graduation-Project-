using App.Dto_s;
using App.Dto_s.LearnerAuthDto;
using App.Repository;
using App.Service;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WhateverEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(AuthService authService) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult<LearnerResDto>> Register(LearnerReqDto request)
        {
            var user = await authService.RegisterAsync(request);
            if (user is null)
                return BadRequest("Username already exists.");

            return Ok(user);
        }
        [HttpPost("login")]
        public async Task<ActionResult<TokenResponseDto>> Login(LoginLearnerDto request)
        {
            var result = await authService.LoginAsync(request);
            if (result is null)
                return BadRequest("Invalid username or password.");

            return Ok(result);
        }

        [HttpPut("update-password")]
        public async Task<IActionResult> UpdatePassword(UpdatePasswordDto request)
        {
            var result = await authService.UpdatePasswordAsync(request);
            if (!result)
                return BadRequest("Password update failed.");
            return Ok("Password updated successfully.");
        }

        [HttpPost("send-reset-code")]
        public async Task<IActionResult> SendResetCode(SendRestNumberDto sendRestNumberDto)
        {
            var result = await authService.SendResetCodeAsync(sendRestNumberDto.Email);
            if (!result)
                return BadRequest("Failed to send reset number.");
            return Ok("Reset number sent successfully.");
        }
        [HttpPost("validate-reset-code")]
        public async Task<bool> VildateRestCode(ValidateResetCodeDto ResetCode)
        {
            bool result = await authService.ValidateRestCodeAsync(ResetCode.Email, ResetCode.ResetCode);

            if (!result)
                return false;
            return result;
        }

        [Authorize]
        [HttpPost("refresh-token")]
        public async Task<ActionResult<TokenResponseDto>> RefreshToken(RefreshTokenRequestDto request)
        {
            var result = await authService.RefreshTokensAsync(request);
            if (result is null || result.AccessToken is null || result.RefreshToken is null)
                return Unauthorized("Invalid refresh token.");

            return Ok(result);
        }
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null)
                return Unauthorized();

            var result = await authService.LogoutAsync(Guid.Parse(userId));
            if (!result)
                return BadRequest("Logout failed.");

            return Ok("Logout successful.");
        }

        [HttpGet("leader-board")]
        public async Task<ActionResult<List<Progress>>> GetLeaderBoard()
        {
            List<LeaderBoardDto> LeaderBoard = await authService.GetLeaderBoardAsync();
            if (LeaderBoard is null)
                return StatusCode(500, "An error occurred whith creating progres");
            return Ok(LeaderBoard);
        }

        [Authorize]
        [HttpPost("upload-profile-picture")]
        public async Task<IActionResult> UploadProfilePicture(IFormFile file)
        {
            if (file is null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null)
                return Unauthorized();

            var result = await authService.UploadProfilePictureAsync(Guid.Parse(userId), file);
            if (!result)
                return BadRequest("Failed to upload profile picture.");

            return Ok("Profile picture uploaded successfully.");
        }
        [Authorize]
        [HttpGet("profile-picture/{userId}")]
        public async Task<ActionResult<ProfilePictureDto>> GetProfilePicture(Guid userId)
        {
            ProfilePictureDto? result = await authService.GetProfilePictureAsync(userId);
            if (result is null)
                return NotFound("Profile picture not found.");
                
            return Ok(result);
        }
    }

   
}