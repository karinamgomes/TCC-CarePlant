using Historico.Api.Application.Infra.IOC;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddRazorPages();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();
//builder.Services.AddSwaggerGen(options =>
//{
//    // using System.Reflection;
//    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
//    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
//});
builder.Services.ConfigureAutoMapper();
builder.Services.ConfigureDependencies(builder.Configuration);
builder.Services.TableStorageBase(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

//app.UseSwagger();

//app.UseSwaggerUI(c =>
//{
//    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
//    c.RoutePrefix = string.Empty;
//});

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();
app.MapControllers();
app.MapRazorPages();

app.Run();
