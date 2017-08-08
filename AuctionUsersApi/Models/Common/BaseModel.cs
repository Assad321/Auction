using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Models.Common
{
    public abstract class BaseModel
    {
        [Key]
        public int Id { get; set; }
        public DateTime? DateAdded { get; set; }
        public DateTime? DateModified { get; set; }
        public string AddedBy { get; set; }
        public string ModifiedBy { get; set; }
        public bool IsDeleted { get; set; }
    }
}