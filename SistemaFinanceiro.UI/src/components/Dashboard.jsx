import {PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer} from 'recharts'
import '../App.css' // Importando o nosso CSS responsivo!


export default function Dashboard({transacoes}) {

    // Preparando os dados para o gráfico de pizza (despesas por categoria)
    // O Reduce é uma função poderosa que transforma um array em um único valor (nesse caso, um objeto onde cada chave é uma categoria e o valor é a soma das despesas daquela categoria)
    const totalReceitas = transacoes.filter(t => t.tipo === 1).reduce((acc, t) => acc + t.valor,0)
    const totalDespesas = transacoes.filter(t => t.tipo === 0).reduce((acc, t) => acc + t.valor,0)
    const saldoFinal = totalReceitas - totalDespesas

    const despesas = transacoes.filter(t => t.tipo === 0)
    const dadosGrafico = []

    despesas.forEach(transacao => {
        const nomeCategoria = transacao.categoria ? transacao.categoria.nome : 'Outros'
        const corCategoria = transacao.categoria ? transacao.categoria.cor : '#888888' // Cinza para categorias sem cor definida
    
        // Procura se a categoria ja esta na lista do grafico
        const categoriaExistente = dadosGrafico.find(d => d.name === nomeCategoria)

        if(categoriaExistente){
            categoriaExistente.value += transacao.valor // Se a categoria já existe, soma o valor da despesa
        }else{
            dadosGrafico.push({name: nomeCategoria, value: transacao.valor, cor: corCategoria}) // Se não existe, cria uma nova entrada no gráfico
        }
    })

return (
    <div className="dashboard-container">
      <div className="dashboard-cards">
        
        <div className="card-resumo">
          <span style={{ color: '#6B7280', fontSize: '16px', fontWeight: '500' }}>Receitas</span>
          <span style={{ color: '#10B981', fontSize: '24px', fontWeight: 'bold' }}>R$ {totalReceitas.toFixed(2)}</span>
        </div>

        <div className="card-resumo">
          <span style={{ color: '#6B7280', fontSize: '16px', fontWeight: '500' }}>Despesas</span>
          <span style={{ color: '#EF4444', fontSize: '24px', fontWeight: 'bold' }}>R$ {totalDespesas.toFixed(2)}</span>
        </div>

        <div className="card-resumo" style={{ borderLeft: `6px solid ${saldoFinal >= 0 ? '#3B82F6' : '#F59E0B'}` }}>
          <span style={{ color: '#374151', fontSize: '18px', fontWeight: 'bold' }}>Saldo Atual</span>
          <span style={{ color: saldoFinal >= 0 ? '#3B82F6' : '#F59E0B', fontSize: '28px', fontWeight: '900' }}>R$ {saldoFinal.toFixed(2)}</span>
        </div>

      </div>

      {dadosGrafico.length > 0 && (
        <div className="dashboard-grafico">
          <h4 style={{ margin: '0 0 10px 0', color: '#6B7280', fontWeight: '500', textAlign: 'center' }}>Distribuição de Despesas</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={dadosGrafico} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                {dadosGrafico.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.cor} />)}
              </Pie>
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}