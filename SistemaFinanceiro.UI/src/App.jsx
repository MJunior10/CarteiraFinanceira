import { useState, useEffect } from 'react'
import  FormularioTransacao  from './components/FormularioTransacao'
import  FormularioCategoria  from './components/FormularioCategoria'
import  Dashboard  from './components/Dashboard'
import Modal from './components/Modal'
import './App.css'

const nomesDosMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

function App() {
  const [transacoes, setTransacoes] = useState([])
  const [categorias, setCategorias] = useState([])
  const [transacaoEmEdicao, setTransacaoEmEdicao] = useState(null) // Estado para armazenar a transação que está sendo editada
  //const [transacaoParaDeletar, setTransacaoParaDeletar] = useState(null) primeira forma de deletar
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false)
  const [tipoCadastro, setTipoCadastro] = useState(null) // transacao ou categoria

  const dataHoje = new Date()
  const mesAtualFormatado = `${dataHoje.getFullYear()}-${String(dataHoje.getMonth() + 1).padStart(2, '0')}` 
  const [mesFiltro, setMesFiltro] = useState(mesAtualFormatado) 

  const [itensParaDeletar, setItensParaDeletar] = useState(null)
  const [selecionados, setSelecionados] = useState([])

  // Isolamos a busca em uma função separada para podermos chamá-la a qualquer momento
  const carregarDados = () => {
    fetch('http://localhost:5191/api/Transacao')
      .then(res => res.json())
      .then(dados => setTransacoes(dados))

      fetch('http://localhost:5191/api/Categoria')
      .then(res => res.json())
      .then(dados => setCategorias(dados))

  }

  // Carrega a lista quando a tela abre pela primeira vez
  useEffect(() => {
    carregarDados()
  }, [])

const confirmarDelecao = async () => {
    // O Promise.all dispara todos os comandos de DELETE simultaneamente!
    await Promise.all(
      itensParaDeletar.map(item => 
        fetch(`http://localhost:5191/api/Transacao/${item.id}`, { method: 'DELETE' })
      )
    )
    
    carregarDados() // Recarrega a lista
    setItensParaDeletar(null) // Fecha o modal
    setSelecionados([]) // Limpa as caixinhas de seleção
  }

  const alternarSelecao = (id) => {
    if (selecionados.includes(id)) {
      setSelecionados(selecionados.filter(item => item !== id)) // Desmarca
    } else {
      setSelecionados([...selecionados, id]) // Marca
    }
  }

  const selecionarTudo = () => {
    if (selecionados.length === transacoesFiltradas.length) {
      setSelecionados([]) // Se todos já estão marcados, desmarca tudo
    } else {
      setSelecionados(transacoesFiltradas.map(t => t.id)) // Marca todos os IDs da tela
    }
  }
  const abrirModalDelecaoEmMassa = () => {
    const itens = transacoesFiltradas.filter(t => selecionados.includes(t.id))
    setItensParaDeletar(itens)
  }
  
  // Filtra as transações para mostrar apenas as do mês e ano selecionados
 const transacoesFiltradas = transacoes.filter(t => t.data.substring(0, 7) === mesFiltro)
  const tituloMes = mesFiltro.split('-').reverse().join('/') // Converte "2024-06" para "06/2024"

  return (
    <div className="tela-principal">
      <div className="container-maximo">
        
        <header className="cabecalho">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <label style={{ color: '#6B7280', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Período</label>
            <input type="month" value={mesFiltro} onChange={(e) => { setMesFiltro(e.target.value); setSelecionados([]); }} style={{ backgroundColor: '#fff', border: 'none', padding: '12px 16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', color: '#1F2937', fontWeight: '600', outline: 'none', cursor: 'pointer', maxWidth: '200px' }} />
          </div>

          <div className="cabecalho-acoes">
            <h1 style={{ margin: 0, fontSize: '32px', color: '#1F2937', fontWeight: '800', letterSpacing: '-1px' }}>Carteira</h1>
            <button onClick={() => { setTipoCadastro(null); setModalCadastroAberto(true); }} className="btn-cadastrar">
             Cadastrar
            </button>
          </div>
        </header>

        <Dashboard transacoes={transacoesFiltradas} />

        <div className="lista-container">
          
          {/* NOVIDADE 5: O Cabeçalho da Lista agora tem o "Selecionar Tudo" e o botão "Apagar Vários" */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #E5E7EB', paddingBottom: '10px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {transacoesFiltradas.length > 0 && (
                <input 
                  type="checkbox" 
                  checked={selecionados.length === transacoesFiltradas.length && transacoesFiltradas.length > 0} 
                  onChange={selecionarTudo}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  title="Selecionar Tudo"
                />
              )}
              <h2 style={{ fontSize: '20px', color: '#374151', margin: 0 }}>
                Extrato de {tituloMes}
              </h2>
            </div>

            {/* Este botão vermelho SÓ APARECE se tiver alguém selecionado */}
            {selecionados.length > 0 && (
              <button 
                onClick={abrirModalDelecaoEmMassa}
                style={{ backgroundColor: '#EF4444', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                🗑️ Apagar ({selecionados.length})
              </button>
            )}

          </div>
          
          {transacoesFiltradas.length === 0 ? (
            <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <p style={{ color: '#9CA3AF', margin: 0, fontSize: '16px' }}>Nenhuma movimentação neste período.</p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {transacoesFiltradas.map(transacao => (
                <li key={transacao.id} className="transacao-item" style={{ borderLeft: selecionados.includes(transacao.id) ? '4px solid #3B82F6' : '4px solid transparent', backgroundColor: selecionados.includes(transacao.id) ? '#EFF6FF' : '#fff' }}>
                  
                  <div className="transacao-info" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '15px' }}>
                    
                    {/* NOVIDADE 6: A Caixinha de Seleção de cada item */}
                    <input 
                      type="checkbox" 
                      checked={selecionados.includes(transacao.id)} 
                      onChange={() => alternarSelecao(transacao.id)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />

                    <div>
                      <strong style={{ fontSize: '16px', color: '#1F2937' }}>{transacao.descricao}</strong> <br/>
                      <span style={{ fontSize: '13px', color: '#9CA3AF' }}>{new Date(transacao.data).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  
                  <div className="transacao-acoes">
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: transacao.tipo === 1 ? '#10B981' : '#EF4444', fontWeight: 'bold', fontSize: '16px' }}>
                        {transacao.tipo === 1 ? '+' : '-'} R$ {transacao.valor.toFixed(2)}
                      </span>
                      <br/>
                      {transacao.categoria && (
                        <span style={{ backgroundColor: transacao.categoria.cor, color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', display: 'inline-block', marginTop: '4px' }}>
                          {transacao.categoria.nome}
                        </span>
                      )}
                    </div>
                    
                    <div className="botoes-editar-apagar">
                      <button onClick={() => setTransacaoEmEdicao(transacao)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', opacity: 0.7 }}>✏️</button>
                      
                      {/* Ao clicar na lixeira individual, ele seleciona apenas este item e abre o modal */}
                      <button onClick={() => setItensParaDeletar([transacao])} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', opacity: 0.7 }}>🗑️</button>
                    </div>
                  </div>

                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Modal isOpen={modalCadastroAberto} onClose={() => setModalCadastroAberto(false)} titulo={tipoCadastro === 'transacao' ? 'Nova Transação' : tipoCadastro === 'categoria' ? 'Nova Categoria' : 'O que deseja cadastrar?'}>
        {!tipoCadastro && (
          <div className="modal-botoes">
            <button onClick={() => setTipoCadastro('transacao')} style={{ flex: 1, padding: '25px 15px', fontSize: '16px', borderRadius: '16px', cursor: 'pointer', border: 'none', backgroundColor: '#EFF6FF', color: '#3B82F6', fontWeight: 'bold' }}>💸 Transação</button>
            <button onClick={() => setTipoCadastro('categoria')} style={{ flex: 1, padding: '25px 15px', fontSize: '16px', borderRadius: '16px', cursor: 'pointer', border: 'none', backgroundColor: '#F0FDF4', color: '#10B981', fontWeight: 'bold' }}>🏷️ Categoria</button>
          </div>
        )}
        {tipoCadastro === 'transacao' && ( <FormularioTransacao categorias={categorias} aoSalvar={() => { carregarDados(); setModalCadastroAberto(false); }} /> )}
        {tipoCadastro === 'categoria' && ( <FormularioCategoria categorias={categorias} aoSalvar={() => { carregarDados(); setModalCadastroAberto(false); }} /> )}
      </Modal>

      <Modal isOpen={!!transacaoEmEdicao} onClose={() => setTransacaoEmEdicao(null)} titulo="✏️ Editar Transação">
        <FormularioTransacao categorias={categorias} transacaoEmEdicao={transacaoEmEdicao} aoSalvar={() => { carregarDados(); setTransacaoEmEdicao(null); }} aoCancelar={() => setTransacaoEmEdicao(null)} />
      </Modal>

      {/* NOVIDADE 7: O Modal agora é inteligente. Ele sabe se você está apagando 1 ou vários! */}
      <Modal isOpen={!!itensParaDeletar} onClose={() => setItensParaDeletar(null)} titulo="⚠️ Atenção">
        
        {itensParaDeletar?.length === 1 ? (
          <p style={{ color: '#374151' }}>Tem certeza que deseja apagar <strong>{itensParaDeletar[0].descricao}</strong> no valor de R$ {itensParaDeletar[0].valor.toFixed(2)}?</p>
        ) : (
          <p style={{ color: '#374151' }}>Tem certeza que deseja apagar as <strong>{itensParaDeletar?.length} transações selecionadas</strong> de uma só vez?</p>
        )}
        
        <div className="modal-botoes" style={{ marginTop: '25px' }}>
          <button onClick={() => setItensParaDeletar(null)} style={{ flex: 1, padding: '12px', backgroundColor: '#F3F4F6', color: '#4B5563', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>Cancelar</button>
          <button onClick={confirmarDelecao} style={{ flex: 1, padding: '12px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Sim, Apagar {itensParaDeletar?.length > 1 ? 'Tudo' : ''}</button>
        </div>
      </Modal>

    </div>
  )
}
export default App

