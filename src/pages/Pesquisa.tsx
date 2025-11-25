import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';

interface Cliente {
  nome: string;
  cpf: string;
  data_nascimento: string;
  sexo: string;
  endereco: string;
  email: string;
  telefone: string;
}

const Pesquisa: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  const verificarAutenticacao = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!verificarAutenticacao()) return;

    const fetchClientes = async () => {
      if (!searchTerm.trim()) {
        setClientes([]);
        return;
      }

      setIsFetching(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `https://lab-api-lh4z.onrender.com/clientes/buscar/${encodeURIComponent(searchTerm)}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (!response.ok) throw new Error("Cliente não encontrado");

        const cliente = await response.json();
        // Mesmo sendo 1, transformamos em array para facilitar
        setClientes([cliente]);
      } catch (err) {
        console.error(err);
        setClientes([]);
      } finally {
        setIsFetching(false);
      }
    };

    fetchClientes();
  }, [searchTerm, navigate]);

  const handleClienteSelect = (cliente: Cliente) => {
  setIsLoading(true);
  setTimeout(() => {
    navigate('/perfil', { state: { cliente } });
  }, 1000);
};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="/banese_banner.png"
              alt="Banese Banner"
              className="h-6 w-auto"
            />
            <button
              onClick={() => navigate('/login')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 font-medium">Acompanhamento de Perfil</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center mb-6">
          <div className="bg-banese-green rounded-xl w-full max-w-xl h-48 flex items-center justify-center">
            <img src="/banese_invisible.png" className="h-30 w-auto" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Digite o nome, CPF ou número da conta para encontrar o cliente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Resultados ({clientes.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {clientes.length > 0 ? (
              clientes.map((cliente, index) => (
                <div
                  key={index}
                  onClick={() => handleClienteSelect(cliente)}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {cliente.nome}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>CPF: {cliente.cpf}</span>
                        <span>Email: {cliente.email}</span>
                        <span>Telefone: {cliente.telefone}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                      <span className="text-sm font-medium text-gray-600">
                        {cliente.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : isFetching ? (
              <div className="p-6 text-center text-sm text-gray-600">Buscando...</div>
            ) : (
              <div className="p-12 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum cliente encontrado
                </h3>
                <p className="text-gray-600">
                  Tente pesquisar com outros termos
                </p>
              </div>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <span className="text-gray-900">Carregando perfil do cliente...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pesquisa;
