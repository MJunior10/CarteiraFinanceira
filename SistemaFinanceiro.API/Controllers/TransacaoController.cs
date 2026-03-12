using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaFinanceiro.API.Data;
using SistemaFinanceiro.API.Models;


namespace SistemaFinanceiro.API.Controllers
{
    // Aqui e onde a gente cria os endpoints da nossa API, e onde a gente faz as operacoes de CRUD (Create, Read, Update, Delete) no banco de dados
    //Define que a rota para acessar esse controller e "api/transacao", o [controller] e substituido pelo nome do controller sem o sufixo "Controller"
    [Route("api/[controller]")]
    [ApiController]
    public class TransacaoController : ControllerBase
    {
        private readonly AppDbContext _context;

        // O construtor do controller, onde a gente injeta o AppDbContext para poder acessar o banco de dados
        public TransacaoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transacao>>> GetTransacoes()
        {
            //Pega os itens da tabela Transacoes do banco de dados e retorna para o cliente em formato de lista
            // o Include(t => t.Categoria) serve para incluir os dados da categoria associada a cada transação, permitindo que o cliente receba as informações completas da transação, incluindo a categoria relacionada, em uma única resposta da API. Isso é útil para evitar múltiplas requisições ao banco de dados para obter as informações da categoria separadamente.
            return await _context.Transacoes.Include(t => t.Categoria).ToListAsync();
        }

        // POST: api/Transacao (Cria uma nova transação)
        [HttpPost]
        public async Task<ActionResult<Transacao>> PostTransacao(Transacao transacao)
        {
            // Adiciona a nova transação ao contexto do banco de dados
            _context.Transacoes.Add(transacao);

            // Salva as mudanças no banco de dados de forma assíncrona
            await _context.SaveChangesAsync();

            // Retorna uma resposta HTTP 201 Created, indicando que a transação foi criada com sucesso, e inclui a localização da nova transação no cabeçalho da resposta
            return CreatedAtAction(nameof(GetTransacoes), new {id = transacao.Id}, transacao);
        }

        // PUT: api/Transacao/{id} (Atualiza uma transação existente)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransacao(int id, Transacao transacao)
        {
            // Prevenção de IDOR (Indirect Object Reference), garantindo que o ID da transação no corpo da requisição seja igual ao ID na URL
            if (id != transacao.Id)
            {
                // retorna Erro 400 Bad Request, indicando que a requisição é inválida devido à discrepância entre os IDs
                return BadRequest("O Id da transação no corpo da requisição deve ser igual ao Id na URL.");
            }

            _context.Entry(transacao).State = EntityState.Modified;

            try
            {
                // tenta salvar as mudanças no banco de dados de forma assíncrona
                await _context.SaveChangesAsync();
            }catch (DbUpdateConcurrencyException)
            {
                // Verifica se a transação existe no banco de dados, usando o método AnyAsync para verificar se existe alguma transação com o ID fornecido
                var transacaoExistente = await _context.Transacoes.AnyAsync(e => e.Id == id);
                if (!transacaoExistente)
                {
                    return NotFound("Transação não encontrada.");
                }
                else
                {
                    // Se a transação existe, mas ocorreu um erro de concorrência ao tentar atualizar, lança a exceção para ser tratada por um middleware de tratamento de erros global
                    throw;
                }
            }
            // retorna uma resposta HTTP 204 No Content, indicando que a transação foi atualizada com sucesso e que não há conteúdo para retornar na resposta
            return NoContent();
        }

        // DELETE: api/Transacao/{id} (Exclui uma transação existente)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransacao(int id)
        {
            // procura a transação no banco de dados usando o método FindAsync, que retorna a transação com o ID fornecido ou null se não for encontrada
            var transacao = await _context.Transacoes.FindAsync(id);

            if (transacao == null)
            {
                // Se a transação não for encontrada, retorna uma resposta HTTP 404 Not Found, indicando que a transação com o ID fornecido não existe
                return NotFound("Transação não encontrada.");
            }

            // Se a transação for encontrada, remove a transação do contexto do banco de dados e salva as mudanças de forma assíncrona
            _context.Transacoes.Remove(transacao);
            await _context.SaveChangesAsync();

            // retorna uma resposta HTTP 204 No Content, indicando que a transação foi excluída com sucesso e que não há conteúdo para retornar na resposta
            return NoContent();

        }

    }
}