import { useState, useEffect } from "react";
import Modal from './Modal'

export default function FormularioTransacao({ categorias, aoSalvar, transacaoEmEdicao, aoCancelar }) {
    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");
    const [tipo, setTipo] = useState(0);
    const [categoriaId, setCategoriaId] = useState("");
    const [dataTransacao, setDataTransacao] = useState(new Date().toISOString().split('T'[0]))
    const [mensagemErro, setMensagemErro] = useState(null)

    useEffect(() => {
      if(transacaoEmEdicao){
        setDescricao(transacaoEmEdicao.descricao);
        setValor(transacaoEmEdicao.valor);
        setTipo(transacaoEmEdicao.tipo);
        setCategoriaId(transacaoEmEdicao.categoriaId);
        setDataTransacao(transacaoEmEdicao.data.substring(0, 10)); // Ajusta a data para o formato YYYY-MM-DD
      }else{
        setDescricao("");
        setValor("");
        setTipo(0);
        setCategoriaId(categorias.length > 0 ? categorias[0].id : '')
        setDataTransacao(new Date().toISOString().split('T')[0])
      }}, [transacaoEmEdicao, categorias])

    const salvarTransacao = (evento) => 
        { evento.preventDefault(); // Evita que a página seja recarregada ao enviar o formulário
          
          const idCatFinal = categoriaId ? categoriaId : (categorias.length > 0 ? categorias[0].id : " "); 

          if (!idCatFinal){
                setMensagemErro("Por favor, crie uma Categoria primeiro antes de registar uma transação!")
                return
            }

            const payload = {
                descricao,
                 // Convertendo o valor para número, considerando que o usuário pode usar vírgula como separador decimal
                valor: parseFloat(valor.toString().replace(",", ".")),
                tipo: parseInt(tipo), // Convertendo o tipo para número
                categoriaId: parseInt(idCatFinal), // Convertendo a categoriaId para número
                data: dataTransacao  + 'T12:00:00Z'// Incluindo a data da transação no payload
            }
            if (transacaoEmEdicao){
              payload.id = transacaoEmEdicao.id; // Incluindo o ID da transação no payload para que o backend saiba que é uma edição
              payload.data = transacaoEmEdicao.data; // Mantendo a data original da transação ao editar
            }

            const url = transacaoEmEdicao ? `http://localhost:5191/api/Transacao/${transacaoEmEdicao.id}`
             : "http://localhost:5191/api/Transacao"

             const methodHttp = transacaoEmEdicao ? "PUT" : "POST"

            fetch(url, {
                method: methodHttp,
                headers:{
                    "Content-Type": "application/json" // Informando que o corpo da requisição é um JSON
                },
                body: JSON.stringify(payload) // Convertendo o objeto novaTransacao para uma string JSON para enviar ao backend
            })
            .then(async resposta => {
                if(resposta.ok){
                    // Se a resposta for OK limpa o formulário e chama a função de callback para atualizar a lista de transações
                    setDescricao("")
                    setValor("")
                    setDataTransacao(new Date().toISOString().split('T')[0])
                    aoSalvar()
                } else{
                    const erroBackend = await resposta.text()
                    setMensagemErro("Erro ao salvar transação, Verifique os dados incluidos"); // Se não for OK, mostra um alerta de erro
                }

            })
          }
    return (
      <div>
        <div style={{ backgroundColor: transacaoEmEdicao ? '#fff3cd' : '#f4f4f4', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: transacaoEmEdicao ? '1px solid #ffeeba' : 'none' }}>
          <h3 style={{ marginTop: 0, color: transacaoEmEdicao ? '#856404' : '#000' }}>
            {transacaoEmEdicao ? '✏️ Editando Transação' : 'Nova Transação'}
          </h3>
          
          <form onSubmit={salvarTransacao} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Descrição" required value={descricao} onChange={(e) => setDescricao(e.target.value)} style={{ padding: '8px' }} />
            <input type="number" step="0.01" placeholder="Valor" required value={valor} onChange={(e) => setValor(e.target.value)} style={{ padding: '8px' }} />
            
            {/* NOVIDADE 3: O campo nativo de calendário para escolher o dia exato! */}
            <input type="date" required value={dataTransacao} onChange={(e) => setDataTransacao(e.target.value)} style={{ padding: '8px' }} title="Data da Transação" />
            
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ padding: '8px' }}>
              <option value={0}>Despesa</option>
              <option value={1}>Receita</option>
            </select>
            
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} style={{ padding: '8px' }}>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: transacaoEmEdicao ? '#28a745' : '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                {transacaoEmEdicao ? 'Salvar Alterações' : 'Salvar'}
              </button>
              {transacaoEmEdicao && (
                <button type="button" onClick={aoCancelar} style={{ flex: 1, padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <Modal isOpen={!!mensagemErro} onClose={() => setMensagemErro(null)} titulo="❌ Atenção">
            <div style={{ color: '#374151', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
              {mensagemErro}
            </div>
            <div style={{ marginTop: '25px' }}>
              <button onClick={() => setMensagemErro(null)} style={{ width: '100%', padding: '12px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                Entendido
              </button>
            </div>
          </Modal>
      </div>
  )
}
