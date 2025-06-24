namespace Domain.Exceptions;
public class DbConnectionErrors : Exception
{
    public DbConnectionErrors()
    {
        
    }
    public DbConnectionErrors(string message): base(message)
    {
        
    }
}
