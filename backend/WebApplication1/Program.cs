var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}


app.MapGet("/", () =>
{

    return "skibidi skibidi hawk tuah hawk";
})

.WithName("basicresponse");
app.UseAuthorization();
app.UseHttpsRedirection();
app.MapControllers();
app.Run();
