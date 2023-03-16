using System;
using System.Collections.Generic;

namespace NewToDoApi;

public partial class Item
{


    public int IdItems { get; set; }

    public string? Name { get; set; }

    public bool? IsComplete { get; set; }
}
