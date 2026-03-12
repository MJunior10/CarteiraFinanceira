using Microsoft.EntityFrameworkCore;
using SistemaFinanceiro.API.Models;


namespace SistemaFinanceiro.API.Data
{
    public class AppDbContext : DbContext
    {
        // Aqui e onde a gente configura o banco de dados, a string de conexao e configurada no appsettings.json e injetada aqui atraves do construtor
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            
        }

        //Essa Linha e a que cria a tabela no banco de dados, o nome da tabela e o nome da classe
        public DbSet<Transacao> Transacoes { get; set; }

        public DbSet<Categoria> Categorias { get; set; }
    }
}