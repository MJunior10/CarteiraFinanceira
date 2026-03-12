using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaFinanceiro.API.Data;
using SistemaFinanceiro.API.Models;


namespace SistemaFinanceiro.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriaController : ControllerBase
    {
        private readonly AppDbContext _context;
        
        public CategoriaController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Categoria (Retorna todas as categorias)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
        {
            // Retorna uma Lista com as categorias encontradas no banco de forma Assincrona
            return await _context.Categorias.ToListAsync();
        }
        [HttpPost]
        public async Task<ActionResult<Categoria>> PostCategoria(Categoria categoria)
        {
            // adiciona uma nova categoria ao contexto do banco de dados
            // o Await serve para o método ser executado de forma assíncrona, permitindo que o servidor continue respondendo a outras requisições enquanto a operação de adição da categoria é realizada no banco de dados, melhorando a performance e a escalabilidade da aplicação.
            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            // Retorna uma resposta HTTP 201 Created, indicando que a categoria foi criada com sucesso, e inclui a localização da nova categoria no cabeçalho da resposta
            return CreatedAtAction(nameof(GetCategorias), new {id = categoria.Id}, categoria);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoria(int id, Categoria categoria){
            if(id != categoria.Id) return BadRequest("ID da categoria não corresponde ao ID fornecido na URL.");
            _context.Entry(categoria).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoria(int id){ 
            var categoria = await _context.Categorias.FindAsync(id); // Puxa a categoria pelo Id
            if(categoria == null) return NotFound("Categoria não encontrada.");

            var emUso = await _context.Transacoes.AnyAsync(t => categoria.Id == id);
            if(emUso){
                return BadRequest("Categoria em uso, não pode ser excluída.");
            }

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}