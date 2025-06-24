using App.Mapper;
using App.Repository;
using App.Service;
using Application.MappingProfiles;
using Domain.Entities;
using Infrastructure.ExternalServices;
using Infrastructure.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WhateverEnd.Helper;

namespace WhateverEnd
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services)
        {
            services.AddControllers();
            services.AddOpenApi();
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IProgressRepository, ProgressRepositry>();
            services.AddHttpClient<IExternalApiService, ExternalApiService>();
            services.AddTransient<IExternalApiService, ExternalApiService>();
            services.AddScoped<ProgressService>();
            services.AddScoped<TokenService>();
            services.AddScoped<AuthService>();
            services.AddScoped<GoogleAuthService>();
            services.AddScoped<IDesignTaskRepository, DesignTaskRepository>();
            services.AddScoped<DesignTaskService>();
            services.AddScoped<IPasswordHasher<Learner>, PasswordHasher<Learner>>();
            services.AddAutoMapper(typeof(Learner).Assembly);
            services.AddAutoMapper(typeof(LearnerProfile).Assembly);
            services.AddAutoMapper(typeof(RoadmapProfile).Assembly);
            services.AddAutoMapper(typeof(ProgressProfile).Assembly);
            services.AddLogging();
            services.AddScoped<IGoogleAuthService, GoogleAuthService>();
            services.AddScoped<IGithubAuthService, GithubAuthService>();
            services.AddTransient<IEmailSender, EmailSender>();
            services.AddScoped<IDesignStorageService, CloudinaryDesignStorageService>();
            services.AddScoped<CloudinaryDesignStorageService>();
            services.AddScoped<IRoadmapRepository, RoadmapRepository>();
            services.AddScoped<RoadmapService>();
            services.AddScoped<IOptimalTaskSolutionRepository, OptimalTaskSolutionRepository>();
            services.AddScoped<OptimalTaskSolutionService>();

            return services;
        }
        public static IServiceCollection AddAuthenticationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = configuration["AppSettings:Issuer"],
                        ValidateAudience = true,
                        ValidAudience = configuration["AppSettings:Audience"],
                        ValidateLifetime = true,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(configuration["AppSettings:Token"]!)),
                        ValidateIssuerSigningKey = true
                    };
                });

            var googleSettings = configuration
                .GetSection("Authentication:Google")
                .Get<GithubAuthSettings>();

            services.AddAuthentication()
                .AddGoogle(options =>
                {
                    options.ClientId = googleSettings?.ClientId ?? throw new InvalidOperationException("Missing Google ClientId");
                    options.ClientSecret = googleSettings?.ClientSecret ?? throw new InvalidOperationException("Missing Google ClientSecret");
                });

            // Add CORS policy
            services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", builder =>
                {
                    builder.WithOrigins("http://localhost:3000")
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                           .AllowCredentials();
                });
            });

            return services;
        }
    }
}
