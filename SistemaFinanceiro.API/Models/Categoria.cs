using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace SistemaFinanceiro.API.Models
{
    public class Categoria
    {
        public int Id {get ; set;}

        [Required(ErrorMessage = "O nome da categoria é obrigatório.")] // A anotação [Required] é usada para indicar que a propriedade Nome é obrigatória.
        [MaxLength(50, ErrorMessage = "O Nome da categoria não pode exceder 50 caracteres.")]
        public string Nome { get; set; } = string.Empty;

        // Cor utilizada futuramente na interface do usuário para representar visualmente a categoria, por exemplo, em gráficos ou listas de transações. O valor padrão é preto ("#000000"), mas pode ser personalizado para cada categoria.
        [Required(ErrorMessage = "A cor da categoria é obrigatória.")]
        [RegularExpression("^#([0-9A-Fa-f]{6})$", ErrorMessage = "A cor deve estar no formato hexadecimal, por exemplo, #FF5733.")]
        public string Cor { get; set; } = "#000000";

        //Propriedade de navegação para a lista de transações associadas a essa categoria, permitindo que o Entity Framework Core estabeleça um relacionamento entre as entidades Categoria e Transacao. Isso facilita a consulta e manipulação dos dados relacionados, como obter todas as transações pertencentes a uma categoria específica.
        [JsonIgnore] // A anotação [JsonIgnore] é usada para evitar que a propriedade Transacoes seja incluída na serialização JSON, prevenindo assim problemas de referência circular e melhorando o desempenho da API ao retornar os dados da categoria sem as transações associadas.
        public List<Transacao> Transacoes { get; set; } = new();
    }
}