using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Dto_s
{
   public class ProgressDtoReq
    {
        public bool Status { get; set; } = false;

        public Guid LearnerId { get; set; }

        public Guid DesignTaskId { get; set; }
    }
}
