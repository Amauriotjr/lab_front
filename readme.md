# Frontend - Interface de Perfil do Cliente

Este `README` detalha a configuração e o deploy da interface de usuário do sistema Antifraude PIX, desenvolvida em **React** com **Vite** e estilizada com **Tailwind CSS**.

## 1. Estrutura e Tecnologias

| Tecnologia | Uso |
| :--- | :--- |
| **React** | Biblioteca JavaScript para construção da interface. |
| **Vite** | Ferramenta de build e servidor de desenvolvimento rápido. |
| **Tailwind CSS** | Framework CSS utilitário para estilização rápida. |
| **Recharts** | Biblioteca para visualização de dados (gráficos). |
| **Axios/Fetch** | Comunicação com a API de Backend. |

A interface está contida na pasta `frontend`.

## 2. Configuração Local

### Pré-requisitos

*   Node.js (versão 18+)

### Instalação de Dependências

Navegue até a pasta `frontend` e instale as dependências Node.js:

```bash
cd frontend
npm install
```

### Execução Local

Para rodar o Frontend localmente (padrão na porta `5173`):

```bash
npm run dev
```

### Configuração de Comunicação com o Backend

Para o desenvolvimento local, o Frontend precisa saber onde encontrar o Backend.

*   **Se o Backend estiver rodando localmente na porta `8000`:** O arquivo `vite.config.ts` já está configurado com um **proxy** para redirecionar as chamadas de API (`/auth`, `/clientes`, etc.) para `http://localhost:8000`.
*   **Se o Backend estiver no Render:** Você deve alterar as chamadas de API nos arquivos `.tsx` (ex: `Login.tsx`, `Pesquisa.tsx`) para usar a URL pública do seu Backend no Render.

**Exemplo de Alteração (Se o Backend estiver no Render):**

Em arquivos como `frontend/src/pages/Login.tsx`, substitua:

```typescript
const response = await fetch("/auth/login", { /* ... */ });
```

Por:

```typescript
const BACKEND_URL = "SUA_URL_DO_RENDER_AQUI"; // Ex: https://seu-backend-render.onrender.com
const response = await fetch(`${BACKEND_URL}/auth/login`, { /* ... */ });
```

## 3. Deploy no Vercel

O Frontend é uma aplicação React/Vite e pode ser facilmente implantada no Vercel.

### Passos para o Deploy

1.  **Crie um novo Projeto** no Vercel.
2.  **Conecte** seu repositório Git.
3.  **Configuração:**
    *   **Framework Preset:** Selecione **Vite**.
    *   **Root Directory:** Certifique-se de que o diretório raiz do projeto no Vercel aponte para a pasta `frontend`.
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist` (padrão do Vite)
4.  **Variáveis de Ambiente:** Se você precisar de variáveis de ambiente no Frontend (como a URL do Backend), configure-as na seção de Environment Variables do Vercel.

### Pós-Deploy: Conexão com o Backend

Após o deploy no Vercel, o Frontend estará acessível em uma URL pública. Para que ele se comunique com o Backend (hospedado no Render), você **deve garantir que as chamadas de API no código do Frontend estejam apontando para a URL pública do seu Backend no Render**.

## 4. Detalhes das Correções

*   **Expiração de Login:** O Frontend foi corrigido para tratar o erro `401` (Não Autorizado) do Backend. Ao receber este erro, o token é removido do `localStorage` e o usuário é redirecionado para a tela de login, garantindo que o problema de ter que fazer deploy para logar novamente não ocorra.
*   **Imagens:** As imagens de branding foram substituídas e ajustadas no código para garantir que o logo do Forbank seja exibido corretamente sem distorção.
