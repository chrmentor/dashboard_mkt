// Script principal para o Dashboard com Supabase
// Versão com visual original arredondado

// Configuração do Supabase
const SUPABASE_URL = 'https://uvnhezzprjzlqkogcobl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2bmhlenpwcmp6bHFrb2djb2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MzE2MTAsImV4cCI6MjA2MzAwNzYxMH0.Juzb-P4iblp8EMZk-PToF3S0WGFbMpSM5Cb8X41MCh0';

// Inicialização do cliente Supabase diretamente (sem carregamento dinâmico)
const supabase = supabaseClient.createClient(SUPABASE_URL, SUPABASE_KEY);

// Variáveis globais
let projetosFiltrados = [];
let departamentoAtivo = 'todos';
let projetosCarregados = false;

// Elementos DOM
document.addEventListener('DOMContentLoaded', () => {
    const projetosContainer = document.getElementById('projetos-container');
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    const btnNovoProjeto = document.getElementById('btnNovoProjeto');
    const btnImportarProjetos = document.getElementById('btnImportarProjetos');
    const novoprojetoModal = new bootstrap.Modal(document.getElementById('novoprojetoModal'));
    const detalhesModal = new bootstrap.Modal(document.getElementById('detalhesModal'));

    // Carregar projetos
    carregarProjetos();
    
    // Configurar filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            departamentoAtivo = button.getAttribute('data-filter');
            filtrarProjetos();
        });
    });
    
    // Configurar botão de novo projeto
    btnNovoProjeto.addEventListener('click', () => {
        document.getElementById('novoprojetoForm').reset();
        novoprojetoModal.show();
    });
    
    // Configurar botão de salvar projeto
    document.getElementById('salvarProjeto').addEventListener('click', salvarProjeto);
    
    // Configurar botão de importar projetos
    btnImportarProjetos.addEventListener('click', () => {
        if (confirm('Isso irá adicionar todos os projetos originais ao Supabase. Continuar?')) {
            importarProjetosOriginais();
        }
    });
});

// Funções CRUD
async function carregarProjetos() {
    const projetosContainer = document.getElementById('projetos-container');
    try {
        const { data, error } = await supabase
            .from('projetos')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            throw error;
        }
        
        if (data && data.length > 0) {
            projetosFiltrados = data;
            projetosCarregados = true;
            filtrarProjetos();
        } else {
            projetosContainer.innerHTML = '<div class="col-12"><div class="alert alert-info">Nenhum projeto encontrado. Clique em "Novo Projeto" para adicionar.</div></div>';
        }
    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        projetosContainer.innerHTML = `<div class="col-12"><div class="alert alert-danger">Erro ao carregar projetos. Verifique suas credenciais do Supabase e tente novamente.</div></div>`;
    }
}

async function salvarProjeto() {
    const nome = document.getElementById('nome_projeto').value;
    const departamento = document.getElementById('departamento').value;
    const status = document.getElementById('status').value;
    const dataInicio = document.getElementById('data_inicio').value;
    const dataConclusao = document.getElementById('data_conclusao').value;
    const descricao = document.getElementById('descricao').value;
    const arquivosText = document.getElementById('arquivos').value;
    const emailNotificacoes = document.getElementById('email_notificacoes').value;
    
    // Validar campos obrigatórios
    if (!nome || !departamento || !status || !dataInicio || !dataConclusao || !descricao || !emailNotificacoes) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Processar arquivos
    const arquivos = arquivosText.split(/[,\n]/).map(url => url.trim()).filter(url => url);
    
    // Formatar datas para exibição
    const dataInicioFormatada = formatarData(dataInicio);
    const dataConclusaoFormatada = formatarData(dataConclusao);
    
    const novoProjeto = {
        nome,
        departamento,
        status,
        dataInicio: dataInicioFormatada,
        dataConclusao: dataConclusaoFormatada,
        descricao,
        arquivos,
        emailNotificacoes
    };
    
    try {
        const { data, error } = await supabase
            .from('projetos')
            .insert([novoProjeto])
            .select();
        
        if (error) {
            throw error;
        }
        
        const novoprojetoModal = bootstrap.Modal.getInstance(document.getElementById('novoprojetoModal'));
        novoprojetoModal.hide();
        carregarProjetos();
        alert('Projeto adicionado com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar projeto:', error);
        alert('Erro ao salvar projeto. Por favor, tente novamente.');
    }
}

async function excluirProjeto(id) {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
        try {
            const { error } = await supabase
                .from('projetos')
                .delete()
                .eq('id', id);
            
            if (error) {
                throw error;
            }
            
            carregarProjetos();
            alert('Projeto excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir projeto:', error);
            alert('Erro ao excluir projeto. Por favor, tente novamente.');
        }
    }
}

function mostrarDetalhes(projeto) {
    const detalhesConteudo = document.getElementById('detalhes-conteudo');
    
    let arquivosHTML = '';
    if (projeto.arquivos && projeto.arquivos.length > 0) {
        arquivosHTML = `
            <h6>Arquivos:</h6>
            <ul>
                ${projeto.arquivos.map(arquivo => `<li><a href="${arquivo}" target="_blank">${arquivo}</a></li>`).join('')}
            </ul>
        `;
    }
    
    detalhesConteudo.innerHTML = `
        <h4>${projeto.nome}</h4>
        <div class="badge status-badge status-${projeto.status} mb-3">${getStatusLabel(projeto.status)}</div>
        <p><strong>Departamento:</strong> ${getDepartamentoLabel(projeto.departamento)}</p>
        <p><strong>Data de Início:</strong> ${projeto.dataInicio}</p>
        <p><strong>Data de Conclusão:</strong> ${projeto.dataConclusao}</p>
        <p><strong>Descrição:</strong> ${projeto.descricao}</p>
        ${arquivosHTML}
        <p><strong>E-mail para Notificações:</strong> ${projeto.emailNotificacoes}</p>
    `;
    
    const detalhesModal = bootstrap.Modal.getInstance(document.getElementById('detalhesModal')) || 
                          new bootstrap.Modal(document.getElementById('detalhesModal'));
    detalhesModal.show();
}

// Funções auxiliares
function filtrarProjetos() {
    if (!projetosCarregados) return;
    
    const projetosFiltradosPorDepartamento = departamentoAtivo === 'todos' 
        ? projetosFiltrados 
        : projetosFiltrados.filter(projeto => projeto.departamento === departamentoAtivo);
    
    renderizarProjetos(projetosFiltradosPorDepartamento);
}

function renderizarProjetos(projetos) {
    const projetosContainer = document.getElementById('projetos-container');
    
    if (projetos.length === 0) {
        projetosContainer.innerHTML = '<div class="col-12"><div class="alert alert-info">Nenhum projeto encontrado para este filtro.</div></div>';
        return;
    }
    
    projetosContainer.innerHTML = projetos.map(projeto => `
        <div class="col">
            <div class="card h-100">
                <div class="card-header card-header-${projeto.status}">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">${projeto.nome}</h5>
                        <div class="badge status-badge status-${projeto.status}">${getStatusLabel(projeto.status)}</div>
                    </div>
                </div>
                <div class="card-body">
                    <p class="card-text">${getDepartamentoLabel(projeto.departamento)}</p>
                    <p class="card-text">${projeto.descricao.substring(0, 100)}${projeto.descricao.length > 100 ? '...' : ''}</p>
                </div>
                <div class="card-footer bg-transparent">
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">Início: ${projeto.dataInicio} Fim: ${projeto.dataConclusao}</small>
                        <div>
                            <button class="btn btn-info btn-sm" onclick='mostrarDetalhes(${JSON.stringify(projeto).replace(/"/g, "&quot;")})'>
                                <i class="bi bi-eye"></i> Ver Detalhes
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="excluirProjeto('${projeto.id}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function getStatusLabel(status) {
    switch (status) {
        case 'pendente': return 'Pendente';
        case 'em-andamento': return 'Em andamento';
        case 'concluido': return 'Concluído';
        default: return status;
    }
}

function getDepartamentoLabel(departamento) {
    switch (departamento) {
        case 'programacao': return 'Programação';
        case 'copywriting': return 'Copywriting';
        case 'design': return 'Design';
        case 'social-media': return 'Social Media';
        case 'prospeccao': return 'Prospecção/SDR';
        default: return departamento;
    }
}

function formatarData(dataISO) {
    if (!dataISO) return '';
    const partes = dataISO.split('-');
    if (partes.length !== 3) return dataISO;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Função para importar projetos originais
async function importarProjetosOriginais() {
    console.log("Iniciando importação de projetos originais...");
    
    // Lista de projetos originais
    const projetosOriginais = [
        {
            nome: "Campanha de Lançamento",
            departamento: "copywriting",
            status: "concluido",
            dataInicio: "01/04/2025",
            dataConclusao: "15/04/2025",
            descricao: "Criação de textos para campanha de lançamento do novo produto.",
            arquivos: ["https://github.com/manus-projects/campanha-lancamento", "documentacao_campanha.pdf"],
            emailNotificacoes: "christian.mentorial@gmail.com"
        },
        {
            nome: "Website Responsivo",
            departamento: "programacao",
            status: "em-andamento",
            dataInicio: "10/04/2025",
            dataConclusao: "10/05/2025",
            descricao: "Desenvolvimento de website responsivo com painel administrativo.",
            arquivos: ["https://github.com/manus-projects/website-responsivo", "documentacao_api.pdf"],
            emailNotificacoes: "christian.mentorial@gmail.com"
        },
        {
            nome: "Estratégia Instagram",
            departamento: "social-media",
            status: "pendente",
            dataInicio: "20/04/2025",
            dataConclusao: "05/05/2025",
            descricao: "Planejamento de conteúdo e estratégia para Instagram.",
            arquivos: ["plano_instagram.pdf"],
            emailNotificacoes: "christian.mentorial@gmail.com"
        },
        {
            nome: "Identidade Visual",
            departamento: "design",
            status: "em-andamento",
            dataInicio: "05/04/2025",
            dataConclusao: "25/04/2025",
            descricao: "Criação de logo, paleta de cores e elementos visuais.",
            arquivos: ["https://github.com/manus-projects/identidade-visual", "manual_marca.pdf"],
            emailNotificacoes: "christian.mentorial@gmail.com"
        },
        {
            nome: "Prospecção B2B",
            departamento: "prospeccao",
            status: "pendente",
            dataInicio: "22/04/2025",
            dataConclusao: "22/05/2025",
            descricao: "Identificação e qualificação de leads para o setor de tecnologia.",
            arquivos: ["lista_leads.xlsx"],
            emailNotificacoes: "christian.mentorial@gmail.com"
        },
        {
            nome: "Simulador de Impostos para Infoprodutores",
            departamento: "programacao",
            status: "em-andamento",
            dataInicio: "20/04/2025",
            dataConclusao: "05/05/2025",
            descricao: "Simulador de impostos que compara os regimes tributários MEI, Simples Nacional e Lucro Presumido para Infoprodutores e afiliados.",
            arquivos: ["https://unzqrdek.manus.space", "https://github.com/manus-projects/simulador-impostos-infoprodutores"],
            emailNotificacoes: "christian.mentorial@gmail.com"
        },
        {
            nome: "Criação Simulador de Impostos Caminhoneiros",
            departamento: "programacao",
            status: "pendente",
            dataInicio: "27/05/2025",
            dataConclusao: "29/06/2025",
            descricao: "Criação Simulador de Impostos Caminhoneiros",
            arquivos: [],
            emailNotificacoes: "christian.mentorial@gmail.com"
        },
        {
            nome: "Criação Chatbot Próprio para Caminhoneiros",
            departamento: "programacao",
            status: "pendente",
            dataInicio: "23/04/2025",
            dataConclusao: "30/05/2025",
            descricao: "Criação Chatbot Próprio da Mentorial, para atender Caminhoneiros.",
            arquivos: [],
            emailNotificacoes: "christian.mentorial@gmail.com"
        },
        {
            nome: "Captura de Leads Caminhoneiros - Ebook Gratuito",
            departamento: "prospeccao",
            status: "em-andamento",
            dataInicio: "05/04/2025",
            dataConclusao: "30/05/2025",
            descricao: "Rotando tráfego pago para capturar leads caminhoneiros através de entrega de ebook gratuito.",
            arquivos: [],
            emailNotificacoes: "christian.mentorial@gmail.com"
        },
        {
            nome: "Simulador de Impostos Para Médicos, com valor no final - Tráfego Pago",
            departamento: "programacao",
            status: "pendente",
            dataInicio: "29/04/2025",
            dataConclusao: "14/05/2025",
            descricao: "Simulador de Impostos Para Médicos, com valor no final - Tráfego Pago",
            arquivos: [],
            emailNotificacoes: "christian.mentorial@gmail.com"
        },
        {
            nome: "Captura de Leads Empresas Paralisadas",
            departamento: "prospeccao",
            status: "pendente",
            dataInicio: "29/04/2025",
            dataConclusao: "14/05/2025",
            descricao: "Tráfego pago para Captura de Leads Empresas Paralisadas",
            arquivos: [],
            emailNotificacoes: "christian.mentorial@gmail.com"
        },
        {
            nome: "Contratação de Social Media Terceirizado",
            departamento: "social-media",
            status: "pendente",
            dataInicio: "01/05/2025",
            dataConclusao: "15/05/2025",
            descricao: "Análise Para Contratação de Social Media Terceirizado",
            arquivos: [],
            emailNotificacoes: "christian.mentorial@gmail.com"
        },
        {
            nome: "Repaginação Site com a ajuda da Manus",
            departamento: "design",
            status: "pendente",
            dataInicio: "01/05/2025",
            dataConclusao: "15/05/2025",
            descricao: "Repaginação Site com a ajuda da Manus",
            arquivos: [],
            emailNotificacoes: "christian.mentorial@gmail.com"
        }
    ];

    // Adicionar cada projeto ao Supabase
    let sucessos = 0;
    let falhas = 0;

    for (const projeto of projetosOriginais) {
        try {
            const { data, error } = await supabase
                .from('projetos')
                .insert([projeto])
                .select();
            
            if (error) {
                falhas++;
                console.error(`Falha ao adicionar projeto: ${projeto.nome}`, error);
            } else {
                sucessos++;
                console.log(`Projeto adicionado com sucesso: ${projeto.nome}`);
            }
        } catch (error) {
            falhas++;
            console.error(`Erro ao adicionar projeto ${projeto.nome}:`, error);
        }
    }

    console.log(`Importação concluída! Sucessos: ${sucessos}, Falhas: ${falhas}`);
    alert(`Importação de projetos concluída!\nProjetos adicionados: ${sucessos}\nFalhas: ${falhas}\n\nAtualize a página para ver os projetos.`);
    
    // Recarregar projetos
    if (sucessos > 0) {
        carregarProjetos();
    }
}
