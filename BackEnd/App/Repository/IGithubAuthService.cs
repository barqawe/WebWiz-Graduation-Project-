using App.Dto_s;
using App.Dto_s.LearnerAuthDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Repository
{
    public interface IGithubAuthService
    {
        Task<ExternalUserDto> VerifyCodeAsync(string code);

    }
}