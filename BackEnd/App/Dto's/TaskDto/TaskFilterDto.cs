using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Dto_s
{
    public class TaskFilterDto
    {
        public string? Level { get; set; }
        public string? Programming_Language { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 12;
    }
}
