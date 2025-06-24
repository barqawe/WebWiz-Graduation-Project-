using System.Net;
using System.Text.Json;
using Domain.Exceptions;

namespace WhateverEnd.Middlewares
{
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlerMiddleware> _logger;

        public ErrorHandlerMiddleware(RequestDelegate next, ILogger<ErrorHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred: {Message}", ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var response = context.Response;
            response.ContentType = "application/json";

            var (statusCode, message) = exception switch
            {
                DbConnectionErrors => (
                    HttpStatusCode.ServiceUnavailable,
                    "Database connection error occurred."
                ),
                UnauthorizedAccessException => (
                    HttpStatusCode.Unauthorized,
                    "You are not authorized to perform this action."
                ),
                ArgumentException => (HttpStatusCode.BadRequest, exception.Message),
                KeyNotFoundException => (HttpStatusCode.NotFound, exception.Message),
                _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred."),
            };

            response.StatusCode = (int)statusCode;

            var errorResponse = new
            {
                StatusCode = response.StatusCode,
                Message = message,
                Details = exception.Message,
                Timestamp = DateTime.UtcNow,
            };

            var jsonResponse = JsonSerializer.Serialize(
                errorResponse,
                new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }
            );

            return response.WriteAsync(jsonResponse);
        }
    }
}
