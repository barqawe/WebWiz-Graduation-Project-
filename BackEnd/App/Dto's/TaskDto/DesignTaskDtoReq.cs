using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Dto_s
{
    public class DesignTaskDtoReq
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public string Programming_Language { get; set; } = string.Empty;

        [FromForm]
        public IFormFile[] Designs { get; set; } = Array.Empty<IFormFile>();

        // Properties from OptimalTaskSolutionDto
        public string? HTML { get; set; }
        public string? CSS { get; set; }
        public string? JS { get; set; }
        public string? React { get; set; }
    }
}
