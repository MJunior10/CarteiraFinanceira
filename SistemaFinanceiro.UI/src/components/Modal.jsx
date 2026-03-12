export default function Modal({ isOpen, onClose, titulo, children }) {
  // Se o modal não estiver aberto, não desenha nada na tela
  if (!isOpen) return null;

  return (
    // Fundo escuro transparente
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', width: '90%', maxWidth: '500px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', position: 'relative' }}>
        
        {/* Cabeçalho do Card */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>{titulo}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>
            ✖
          </button>
        </div>

        {/* Aqui entra o conteúdo dinâmico (Formulários, Textos, etc) */}
        {children}
        
      </div>
    </div>
  );
}