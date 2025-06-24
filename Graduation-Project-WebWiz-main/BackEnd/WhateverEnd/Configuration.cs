using Domain.Entities;
using Infrastructure.DataHandler;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using WhateverEnd.Middlewares;

namespace WhateverEnd;

public static class Configuration
{
    public static WebApplicationBuilder RegisterServices(this WebApplicationBuilder builder)
    {
        builder.Services.Configure<AppSettings>(
            builder.Configuration.GetSection("AppSettings"));

        builder.Services.Configure<GithubAuthSettings>(
            builder.Configuration.GetSection("Authentication:GitHub"));

        builder.Services.Configure<GoogleAuthSettings>(
            builder.Configuration.GetSection("Authentication:Google"));

        builder.Services.Configure<ExternalApiSettings>(
            builder.Configuration.GetSection("ExternalApi"));

        builder.Services.Configure<EmailSettings>
            (builder.Configuration.GetSection("SmtpSettings"));

        builder.Services.Configure<CloudinarySettings>
            (builder.Configuration.GetSection("CloudinarySettings"));



        builder.Services.AddDbContext<AppDbContext>(options =>
        {
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
        });
        builder.Services.AddAppServices();
        builder.Services.AddAuthenticationServices(builder.Configuration);

        return builder;
    }

    public static WebApplication RegisterMiddlewares(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.MapScalarApiReference();
        }

        app.UseStaticFiles();

        app.UseCors(policy =>
              policy.WithOrigins("http://localhost:3000")
                    .AllowAnyHeader()
                    .AllowAnyMethod()); 
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();
        app.UseMiddleware<ErrorHandlerMiddleware>();

        return app;
    }
}
