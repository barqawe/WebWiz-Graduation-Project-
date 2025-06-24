using Domain.Entities;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using MimeKit;

namespace WhateverEnd.Helper;

public class EmailSender : IEmailSender
{
    private readonly EmailSettings _emailSettings;
    private readonly ILogger<EmailSender> _logger;

    public EmailSender(
        IOptions<EmailSettings> emailSettings,
        ILogger<EmailSender> logger)
    {
        _emailSettings = emailSettings.Value;
        _logger = logger;
    }

    public async Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(
            _emailSettings.SenderName,
            _emailSettings.SenderEmail));
        message.To.Add(MailboxAddress.Parse(email));
        message.Subject = subject;

        var builder = new BodyBuilder { HtmlBody = htmlMessage };
        message.Body = builder.ToMessageBody();
        
        using var client = new SmtpClient();

        try
        {
            await client.ConnectAsync(
                _emailSettings.Server,
                _emailSettings.Port,
                SecureSocketOptions.SslOnConnect);

            await client.AuthenticateAsync(
                _emailSettings.SenderEmail,
                _emailSettings.Password);

            await client.SendAsync(message);
            _logger.LogInformation("Email sent to {Email}", email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending email to {Email}", email);
            throw;
        }
        finally
        {
            await client.DisconnectAsync(true);
        }
    }
}