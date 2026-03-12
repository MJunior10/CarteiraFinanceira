import { useState } from "react";
import Modal from "./Modal";

export default function FormularioCategoria({ categorias = [], aoSalvar }) {

    const [nome, setNome] = useState("");
    const [cor, setCor] = useState("#000000");
    const [categoriaEmEdicao, setCategoriaEmEdicao] = useState(null)

    const [categoriasParaDeletar, setCategoriasParaDeletar] = useState(null)
    const [selecionados, setSelecionados] = useState([])
    const [mensagemErro, setMensagemDeErro] = useState(null)

    const salvarCategoria = (evento) => { 
      
        evento.preventDefault()

          const payload = {nome, cor}
          if (categoriaEmEdicao) payload.id = categoriaEmEdicao.id

          const url = categoriaEmEdicao ? `http://localhost:5191/api/Categoria/${categoriaEmEdicao.id}` : "http://localhost:5191/api/Categoria"
          const metodoHttp = categoriaEmEdicao ? "PUT" : "POST"
          fetch(url, {
              method: metodoHttp,
              headers:{
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(payload)
          }).then(resposta => {
              if (resposta.ok){
              setNome("");
              setCor("#000000");
              setCategoriaEmEdicao(null)
              aoSalvar();
              }
          })

         }
        const confirmarDelecao = async () => {
          let errosOcorridos = []; // Guarda os erros caso alguma categoria esteja em uso

          await Promise.all(
            categoriasParaDeletar.map(async (cat) => {
              const res = await fetch(`http://localhost:5191/api/Categoria/${cat.id}`, { method: 'DELETE' })
              if (!res.ok) {
                const erroMsg = await res.text()
                // Se falhar, guardamos a mensagem com o nome da categoria
                errosOcorridos.push(`A categoria "${cat.nome}" não pôde ser apagada: ${erroMsg}`)
              }
            })
          )

          setCategoriasParaDeletar(null)
          setSelecionados([]) // Limpa as caixas de seleção
          aoSalvar() // Atualiza a lista com as que foram apagadas com sucesso

          // Se houver algum erro, mostramos o modal vermelho compilado!
          if (errosOcorridos.length > 0) {
            setMensagemErro(errosOcorridos.join('\n\n'))
          }
        }
        const alternarSelecao = (id) => {
          if (selecionados.includes(id)) {
            setSelecionados(selecionados.filter(item => item !== id))
          } else {
            setSelecionados([...selecionados, id])
          }
        }

        const selecionarTudo = () => {
          if (selecionados.length === categorias.length) {
            setSelecionados([])
          } else {
            setSelecionados(categorias.map(c => c.id))
          }
        }

  const abrirModalDelecaoEmMassa = () => {
    const itens = categorias.filter(c => selecionados.includes(c.id))
    setCategoriasParaDeletar(itens)
  }
        const iniciarEdicao = (categoria) => {
          setCategoriaEmEdicao(categoria)
          setNome(categoria.nome)
          setCor(categoria.cor)
        }
        const cancelarEdicao = () => {
          setCategoriaEmEdicao(null)
          setNome("")
          setCor("#000000")
        }
    
 return (
    <div>
      {/* 1. Formulário de Criação/Edição */}
      <div style={{ backgroundColor: categoriaEmEdicao ? '#fff3cd' : '#F3F4F6', padding: '15px', borderRadius: '12px', marginBottom: '25px', border: categoriaEmEdicao ? '1px solid #ffeeba' : 'none', transition: 'all 0.3s' }}>
        <h4 style={{ margin: '0 0 15px 0', color: categoriaEmEdicao ? '#856404' : '#374151' }}>
          {categoriaEmEdicao ? '✏️ A Editar Categoria' : 'Criar Nova Categoria'}
        </h4>
        
        <form onSubmit={salvarCategoria} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input type="text" placeholder="Nome (ex: Lazer)" required value={nome} onChange={(e) => setNome(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }} />
          <input type="color" value={cor} onChange={(e) => setCor(e.target.value)} style={{ width: '40px', height: '40px', padding: '0', border: 'none', cursor: 'pointer', borderRadius: '8px' }} title="Escolha a cor" />
          
          <button type="submit" style={{ padding: '10px 15px', backgroundColor: categoriaEmEdicao ? '#28a745' : '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            {categoriaEmEdicao ? 'Salvar' : 'Criar'}
          </button>
          
          {categoriaEmEdicao && (
            <button type="button" onClick={cancelarEdicao} style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              ✕
            </button>
          )}
        </form>
      </div>

      {/* NOVIDADE 4: Cabeçalho da Lista com Selecionar Tudo e Botão Vermelho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {categorias.length > 0 && (
            <input 
              type="checkbox" 
              checked={selecionados.length === categorias.length && categorias.length > 0} 
              onChange={selecionarTudo}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              title="Selecionar Tudo"
            />
          )}
          <h4 style={{ margin: 0, color: '#374151' }}>Categorias Registadas</h4>
        </div>

        {selecionados.length > 0 && (
          <button 
            onClick={abrirModalDelecaoEmMassa}
            style={{ backgroundColor: '#EF4444', color: 'white', padding: '6px 12px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}
          >
            🗑️ Apagar ({selecionados.length})
          </button>
        )}
      </div>
      
      {categorias.length === 0 ? (
        <p style={{ color: '#9CA3AF', fontSize: '14px', textAlign: 'center' }}>Nenhuma categoria registada.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '200px', overflowY: 'auto' }}>
          {categorias.map(cat => (
            <li key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #F3F4F6', backgroundColor: selecionados.includes(cat.id) ? '#EFF6FF' : 'transparent' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <input 
                  type="checkbox" 
                  checked={selecionados.includes(cat.id)} 
                  onChange={() => alternarSelecao(cat.id)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <div style={{ width: '15px', height: '15px', backgroundColor: cat.cor, borderRadius: '50%' }}></div>
                <span style={{ fontWeight: '500', color: '#1F2937' }}>{cat.nome}</span>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => iniciarEdicao(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', opacity: 0.7 }} title="Editar">✏️</button>
                <button onClick={() => setCategoriasParaDeletar([cat])} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', opacity: 0.7 }} title="Apagar">🗑️</button>
              </div>

            </li>
          ))}
        </ul>
      )}

      {/* Modal Inteligente de Confirmação */}
      <Modal isOpen={!!categoriasParaDeletar} onClose={() => setCategoriasParaDeletar(null)} titulo="⚠️ Atenção">
        {categoriasParaDeletar?.length === 1 ? (
          <p style={{ color: '#374151' }}>Tem a certeza que deseja apagar a categoria <strong>{categoriasParaDeletar[0].nome}</strong>?</p>
        ) : (
          <p style={{ color: '#374151' }}>Tem a certeza que deseja apagar as <strong>{categoriasParaDeletar?.length} categorias selecionadas</strong>?</p>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
          <button onClick={() => setCategoriasParaDeletar(null)} style={{ flex: 1, padding: '12px', backgroundColor: '#F3F4F6', color: '#4B5563', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>Cancelar</button>
          <button onClick={confirmarDelecao} style={{ flex: 1, padding: '12px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Sim, Apagar</button>
        </div>
      </Modal>

      {/* Modal de Erro Avançado (Suporta múltiplas mensagens) */}
      <Modal isOpen={!!mensagemErro} onClose={() => setMensagemErro(null)} titulo="❌ Não foi possível apagar">
        <div style={{ color: '#374151', lineHeight: '1.5', maxHeight: '150px', overflowY: 'auto', whiteSpace: 'pre-line' }}>
          {mensagemErro}
        </div>
        <div style={{ marginTop: '25px' }}>
          <button onClick={() => setMensagemErro(null)} style={{ width: '100%', padding: '12px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
            Entendido
          </button>
        </div>
      </Modal>

    </div>
  )
}