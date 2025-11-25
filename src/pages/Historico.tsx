import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, AlertTriangle, Info } from 'lucide-react';

interface Cliente {
  id: string;
  nome: string;
}

interface Transacao {
  id: string;
  data: string;
  hora: string;
  valor: number;
  chavepix_destinatario: string;
  nome_destinatario: string;
  dispositivo: number;
  tipo_transacao: string;
  motivo: string;
}

const Historico: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cliente: Cliente = (location.state as any)?.cliente;

  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tooltip, setTooltip] = useState<{ show: boolean; text: string; id: string }>({ show: false, text: '', id: '' });

  useEffect(() => {
    if (!cliente?.id) {
      navigate('/pesquisa');
      return;
    }
    setLoading(true);
    fetch(`https://lab-api-lh4z.onrender.com/clientes/${cliente.id}/anomalas`)
      .then(res => res.json())
      .then(data => {
        setTransacoes(data);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [cliente, navigate]);

  const dispositivos: Record<number, string> = {
    1: "Android",
    2: "iOS",
    3: "Web"
  };

  const filtered = transacoes.filter(t =>
    [t.data, t.hora, t.valor.toString(), t.chavepix_destinatario, dispositivos[t.dispositivo] || '', t.tipo_transacao]
      .some(f => f.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/banese_banner.png" alt="Banese Banner" className="h-8 w-auto" />
            <button onClick={() => navigate('/perfil', { state: { cliente } })} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Histórico do Cliente</p>
              <p className="font-medium text-gray-900">{cliente?.nome}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm px-4 pt-4 pb-2 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Pesquisar transação..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-green-600 focus:outline-none text-sm"
            />
          </div>
          <div className="h-1 w-[97%] bg-banese-green rounded-full mx-auto" />
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden text-sm">
          <div className="bg-banese-green text-white text-center font-semibold">
            <div className="grid grid-cols-8 py-3">
              <div>Motivo</div>
              <div>Data</div>
              <div>Valor</div>
              <div>Chave PIX</div>
              <div>Fraude</div>
              <div>Dispositivo</div>
              <div>Tipo</div>
              <div>Status</div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Carregando transações...</div>
          ) : (
            <div className="divide-y divide-gray-200 text-center">
              {filtered.length === 0 ? (
                <div className="py-8 text-gray-500">Nenhuma transação encontrada.</div>
              ) : (
                filtered.map(tx => (
                  <div key={tx.id} className="grid grid-cols-8 py-3 items-center hover:bg-gray-50 transition">
                    <div className="relative flex justify-center">
  <Info
    className="w-5 h-5 text-gray-600 cursor-pointer"
    onMouseEnter={() => setTooltip({ show: true, text: tx.motivo, id: tx.id })}
    onMouseLeave={() => setTooltip({ show: false, text: '', id: '' })}
  />
  {tooltip.show && tooltip.id === tx.id && (
    <div className="absolute z-50 bg-gray-500 text-white text-xs rounded-xl px-4 py-2 shadow-lg top-full mt-2 max-w-xs whitespace-pre-wrap text-left leading-snug break-words">
  {tooltip.text}
</div>
  )}
</div>

                    <div>{tx.data} - {tx.hora}</div>
                    <div>R$ {tx.valor.toFixed(2)}</div>
                    <div>{tx.chavepix_destinatario}</div>
                    <div className="flex justify-center items-center">
                      <AlertTriangle className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>{dispositivos[tx.dispositivo] || 'N/A'}</div>
                    <div>{tx.tipo_transacao}</div>
                    <div>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold text-green-600 border border-green-600">
                        Concluída
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Historico;
