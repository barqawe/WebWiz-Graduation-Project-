
using Microsoft.AspNetCore.Http;

namespace App.Dto_s.TaskDto
{
    public class AIEvaluationDtoReq
    {
        public Guid Id { get; set; }
        public string? HTML { get; set; }
        public string? CSS { get; set; }
        public string? JS { get; set; }
        public string? JSX { get; set; }
        public IFormFile? SubmittedImage { get; set; }
    }
}
