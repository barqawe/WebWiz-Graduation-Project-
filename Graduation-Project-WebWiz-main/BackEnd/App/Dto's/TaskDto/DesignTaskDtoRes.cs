using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Dto_s
{
    public class DesignTaskDtoRes
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public string Programming_Language { get; set; } = string.Empty;
        public List<string> Designs { get; set; } = new();
        public Guid InstructorId { get; set; }
        public bool Status { get; set; }
    }
}
