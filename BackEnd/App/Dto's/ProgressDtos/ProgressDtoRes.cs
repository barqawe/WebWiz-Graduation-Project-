using App.Dto_s.TaskDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Dto_s
{
   public class ProgressDtoRes
    {
        public int? TotalPoint { get; set; } = 0;
        public int? CompletedTask { get; set; } = 0;
        public List<DesignTaskProgressDto> DesignTasks { get; set; } = null!;
    }
}
