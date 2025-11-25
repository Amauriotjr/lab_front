import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  conta: string;
  agencia: string;
}

interface Estatisticas {
  media_mensal_pix: number;
  media_valor_contas_novas: number;
  media_mensal_transacoes: number;
  total_180_dias: number;
  qtd_pix_180_dias: number;
  dia_semana_padrao: string;
  dia_mes_padrao: number;
  horario_padrao: string;
  dispositivo_mais_usado: string;
  destinatarios_frequentes: { chave: string; quantidade: number }[];
}
interface TransacaoAnomala {
  id: string;
  valor: number;
  data: string;
  hora: string;
  chavepix_destinatario: string;
  nome_destinatario: string;
  dispositivo: number;
  tipo_transacao: string;
}

interface Destinatario {
  nome: string;
  chave: string;
}

const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cliente: Cliente = (location.state as any)?.cliente;

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
    // O restante da lógica de carregamento de dados virá aqui
  }, []);

  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [destinatarios, setDestinatarios] = useState<Destinatario[]>([]);
  const [transacoesAnomalias, setTransacoesAnomalias] = useState<TransacaoAnomala[]>([]);
  const [medPixCount, setMedPixCount] = useState(0);



  const horariosFixos = [
  { name: '00:00 às 06:00', color: '#ef4444' },
  { name: '07:00 às 13:00', color: '#f59e0b' },
  { name: '14:00 às 19:00', color: '#22c55e' },
  { name: '20:00 às 23:00', color: '#3b82f6' },
];

const pieData = horariosFixos.map((item) => ({
  ...item,
  value: estatisticas?.horarios_distribuicao?.[item.name] ?? 0
}));

  const initials = (str: string) =>
    str
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('');

  useEffect(() => {
    if (!verificarAutenticacao() || !cliente?.id) return;

    const token = localStorage.getItem('token');

    const fetchEstatisticas = async () => {
      try {
        const response = await fetch(`https://lab-api-lh4z.onrender.com/clientes/${cliente.id}/estatisticas`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        if (!response.ok) throw new Error("Erro ao buscar estatísticas");

        const data = await response.json();
        setEstatisticas(data);
        setDestinatarios(data.destinatarios_frequentes || []);
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    const fetchAnomalias = async () => {
      try {
        const res = await fetch(`https://lab-api-lh4z.onrender.com/clientes/${cliente.id}/anomalas`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (res.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        if (!res.ok) throw new Error('Erro ao buscar anomalias');
        const data = await res.json();
        const ordenado = data.sort((a: TransacaoAnomala, b: TransacaoAnomala) => {
          const dateA = new Date(`${a.data.split('/').reverse().join('-')}T${a.hora}`);
          const dateB = new Date(`${b.data.split('/').reverse().join('-')}}T${b.hora}`);
          return dateB.getTime() - dateA.getTime();
        });

        setTransacoesAnomalias(ordenado.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };

    fetchEstatisticas();
    fetchAnomalias();
  }, [cliente, navigate]);

  useEffect(() => {
    if (!verificarAutenticacao() || !cliente?.id) return;

    const token = localStorage.getItem('token');

    const fetchMedPixCount = async () => {
      try {
        const res = await fetch(`https://lab-api-lh4z.onrender.com/medpix/${cliente.id}/count`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (res.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        if (!res.ok) throw new Error("Erro ao buscar contagem de MedPix");
        const data = await res.json();
        setMedPixCount(data.count);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMedPixCount();
  }, [cliente, navigate]);

  return (
  <div className="min-h-screen bg-gray-50">
    {estatisticas === null ? (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Carregando dados do cliente...</p>
        </div>
      </div>
    ) : ( 
      <>
        {/* Cabeçalho */}
        <div className="bg-white shadow-sm border-b relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/banese_banner.png" alt="Banese Banner" className="h-6 w-auto" />
              <button
                onClick={() => navigate('/pesquisa')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Perfil do Cliente</p>
                <p className="text-lg font-semibold text-gray-900">{cliente?.nome}</p>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                {initials(cliente?.nome)}
              </div>
            </div>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-6 py-6 grid lg:grid-cols-4 gap-6">
        <section className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:grid-rows-[auto_auto_auto]">
  {estatisticas ? (
    <>
      <StatCard title="Média Mensal no PIX" value={estatisticas.media_mensal_pix} isCurrency />
      <StatCard title="Valor Médio para Contas Novas" value={estatisticas.media_valor_contas_novas} isCurrency />
      <StatCard title="Média Mensal de Transações" value={estatisticas.media_mensal_transacoes} isCurrency />

      {/* Gráfico no centro, com row-span */}
      <div className="bg-white rounded-xl p-6 shadow-sm col-span-1 xl:col-span-1 row-span-2">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Horário Padrão de PIX</h3>
        <div className="flex flex-wrap gap-3 text-sm mb-3">
          <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> <span>00:00 às 06:00</span></div>
          <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-yellow-400"></span> <span>07:00 às 13:00</span></div>
          <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> <span>14:00 às 19:00</span></div>
          <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> <span>20:00 às 23:00</span></div>
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie data={pieData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <p className="text-center mt-4 text-xl font-semibold">{estatisticas.horario_padrao}</p>
        <p className="text-center text-sm text-gray-600">Horário Padrão de PIX</p>
      </div>

      <StatCard title="Últimos 180 dias de PIX" value={estatisticas.total_180_dias} isCurrency />
      <StatCard title="PIX realizados nos últimos 180 dias" value={`${estatisticas.qtd_pix_180_dias}`} />
      <StatCard title="Dia da Semana Padrão de PIX" value={estatisticas.dia_semana_padrao} />
      <StatCard title="Dia do Mês Padrão de Pix" value={`${estatisticas.dia_mes_padrao}`} />
    </>
  ) : (
    <p className="text-gray-500">Carregando estatísticas...</p>
  )}
</div>

          <div className="mt-8">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800 mr-4">Transações Fora do Padrão</h3>
                  <div className="flex-1 h-1 bg-banese-green rounded-full max-w-[1000px]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {transacoesAnomalias.map((t, i) => (
                    <div key={i} className="bg-white rounded-xl shadow p-4 flex flex-col justify-between">
                      <div className="text-sm space-y-1 mb-4">
                        <p><strong>Valor:</strong> R$ {t.valor.toFixed(2)}</p>
                        <p><strong>Horário:</strong> {t.data}, {t.hora}</p>
                        <p><strong>Destinatário:</strong> {t.chavepix_destinatario}</p>
                      </div>
                      <button onClick={() => navigate('/historico', { state: { cliente } })}
                        className="bg-banese-green text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-banese-green-light transition">
                        Ver mais detalhes
                      </button>
                    </div>
                  ))}
                </div>
              </div>
        </section>

        <aside className="bg-banese-green text-white rounded-xl p-4 space-y-4 w-full lg:w-[280px] self-start">
          <div>
            <h3 className="text-md font-semibold text-white mb-2">Dados do Cliente</h3>
            <div className="bg-white text-banese-green rounded-xl p-4 space-y-2">
              {[['Tipo', 'Corrente'], ['Conta', '12345-6' ], ['Agência', '12' ], ['CPF', cliente.cpf]].map(
                ([k, v], i) => (
                  <div key={i} className="flex justify-between text-sm py-1">
                    <span className="text-gray-500">{k}</span>
                    <span className="font-semibold">{v}</span>
                  </div>
                )
              )}
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-2 w-full bg-white text-banese-green py-2 px-3 rounded-xl font-semibold flex justify-between items-center hover:bg-gray-100 transition"
            >
              Mais Detalhes <ArrowRight className="w-4 h-4" />
            </button>
          </div>
           {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-[90%] max-w-md relative">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-black"
        onClick={() => setShowModal(false)}
      >
        ✕
      </button>
      <h2 className="text-center text-xl font-semibold text-banese-green mb-4">Mais Detalhes</h2>
      <div className="text-sm text-gray-800 space-y-4">
        <div>
          <h3 className="font-bold">Perfil do Cliente:</h3>
          <ul className="list-disc ml-5 space-y-1">
            <li><strong>Nome:</strong> {cliente?.nome}</li>
            <li><strong>CPF:</strong> {cliente?.cpf}</li>
            <li> <strong>Data de Nascimento:</strong> {cliente?.data_nascimento} 
  ({cliente?.data_nascimento ? `${calcularIdade(cliente.data_nascimento)} anos` : 'Idade desconhecida'})
</li>
            <li><strong>Sexo:</strong> {cliente?.sexo}</li>
            <li><strong>Endereço:</strong> {cliente?.endereco}</li>
            <li><strong>E-mail:</strong> {cliente?.email}</li>
            <li><strong>Telefone:</strong> {cliente?.telefone}</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold">Número de Contas:</h3>
          <ul className="list-disc ml-5 space-y-1">
            <li>
              <strong>Conta Corrente:</strong>
              <ul className="ml-4 list-disc">
                <li>Conta: 12345-6</li>
                <li>Agência: 12</li>
              </ul>
            </li>
            <li>
              <strong>Conta Poupança:</strong>
              <ul className="ml-4 list-disc">
                <li>Conta: 98765-4</li>
                <li>Agência: {cliente?.agencia}</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
)}

{/* Destinatários Frequentes */}
<div>
  <h3 className="text-md font-semibold text-white mb-2">Destinatários Frequentes</h3>
  <div className="bg-white text-banese-green rounded-xl p-4 space-y-3">
    {destinatarios.length === 0 && (
      <p className="text-sm text-gray-500">Nenhum dado encontrado.</p>
    )}
    {destinatarios.map((d, i) => (
      <div
        key={i}
        className={`flex flex-col text-sm ${
          i !== destinatarios.length - 1 ? 'border-b border-green-700 pb-2' : ''
        }`}
      >
        <div className="flex justify-between">
          <span className="font-bold">Nome</span>
          <span>{d.nome}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span className="font-bold">Chave PIX</span>
          <span>{d.chave}</span>
        </div>
      </div>
    ))}
  </div>
</div>

{/* MED PIX + Botões */}
<div className="space-y-4">
  <h3 className="text-md font-semibold text-white">MED PIX</h3>
  <div className="bg-white text-banese-green rounded-xl p-4">
    <div className="flex justify-between text-sm">
      <span>MED PIX Solicitados</span>
      <span className="font-semibold">{medPixCount}</span>
    </div>
  </div>

  <button
  onClick={() => navigate('/medpix', { state: { cliente } })}
    className="w-full bg-white text-banese-green py-2 px-3 rounded-xl font-medium flex justify-between items-center hover:bg-gray-100 transition"
  >
    Acompanhar Protocolos <ArrowRight className="w-4 h-4" />
  </button>

  <div>
    <h4 className="font-semibold text-white text-sm mb-2">Histórico</h4>
    <button
      onClick={() => navigate('/historico', { state: { cliente } })}
      className="w-full bg-white text-banese-green py-2 px-3 rounded-xl font-medium flex justify-between items-center hover:bg-gray-100 transition"
    >
      Acompanhar Transações <ArrowRight className="w-4 h-4" />
    </button>
  </div>

  <button
    onClick={() => navigate('/pesquisa')}
    className="w-full bg-white text-banese-green py-3 px-3 rounded-xl font-semibold hover:bg-gray-100 transition"
  >
    Sair
  </button>
</div>
        </aside>
        </div>
      </>
    )}
  </div>  
);
    }
const StatCard = ({ title, value, isCurrency = false }: { title: string; value: number | string; isCurrency?: boolean }) => {
  const formatValue = () => {
    if (isCurrency && typeof value === 'number') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
      }).format(value);
    }
    return value;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm min-h-[120px] w-full">
      <h3 className="text-sm text-gray-600 mb-2">{title}</h3>
      <div className="h-1 bg-banese-green rounded-full mb-3"></div>
      <p className="text-3xl font-bold text-gray-900">{formatValue()}</p>
    </div>
  );
};


export default Perfil;


const calcularIdade = (data: string): number => {
  const hoje = new Date();
  const nascimento = new Date(data);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
};

const AsideCliente = ({ cliente, destinatarios, showModal, setShowModal }: any) => {
  return (
    <aside className="bg-banese-green text-white rounded-xl p-4 space-y-4 w-full lg:w-[280px] self-start">
      <div>
        <h3 className="text-md font-semibold mb-2">Dados do Cliente</h3>
        <div className="bg-white text-banese-green rounded-xl p-4 space-y-2">
          <p>Conta: {cliente.conta}</p>
          <p>Agência: {cliente.agencia}</p>
          <p>CPF: {cliente.cpf}</p>
        </div>
      </div>
    </aside>
  );
};
