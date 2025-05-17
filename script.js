// Script principal para o Dashboard com Supabase
// Versão com visual original arredondado e efeitos de hover

// Configuração do Supabase
const SUPABASE_URL = 'https://uvnhezzprjzlqkogcobl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2bmhlenpwcmp6bHFrb2djb2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MzE2MTAsImV4cCI6MjA2MzAwNzYxMH0.Juzb-P4iblp8EMZk-PToF3S0WGFbMpSM5Cb8X41MCh0';

// Inicialização do cliente Supabase
let supabaseClient = null;

// Variáveis globais
let projetosFiltrados = [];
let departamentoAtivo = 'todos';
let projetosCarregados = false;

// Função para obter o nome do site atual dinamicamente
function getSiteName() {
    return window.location.hostname || 'Dashboard de Projetos';
}

// Funções para o modal customizado
function showCustomModal(title, message) {
    const modal = document.getElementById('customModal');
    const modalTitle = document.getElementById('customModalTitle');
    const modalMessage = document.getElementById('customModalMessage');
    
    // Usar o domínio atual dinamicamente
    modalTitle.textContent = title || `${getSiteName()} diz`;
    modalMessage.textContent = message || '';
    
    modal.classList.add('show');
    
    // Adicionar evento de clique ao botão OK
    document.getElementById('customModalButton').onclick = function() {
        hideCustomModal();
    };
    
    // Fechar modal ao clicar fora dele
    modal.onclick = function(event) {
        if (event.target === modal) {
            hideCustomModal();
        }
    };
}

function hideCustomModal() {
    const modal = document.getElementById('customModal');
    modal.classList.remove('show');
}

// Elementos DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM carregado, inicializando dashboard...");
    console.log("Site atual:", getSiteName());
    
    // Inicializar Supabase
    try {
        // Usando a variável global supabase
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("Cliente Supabase inicializado com sucesso");
    } catch (error) {
        console.error("Erro ao inicializar Supabase:", error);
        document.getElementById('projetos-container').innerHTML = 
            `<div class="col-12"><div class="alert alert-danger">Erro ao inicializar Supabase. Verifique o console para mais detalhes.</div></div>`;
        return;
    }

    const projetosContainer = document.getElementById('projetos-container');
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    const btnNovoProjeto = document.getElementById('btnNovoProjeto');
    const btnImportarProjetos = document.getElementById('btnImportarProjetos');
    
    // Garantir que os elementos modais existem antes de inicializá-los
    const novoprojetoModalElement = document.getElementById('novoprojetoModal');
    const detalhesModalElement = document.getElementById('detalhesModal');
    
    // Inicializar modais do Bootstrap
    let novoprojetoModal, detalhesModal;
    
    if (novoprojetoModalElement) {
        novoprojetoModal = new bootstrap.Modal(novoprojetoModalElement);
        console.log("Modal de novo projeto inicializado");
    } else {
        console.error("Elemento modal de novo projeto não encontrado");
    }
    
    if (detalhesModalElement) {
        detalhesModal = new bootstrap.Modal(detalhesModalElement);
        console.log("Modal de detalhes inicializado");
    } else {
        console.error("Elemento modal de detalhes não encontrado");
    }

    // Carregar projetos
    carregarProjetos();
    
    // Configurar filtros - CORREÇÃO: Remover event listeners antigos e adicionar novos
    filterButtons.forEach(button => {
        // Remover event listeners antigos para evitar duplicação
        const oldButton = button.cloneNode(true);
        button.parentNode.replaceChild(oldButton, button);
        
        // Adicionar novo event listener
        oldButton.addEventListener('click', function() {
            console.log(`Filtro clicado: ${this.getAttribute('data-filter')}`);
            
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'btn-dark', 'btn-primary', 'btn-success', 'btn-purple', 'btn-orange', 'btn-warning');
                
                // Restaurar classes originais dos botões
                if (btn.getAttribute('data-filter') === 'todos') {
                    btn.classList.add('btn-outline-dark');
                } else if (btn.getAttribute('data-filter') === 'programacao') {
                    btn.classList.add('btn-outline-primary');
                } else if (btn.getAttribute('data-filter') === 'copywriting') {
                    btn.classList.add('btn-outline-success');
                } else if (btn.getAttribute('data-filter') === 'design') {
                    btn.classList.add('btn-outline-purple');
                } else if (btn.getAttribute('data-filter') === 'social-media') {
                    btn.classList.add('btn-outline-orange');
                } else if (btn.getAttribute('data-filter') === 'prospeccao') {
                    btn.classList.add('btn-outline-warning');
                }
            });
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            // Adicionar classe de cor sólida ao botão ativo
            if (this.getAttribute('data-filter') === 'todos') {
                this.classList.remove('btn-outline-dark');
                this.classList.add('btn-dark');
            } else if (this.getAttribute('data-filter') === 'programacao') {
                this.classList.remove('btn-outline-primary');
                this.classList.add('btn-primary');
            } else if (this.getAttribute('data-filter') === 'copywriting') {
                this.classList.remove('btn-outline-success');
                this.classList.add('btn-success');
            } else if (this.getAttribute('data-filter') === 'design') {
                this.classList.remove('btn-outline-purple');
                this.classList.add('btn-purple');
            } else if (this.getAttribute('data-filter') === 'social-media') {
                this.classList.remove('btn-outline-orange');
                this.classList.add('btn-orange');
            } else if (this.getAttribute('data-filter') === 'prospeccao') {
                this.classList.remove('btn-outline-warning');
                this.classList.add('btn-warning');
            }
            
            // Atualizar departamento ativo e filtrar projetos
            departamentoAtivo = this.getAttribute('data-filter');
            filtrarProjetos();
        });
    });
    
    // Configurar botão de novo projeto
    if (btnNovoProjeto) {
        btnNovoProjeto.addEventListener('click', () => {
            console.log("Botão Novo Projeto clicado");
            document.getElementById('novoprojetoForm').reset();
            novoprojetoModal.show();
        });
        console.log("Listener do botão Novo Projeto configurado");
    } else {
        console.error("Botão Novo Projeto não encontrado");
    }
    
    // Configurar botão de salvar projeto
    const btnSalvarProjeto = document.getElementById('salvarProjeto');
    if (btnSalvarProjeto) {
        btnSalvarProjeto.addEventListener('click', salvarProjeto);
        console.log("Listener do botão Salvar Projeto configurado");
    } else {
        console.error("Botão Salvar Projeto não encontrado");
    }
    
    // Configurar botão de importar projetos
    if (btnImportarProjetos) {
        btnImportarProjetos.addEventListener('click', () => {
            console.log("Botão Importar Projetos clicado");
            if (confirm('Isso irá adicionar todos os projetos originais ao Supabase. Continuar?')) {
                importarProjetosOriginais();
            }
        });
        console.log("Listener do botão Importar Projetos configurado");
    } else {
        console.error("Botão Importar Projetos não encontrado");
    }
    
    // Expor funções globalmente para uso nos botões inline
    window.mostrarDetalhes = mostrarDetalhes;
    window.excluirProjeto = excluirProjeto;
    window.enviarEmail = enviarEmail;
});

// Função para enviar email (simulada)
function enviarEmail(email) {
    console.log(`Enviando email para: ${email}`);
    showCustomModal(null, `Email enviado com sucesso para ${email}!`);
}

// Funções CRUD
async function carregarProjetos() {
    const projetosContainer = document.getElementById('projetos-container');
    try {
        console.log("Carregando projetos do Supabase...");
        if (!supabaseClient) {
            throw new Error("Cliente Supabase não inicializado");
        }
        
        const { data, error } = await supabaseClient
            .from('projetos')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            throw error;
        }
        
        console.log(`${data ? data.length : 0} projetos carregados`);
        
        if (data && data.length > 0) {
            projetosFiltrados = data;
            projetosCarregados = true;
            filtrarProjetos();
        } else {
            projetosContainer.innerHTML = '<div class="col-12"><div class="alert alert-info">Nenhum projeto encontrado. Clique em "Novo Projeto" para adicionar ou use o botão "Importar Projetos Originais".</div></div>';
        }
    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        projetosContainer.innerHTML = `<div class="col-12"><div class="alert alert-danger">Erro ao carregar projetos. Verifique suas credenciais do Supabase e tente novamente.</div></div>`;
    }
}

// CORREÇÃO: Função salvarProjeto corrigida para garantir compatibilidade com o Supabase
async function salvarProjeto() {
    console.log("Função salvarProjeto iniciada");
    try {
        const nome = document.getElementById('nome_projeto').value;
        const departamento = document.getElementById('departamento').value;
        const status = document.getElementById('status').value;
        const dataInicio = document.getElementById('data_inicio').value;
        const dataConclusao = document.getElementById('data_conclusao').value;
        const descricao = document.getElementById('descricao').value;
        const arquivosText = document.getElementById('arquivos').value;
        const emailNotificacoes = document.getElementById('email_notificacoes').value;
        
        console.log("Valores dos campos:", {
            nome, departamento, status, dataInicio, dataConclusao, 
            descricao, arquivosText, emailNotificacoes
        });
        
        // Validar campos obrigatórios
        if (!nome || !departamento || !status || !dataInicio || !dataConclusao || !descricao || !emailNotificacoes) {
            console.log("Validação falhou: campos obrigatórios não preenchidos");
            showCustomModal(null, 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Processar arquivos - CORREÇÃO: Garantir que arquivos seja sempre um array, mesmo vazio
        let arquivos = [];
        if (arquivosText && arquivosText.trim() !== '') {
            arquivos = arquivosText.split(/[,\n]/).map(url => url.trim()).filter(url => url);
        }
        console.log("Arquivos processados:", arquivos);
        
        // Formatar datas para exibição - CORREÇÃO: Garantir formato correto
        const dataInicioFormatada = formatarData(dataInicio);
        const dataConclusaoFormatada = formatarData(dataConclusao);
        console.log("Datas formatadas:", { dataInicioFormatada, dataConclusaoFormatada });
        
        const novoProjeto = {
            nome: nome.trim(),
            departamento: departamento.trim(),
            status: status.trim(),
            dataInicio: dataInicioFormatada,
            dataConclusao: dataConclusaoFormatada,
            descricao: descricao.trim(),
            arquivos: arquivos,
            emailNotificacoes: emailNotificacoes.trim()
        };
        
        console.log("Objeto novoProjeto completo:", novoProjeto);
        
        // CORREÇÃO: Usar upsert em vez de insert para maior compatibilidade
        console.log("Enviando para Supabase...");
        const { data, error } = await supabaseClient
            .from('projetos')
            .upsert([novoProjeto])
            .select();
        
        if (error) {
            console.error("ERRO DETALHADO DO SUPABASE:", error);
            throw error;
        }
        
        console.log("Projeto salvo com sucesso:", data);
        
        const novoprojetoModal = bootstrap.Modal.getInstance(document.getElementById('novoprojetoModal'));
        novoprojetoModal.hide();
        
        // Mostrar mensagem de sucesso com modal customizado
        showCustomModal(null, `Projeto "${nome}" adicionado com sucesso!`);
        
        // Recarregar projetos após salvar
        setTimeout(() => {
            carregarProjetos();
        }, 500);
    } catch (error) {
        console.error('Erro ao salvar projeto:', error);
        showCustomModal(null, 'Erro ao salvar projeto. Por favor, tente novamente.');
    }
}

async function excluirProjeto(id) {
    console.log(`Excluindo projeto ID: ${id}`);
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
        try {
            const { error } = await supabaseClient
                .from('projetos')
                .delete()
                .eq('id', id);
            
            if (error) {
                throw error;
            }
            
            // Mostrar mensagem de sucesso com modal customizado
            showCustomModal(null, 'Projeto excluído com sucesso!');
            
            carregarProjetos();
        } catch (error) {
            console.error('Erro ao excluir projeto:', error);
            showCustomModal(null, 'Erro ao excluir projeto. Por favor, tente novamente.');
        }
    }
}

function mostrarDetalhes(projeto) {
    console.log("Mostrando detalhes do projeto:", projeto.nome);
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
    
    console.log(`Filtrando projetos por departamento: ${departamentoAtivo}`);
    const projetosFiltradosPorDepartamento = departamentoAtivo === 'todos' 
        ? projetosFiltrados 
        : projetosFiltrados.filter(projeto => projeto.departamento === departamentoAtivo);
    
    renderizarProjetos(projetosFiltradosPorDepartamento);
}

function renderizarProjetos(projetos) {
    console.log(`Renderizando ${projetos.length} projetos`);
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
                    <div class="departamento">${getDepartamentoLabel(projeto.departamento)}</div>
                    <p class="card-text">${projeto.descricao.substring(0, 100)}${projeto.descricao.length > 100 ? '...' : ''}</p>
                    <div class="card-actions">
                        <button class="btn-email" onclick="enviarEmail('${projeto.emailNotificacoes}')">
                            <i class="bi bi-envelope"></i> Enviar Email
                        </button>
                        <button class="btn-detalhes" onclick='mostrarDetalhes(${JSON.stringify(projeto).replace(/"/g, "&quot;")})'>
                            <i class="bi bi-eye"></i> Ver Detalhes
                        </button>
                        <button class="btn-excluir" onclick="excluirProjeto('${projeto.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-footer bg-transparent">
                    <div class="datas">
                        Início: ${projeto.dataInicio} Fim: ${projeto.dataConclusao}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function getStatusLabel(status) {
    switch (status) {
        case 'pendente': return 'Pendente';
        case 'em-andamento': return 'Em Andamento';
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

// CORREÇÃO: Função formatarData melhorada para garantir formato correto
function formatarData(dataISO) {
    if (!dataISO) return '';
    
    try {
        // Verificar se é uma data válida
        const data = new Date(dataISO);
        if (isNaN(data.getTime())) {
            // Se não for uma data válida, tentar formato DD/MM/YYYY
            const partes = dataISO.split('/');
            if (partes.length === 3) {
                return dataISO; // Já está no formato DD/MM/YYYY
            }
            return '';
        }
        
        // Converter de YYYY-MM-DD para DD/MM/YYYY
        const partes = dataISO.split('-');
        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
        
        // Fallback: retornar a data original se não conseguir formatar
        return dataISO;
    } catch (e) {
        console.error("Erro ao formatar data:", e);
        return dataISO; // Retornar a data original em caso de erro
    }
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
            console.log(`Importando projeto: ${projeto.nome}`);
            // CORREÇÃO: Usar upsert em vez de insert para maior compatibilidade
            const { data, error } = await supabaseClient
                .from('projetos')
                .upsert([projeto])
                .select();
            
            if (error) {
                throw error;
            }
            
            if (data) {
                sucessos++;
                console.log(`Projeto importado com sucesso: ${projeto.nome}`);
            }
        } catch (error) {
            falhas++;
            console.error(`Erro ao importar projeto ${projeto.nome}:`, error);
        }
    }

    console.log(`Importação concluída! Sucessos: ${sucessos}, Falhas: ${falhas}`);
    
    // Mostrar mensagem de sucesso com modal customizado
    showCustomModal(null, `Importação concluída! Projetos adicionados: ${sucessos}, Falhas: ${falhas}`);
    
    // Recarregar projetos após importação
    if (sucessos > 0) {
        carregarProjetos();
    }
}
