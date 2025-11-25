import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';

interface Protocolo {
  id: string;
  protocolo: string;
  data: string;
  hora: string;
  valor: number;
  status: string;
}

const MedPix: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cliente = (location.state as any)?.cliente;

  const [protocolos, setProtocolos] = useState<Protocolo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cliente?.id) {
      console.error('Cliente não informado');
      return;
    }

    const fetchMedpix = async () => {
      try {
        const res = await fetch(`https://lab-api-lh4z.onrender.com/medpix/${cliente.id}`);
        if (!res.ok) throw new Error('Erro ao buscar MedPix');
        const data = await res.json();
        setProtocolos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedpix();
  }, [cliente]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EM ANÁLISE': return 'text-blue-600';
      case 'DEFERIDO': return 'text-green-600';
      case 'INDEFERIDO': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const formatDataHora = (data: string, hora: string) => {
    const dataObj = new Date(`${data}T${hora}`);
    return dataObj.toLocaleDateString('pt-BR') + ', ' + dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleArquivar = async (protocolo: string) => {
    try {
      const res = await fetch(`https://antifraudepix-api.onrender.com/medpix/protocolo/${protocolo}/arquivar`, { method: 'POST' });
      if (!res.ok) throw new Error('Erro ao arquivar');
      setProtocolos(prev => prev.filter(p => p.protocolo !== protocolo));
    } catch (err) {
      console.error(err);
      alert('Falha ao arquivar o protocolo.');
    }
  };

  const filteredProtocolos = protocolos.filter(p =>
    [p.protocolo, p.data, p.valor.toString(), p.status].some(field =>
      field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Carregando dados do MedPix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* cabeçalho */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/banese_banner.png" alt="Banese Banner" className="h-6 w-auto" />
            <button onClick={() => navigate('/perfil', { state: { cliente } })} className="p-2 text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">MED PIX</p>
              <p className="font-medium text-gray-900">{cliente?.nome}</p>
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {cliente?.nome?.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* search bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm px-4 pt-4 pb-2 max-w-2xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Pesquisar por protocolo, data, valor ou status"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-green-600 focus:outline-none text-sm"
            />
          </div>
          <div className="h-1 w-[97%] bg-banese-green rounded-full mx-auto" />
        </div>

        {/* tabela */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-banese-green text-white text-center text-sm">
            <div className="grid grid-cols-6 py-3 font-semibold">
              <div>Protocolo</div>
              <div>Data</div>
              <div>Hora</div>
              <div>Valor</div>
              <div>Status</div>
              <div>Ação</div>
            </div>
          </div>

          <div className="divide-y divide-gray-200 text-center text-sm">
            {filteredProtocolos.map((protocolo) => (
              <div key={protocolo.id} className="grid grid-cols-6 py-3 items-center hover:bg-gray-50">
                <div className="font-medium">{protocolo.protocolo}</div>
                <div>{new Date(protocolo.data).toLocaleDateString('pt-BR')}</div>
                <div>{protocolo.hora.slice(0, 5)}</div>
                <div>{formatValor(protocolo.valor)}</div>
                <div className={`font-medium ${getStatusColor(protocolo.status)}`}>{protocolo.status}</div>
                <div>
                  <button
                    onClick={() => handleArquivar(protocolo.protocolo)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-semibold"
                  >
                    Arquivar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProtocolos.length === 0 && (
            <div className="p-12 text-center text-gray-500">Nenhum protocolo encontrado</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedPix;
