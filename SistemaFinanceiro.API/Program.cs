using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using SistemaFinanceiro.API.Data;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Configurando a string de conexao do banco de dados, a string de conexao e configurada no appsettings.json e injetada aqui atraves do construtor
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Configurando o Entity Framework Core para usar o PostgreSQL, e injetando o AppDbContext no container de servicos
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseNpgsql(connectionString));

builder.Services.AddControllers().AddJsonOptions(options =>
{
    // Avisa o serializador JSON para ignorar ciclos de referência, ou seja, quando um objeto referencia outro objeto que, por sua vez, referencia o primeiro objeto, evitando assim erros de serialização e problemas de desempenho causados por referências circulares.
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

// Configurando o CORS para permitir requisições do aplicativo React, permitindo qualquer cabeçalho e método HTTP.
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirReact", Policy =>
    {
        Policy.WithOrigins("http://localhost:5173") // Substitua pelo URL do seu aplicativo React
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();




// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); // Nova interface para acessar a documentação da API a partir do endpoint /scalar-api-reference do .NET 9
}

//app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");


app.UseCors("PermitirReact"); // Aplicando a política de CORS configurada anteriormente
app.UseAuthorization();

app.MapControllers();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
