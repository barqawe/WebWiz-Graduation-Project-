using Domain.Entities;
using Infrastructure.DataHandler;
using Microsoft.EntityFrameworkCore;
using WhateverEnd;

var builder = WebApplication.CreateBuilder(args);

builder.RegisterServices();

var app = builder.Build();

app.RegisterMiddlewares();



app.Run();