using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using NewToDoApi;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors(options =>
{
    options.AddPolicy("OpenPolicy",
                          policy =>
                          {
                              policy.WithOrigins("https://practycode1.onrender.com")
                                                  .AllowAnyHeader()
                                                  .AllowAnyMethod();
                          });
});

// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowOrigin",
//         builder => builder.WithOrigins("https://practycode1.onrender.com"));
// });

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Todo API", Description = "Keep track of your tasks", Version = "v1" });
});
builder.Services.AddDbContext<ToDoDbContext>();
var app = builder.Build();

app.UseCors("OpenPolicy");
app.UseSwagger();
app.UseSwaggerUI(c =>
{
   c.SwaggerEndpoint("/swagger/v1/swagger.json", "Todo API V1");
});


app.MapGet("/",  () =>"hellow");
app.MapGet("/items", async (ToDoDbContext db) =>
    await db.Items.ToListAsync());

// POST /todoitems
app.MapPost("/todoitems", async (Item Dto, ToDoDbContext Db) =>
{
    // var todoItem = new Item
    // {
    //     IsComplete = Dto.IsComplete,
    //     Name = Dto.Name
    // };

    Db.Items.Add(Dto);
    await Db.SaveChangesAsync();
    return Results.Created($"/todoitems/{Dto.IdItems}",  Dto);
});

app.MapPut("/todoitems/{id}", async (int Id, string name,bool IsComplete, ToDoDbContext Db) =>
{
    var todo = await Db.Items.FindAsync(Id);
     Console.WriteLine("IsComplete",IsComplete);

    if (todo is null) return Results.NotFound();

    todo.Name = name;
    todo.IsComplete = IsComplete;

    await Db.SaveChangesAsync();

    return Results.NoContent();
});



app.MapDelete("/todoitems/{id}", async (int Id, ToDoDbContext Db) =>
{
    if (await Db.Items.FindAsync(Id) is Item todo)
    {
        Db.Items.Remove(todo);
        await Db.SaveChangesAsync();
        return Results.Ok(todo);
    }

    return Results.NotFound();
});


app.MapMethods("/options-or-head", new[] { "OPTIONS", "HEAD" }, 
                          () => "This is an options or head request ");

app.Use(async (context, next) =>
{
    Console.WriteLine($"Incoming request: {context.Request.Method} {context.Request.Path}");
    await next.Invoke();
});


app.Run();