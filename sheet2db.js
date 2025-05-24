// Configuração do Sheet2DB
const SHEET2DB_API_URL = 'SUA_URL_DA_API_SHEET2DB';
const SHEET2DB_API_KEY = 'SUA_CHAVE_DA_API_SHEET2DB';

// Funções CRUD para projetos usando Sheet2DB
async function buscarProjetos() {
    try {
        const response = await fetch(`${SHEET2DB_API_URL}?apiKey=${SHEET2DB_API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Processar os dados para garantir compatibilidade com o formato esperado
        return data.map(projeto => {
            // Converter string de arquivos separados por pipe para array
            if (projeto.arquivos && typeof projeto.arquivos === 'string') {
                projeto.arquivos = projeto.arquivos.split('|').filter(url => url.trim() !== '');
            } else {
                projeto.arquivos = [];
            }
            
            return projeto;
        });
    } catch (error) {
        console.error('Erro ao buscar projetos:', error);
        return [];
    }
}

async function adicionarProjeto(projeto) {
    try {
        // Gerar ID único para o projeto
        projeto.id = Date.now().toString();
        
        // Adicionar timestamp de criação
        projeto.created_at = new Date().toISOString();
        
        // Converter array de arquivos para string separada por pipe
        if (Array.isArray(projeto.arquivos)) {
            projeto.arquivos = projeto.arquivos.join('|');
        }
        
        const response = await fetch(SHEET2DB_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': SHEET2DB_API_KEY
            },
            body: JSON.stringify(projeto)
        });
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Converter string de arquivos de volta para array para manter consistência
        if (data.arquivos && typeof data.arquivos === 'string') {
            data.arquivos = data.arquivos.split('|').filter(url => url.trim() !== '');
        } else {
            data.arquivos = [];
        }
        
        return data;
    } catch (error) {
        console.error('Erro ao adicionar projeto:', error);
        return null;
    }
}

async function atualizarProjeto(id, projeto) {
    try {
        // Converter array de arquivos para string separada por pipe
        if (Array.isArray(projeto.arquivos)) {
            projeto.arquivos = projeto.arquivos.join('|');
        }
        
        const response = await fetch(`${SHEET2DB_API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': SHEET2DB_API_KEY
            },
            body: JSON.stringify(projeto)
        });
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Converter string de arquivos de volta para array para manter consistência
        if (data.arquivos && typeof data.arquivos === 'string') {
            data.arquivos = data.arquivos.split('|').filter(url => url.trim() !== '');
        } else {
            data.arquivos = [];
        }
        
        return data;
    } catch (error) {
        console.error('Erro ao atualizar projeto:', error);
        return null;
    }
}

async function excluirProjeto(id) {
    try {
        const response = await fetch(`${SHEET2DB_API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': SHEET2DB_API_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        
        return true;
    } catch (error) {
        console.error('Erro ao excluir projeto:', error);
        return false;
    }
}

// Função para obter um projeto específico por ID
async function buscarProjetoPorId(id) {
    try {
        const response = await fetch(`${SHEET2DB_API_URL}/${id}?apiKey=${SHEET2DB_API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Converter string de arquivos para array
        if (data.arquivos && typeof data.arquivos === 'string') {
            data.arquivos = data.arquivos.split('|').filter(url => url.trim() !== '');
        } else {
            data.arquivos = [];
        }
        
        return data;
    } catch (error) {
        console.error(`Erro ao buscar projeto com ID ${id}:`, error);
        return null;
    }
}

// Função para importar projetos de exemplo
async function importarProjetosExemplo() {
    const projetosExemplo = [
        {
            nome: "Website Responsivo",
            departamento: "programacao",
            status: "em-andamento",
            dataInicio: "04/10/2025",
            dataConclusao: "05/10/2025",
            descricao: "Desenvolvimento de website responsivo com painel administrativo.",
            arquivos: "https://exemplo.com/wireframe.pdf",
            emailNotificacoes: "cliente@exemplo.com"
        },
        {
            nome: "Campanha de Email Marketing",
            departamento: "copywriting",
            status: "pendente",
            dataInicio: "10/10/2025",
            dataConclusao: "15/10/2025",
            descricao: "Criação de sequência de emails para campanha de lançamento.",
            arquivos: "",
            emailNotificacoes: "marketing@exemplo.com"
        },
        {
            nome: "Identidade Visual",
            departamento: "design",
            status: "concluido",
            dataInicio: "01/10/2025",
            dataConclusao: "03/10/2025",
            descricao: "Desenvolvimento de logo, paleta de cores e guia de estilo.",
            arquivos: "https://exemplo.com/logo.ai|https://exemplo.com/styleguide.pdf",
            emailNotificacoes: "design@exemplo.com"
        },
        {
            nome: "Gestão de Redes Sociais",
            departamento: "social-media",
            status: "em-andamento",
            dataInicio: "01/10/2025",
            dataConclusao: "31/10/2025",
            descricao: "Criação e agendamento de conteúdo para Instagram, Facebook e LinkedIn.",
            arquivos: "https://exemplo.com/calendario-editorial.xlsx",
            emailNotificacoes: "social@exemplo.com"
        },
        {
            nome: "Prospecção de Clientes",
            departamento: "prospeccao",
            status: "em-andamento",
            dataInicio: "05/10/2025",
            dataConclusao: "20/10/2025",
            descricao: "Identificação e abordagem de leads qualificados para serviços de marketing digital.",
            arquivos: "",
            emailNotificacoes: "vendas@exemplo.com"
        }
    ];
    
    const resultados = [];
    
    for (const projeto of projetosExemplo) {
        // Adicionar ID único e timestamp
        projeto.id = Date.now().toString() + Math.floor(Math.random() * 1000);
        projeto.created_at = new Date().toISOString();
        
        const resultado = await adicionarProjeto(projeto);
        if (resultado) {
            resultados.push(resultado);
        }
    }
    
    return resultados;
}
