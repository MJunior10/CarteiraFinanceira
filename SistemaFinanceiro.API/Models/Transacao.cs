using System.ComponentModel.DataAnnotations;

namespace SistemaFinanceiro.API.Models
{
    public enum TipoTransacao
    {
        Receita = 0,
        Despesa = 1,
        Transferencia = 2
    }
    public class Transacao
    {
        public int Id{get;set;}
        [Required(ErrorMessage = "A descrição da transação é obrigatória.")] // A anotação [Required] é usada para indicar que a propriedade Descricao é obrigatória.
        [MaxLength(100, ErrorMessage = "A descrição da transação não pode exceder 100 caracteres.")] // A anotação [MaxLength] é usada para limitar o comprimento da string Descricao a no máximo 100 caracteres, garantindo que as descrições das transações sejam concisas e evitando problemas de armazenamento ou exibição de dados muito longos.
        public string Descricao { get; set; } = string.Empty;

        [Required(ErrorMessage = "O valor da transação é obrigatório.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor da transação deve ser maior que zero.")] // A anotação [Range] é usada para garantir que o valor da transação seja um número positivo, evitando assim a entrada de valores inválidos ou negativos que não fazem sentido no contexto financeiro.
        public decimal Valor { get; set; }
        
        // A propriedade Data é usada para armazenar a data e hora em que a transação ocorreu. O valor padrão é definido como DateTime.UtcNow, o que significa que, se nenhuma data for fornecida ao criar uma nova transação, ela será automaticamente definida para a data e hora atual em formato UTC (Tempo Universal Coordenado). Isso é útil para garantir que todas as transações tenham uma data associada, mesmo que o usuário não forneça uma, e também ajuda a evitar problemas de fuso horário ao lidar com transações em diferentes regiões.
        public DateTime Data { get; set; } = DateTime.UtcNow;

        [Required(ErrorMessage = "O tipo da Transação é obrigatório.")]
        public TipoTransacao Tipo { get; set; }
        // Chave estrangeira para a categoria da transação, permitindo que cada transação seja associada a uma categoria específica, como "Alimentação", "Transporte", "Lazer", etc.
        public int CategoriaId {get; set;}
        // Propriedade de navegação para a categoria associada a essa transação, permitindo que o Entity Framework Core estabeleça um relacionamento
        // O ? indica que a categoria pode ser nula (ou seja, uma transação pode não ter uma categoria associada), o que é útil para casos em que a categoria é opcional ou ainda não foi definida.
        public Categoria? Categoria { get; set; }
    }
}