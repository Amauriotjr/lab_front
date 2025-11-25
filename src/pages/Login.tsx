import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch("https://lab-api-lh4z.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        setError(true);
        // Não exibe mais alert!
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      navigate("/pesquisa");
    } catch (err: any) {
      setError(true); // Qualquer erro ativa o visual do erro
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-banese-green flex-col items-center justify-center p-10">
        <img src="/banese_invisible.png" alt="Banese" className="h-40 w-auto mb-6 mt-4" />
        <img src="/SecureLogin.svg" alt="Secure Login" className="w-full max-w-md" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="lg:hidden mb-6">
              <img src="/banese_invisible.png" alt="Banese" className="h-16 w-auto mx-auto" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Login</h1>
            <p className="text-gray-600">Bem-vindo ao Perfil do Cliente</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pl-10 pr-4 py-4 border-2 rounded-xl focus:outline-none transition-colors text-gray-900 placeholder-gray-500 ${
                    error ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-green-500"
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-4 border-2 rounded-xl focus:outline-none transition-colors text-gray-900 placeholder-gray-500 ${
                    error ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-green-500"
                  }`}
                  required
                />
              </div>
            </div>

            {/* Mensagem de erro visual */}
            {error && (
              <div className="text-center text-red-600 font-semibold mt-2">
                Login ou senha incorretos
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-banese-green hover:bg-banese-green text-white font-semibold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
