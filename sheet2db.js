// Configuração do Sheet2DB
const SHEET2DB_API_URL = 'https://api.sheet2db.com/v1/3ad4a0d5-c46f-44bc-abbd-03b91dc7b744';
const SHEET2DB_API_KEY = ''; // Deixe vazio se não configurou uma chave de API

// Funções CRUD para projetos usando Sheet2DB
async function buscarProjetos() {
    console.log("Buscando projetos do Sheet2DB");
    
    try {
        const response = await fetch(SHEET2DB_API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(SHEET2DB_API_KEY && { 'x-api-key': SHEET2DB_API_KEY })
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar projetos: ${response.status}`);
        }
        
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Erro ao buscar projetos:', error);
        return [];
    }
}

async function adicionarProjeto(projeto) {
    console.log("Adicionando projeto ao Sheet2DB:", projeto);
    
    try {
        // Converter string de arquivos para array se necessário
        if (typeof projeto.arquivos === 'string') {
            projeto.arquivos = projeto.arquivos.split(/[,\n|]/).map(url => url.trim()).filter(url => url);
        }
        
        const response = await fetch(SHEET2DB_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(SHEET2DB_API_KEY && { 'x-api-key': SHEET2DB_API_KEY })
            },
            body: JSON.stringify(projeto)
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao adicionar projeto: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao adicionar projeto:', error);
        return null;
    }
}

async function atualizarProjeto(id, projeto) {
    console.log(`Atualizando projeto ID: ${id}`, projeto);
    
    try {
        // Converter string de arquivos para array se necessário
        if (typeof projeto.arquivos === 'string') {
            projeto.arquivos = projeto.arquivos.split(/[,\n|]/).map(url => url.trim()).filter(url => url);
        }
        
        const response = await fetch(`${SHEET2DB_API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(SHEET2DB_API_KEY && { 'x-api-key': SHEET2DB_API_KEY })
            },
            body: JSON.stringify(projeto)
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao atualizar projeto: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Erro ao atualizar projeto ID: ${id}:`, error);
        return null;
    }
}

async function excluirProjeto(id) {
    console.log(`Excluindo projeto ID: ${id}`);
    
    try {
        const response = await fetch(`${SHEET2DB_API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(SHEET2DB_API_KEY && { 'x-api-key': SHEET2DB_API_KEY })
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao excluir projeto: ${response.status}`);
        }
        
        return true;
    } catch (error) {
        console.error(`Erro ao excluir projeto ID: ${id}:`, error);
        return false;
    }
}

// Função para obter um projeto específico por ID
async function buscarProjetoPorId(id) {
    console.log(`Buscando projeto ID: ${id}`);
    
    try {
        const response = await fetch(`${SHEET2DB_API_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(SHEET2DB_API_KEY && { 'x-api-key': SHEET2DB_API_KEY })
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar projeto: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Erro ao buscar projeto ID: ${id}:`, error);
        return null;
    }
}

// Função para importar projetos de exemplo
async function importarProjetosExemplo() {
    console.log("Importando projetos de exemplo");
    
    try {
        const projetosExemplo = [
            {
                nome: "Landing Page Produto",
                departamento: "programacao",
                status: "pendente",
                dataInicio: "15/06/2025",
                dataConclusao: "30/06/2025",
                descricao: "Desenvolvimento de landing page para lançamento de novo produto.",
                arquivos: [],
                emailNotificacoes: "produto@exemplo.com"
            },
            {
                nome: "Conteúdo para Blog",
                departamento: "copywriting",
                status: "em-andamento",
                dataInicio: "01/06/2025",
                dataConclusao: "15/06/2025",
                descricao: "Criação de 10 artigos para blog sobre marketing digital.",
                arquivos: ["https://exemplo.com/pauta-blog.docx"],
                emailNotificacoes: "blog@exemplo.com"
            },
            {
                nome: "Banners para Campanha",
                departamento: "design",
                status: "pendente",
                dataInicio: "10/06/2025",
                dataConclusao: "20/06/2025",
                descricao: "Criação de banners para campanha de remarketing.",
                arquivos: [],
                emailNotificacoes: "campanhas@exemplo.com"
            }
        ];
        
        const resultados = [];
        
        for (const projeto of projetosExemplo) {
            const resultado = await adicionarProjeto(projeto);
            if (resultado) {
                resultados.push(resultado);
            }
        }
        
        return resultados;
    } catch (error) {
        console.error("Erro ao importar projetos de exemplo:", error);
        return [];
    }
}
