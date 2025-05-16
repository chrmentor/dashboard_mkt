// Script para o Dashboard
document.addEventListener('DOMContentLoaded', async function() {
    // Referências aos elementos do DOM
    const btnNovoProjeto = document.getElementById('btnNovoProjeto');
    const filterButtons = document.querySelectorAll('.filter-buttons .btn');
    const projetosContainer = document.querySelector('.row.row-cols-1.row-cols-md-2.row-cols-lg-3.g-4');
    const detalhesModal = document.getElementById('detalhesModal');
    const novoprojetoModal = document.getElementById('novoprojetoModal');
    const salvarProjetoBtn = document.getElementById('salvarProjeto');
    const emailBtnModal = document.querySelector('.modal-footer .btn-primary');
    const loadingIndicator = document.createElement('div');
    
    // Configurar indicador de carregamento
    loadingIndicator.className = 'text-center my-5';
    loadingIndicator.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
        </div>
        <p class="mt-2">Carregando projetos...</p>
    `;
    
    // Variável para armazenar os projetos
    let projetos = [];
    
    // Inicializar o dashboard
    inicializarDashboard();
    
    // Função para inicializar o dashboard
    async function inicializarDashboard() {
        try {
            // Mostrar indicador de carregamento
            projetosContainer.innerHTML = '';
            projetosContainer.appendChild(loadingIndicator);
            
            // Inicializar o Supabase e carregar projetos
            await initSupabase();
            await carregarProjetos();
            
            // Configurar eventos
            configurarEventos();
        } catch (error) {
            console.error('Erro ao inicializar dashboard:', error);
            projetosContainer.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-danger" role="alert">
                        Erro ao carregar projetos. Verifique suas credenciais do Supabase e tente novamente.
                    </div>
                </div>
            `;
        }
    }
    
    // Função para carregar projetos do Supabase
    async function carregarProjetos() {
        try {
            // Buscar projetos do Supabase
            projetos = await buscarProjetos();
            
            // Se não houver projetos, importar os projetos padrão
            if (projetos.length === 0) {
                await importarProjetosPadrao();
                projetos = await buscarProjetos();
            }
            
            // Renderizar projetos
            renderizarProjetos();
        } catch (error) {
            console.error('Erro ao carregar projetos:', error);
            throw error;
        }
    }
    
    // Função para importar projetos padrão para o Supabase
    async function importarProjetosPadrao() {
        const projetosPadrao = [
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
            }
        ];
        
        // Inserir projetos padrão no Supabase
        for (const projeto of projetosPadrao) {
            await adicionarProjeto(projeto);
        }
        
        console.log('Projetos padrão importados com sucesso!');
    }
    
    // Função para renderizar projetos na interface
    function renderizarProjetos() {
        // Limpar container
        projetosContainer.innerHTML = '';
        
        // Renderizar cada projeto
        projetos.forEach(projeto => {
            const projetoCard = document.createElement('div');
            projetoCard.className = 'col projeto-card';
            projetoCard.setAttribute('data-categoria', projeto.departamento);
            
            // Formatar status para exibição
            const statusFormatado = projeto.status.charAt(0).toUpperCase() + projeto.status.slice(1).replace('-', ' ');
            
            projetoCard.innerHTML = `
                <div class="card h-100 ${projeto.departamento}-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title mb-0">${projeto.nome}</h5>
                            <span class="status-badge ${projeto.status}">${statusFormatado}</span>
                        </div>
                        <h6 class="card-subtitle mb-2 text-muted">${projeto.departamento.charAt(0).toUpperCase() + projeto.departamento.slice(1)}</h6>
                        <p class="card-text">${projeto.descricao.length > 100 ? projeto.descricao.substring(0, 100) + '...' : projeto.descricao}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div>
                                <button class="btn btn-primary btn-sm me-1 btn-enviar-email" data-projeto-id="${projeto.id}">Enviar Email</button>
                                <button class="btn btn-info btn-sm text-white" data-bs-toggle="modal" data-bs-target="#detalhesModal" data-projeto-id="${projeto.id}">Ver Detalhes</button>
                            </div>
                            <button class="btn btn-danger btn-sm excluir-projeto" data-projeto-id="${projeto.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-footer bg-white border-0">
                        <small class="text-muted">Início: ${projeto.dataInicio} Fim: ${projeto.dataConclusao}</small>
                    </div>
                </div>
            `;
            
            projetosContainer.appendChild(projetoCard);
        });
        
        // Configurar eventos dos botões de excluir
        document.querySelectorAll('.excluir-projeto').forEach(botao => {
            botao.addEventListener('click', handleExcluirProjeto);
        });
        
        // Configurar eventos dos botões de enviar email
        document.querySelectorAll('.btn-enviar-email').forEach(botao => {
            botao.addEventListener('click', handleEnviarEmail);
        });
    }
    
    // Função para configurar eventos
    function configurarEventos() {
        // Configurar botão de novo projeto
        btnNovoProjeto.addEventListener('click', function() {
            // Limpar formulário
            document.getElementById('novoprojetoForm').reset();
            document.getElementById('email_notificacoes').value = "christian.mentorial@gmail.com";
            
            // Definir data atual como padrão para data de início
            const hoje = new Date().toISOString().split('T')[0];
            document.getElementById('data_inicio').value = hoje;
            
            // Mostrar modal
            const novoprojetoModalObj = new bootstrap.Modal(novoprojetoModal);
            novoprojetoModalObj.show();
        });
        
        // Configurar botões de filtro
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remover classe active de todos os botões
                filterButtons.forEach(btn => btn.classList.remove('active', 'btn-dark'));
                filterButtons.forEach(btn => {
                    if (btn.classList.contains('btn-outline-primary')) btn.classList.add('btn-outline-primary');
                    if (btn.classList.contains('btn-outline-success')) btn.classList.add('btn-outline-success');
                    if (btn.classList.contains('btn-outline-purple')) btn.classList.add('btn-outline-purple');
                    if (btn.classList.contains('btn-outline-orange')) btn.classList.add('btn-outline-orange');
                    if (btn.classList.contains('btn-outline-warning')) btn.classList.add('btn-outline-warning');
                });
                
                // Adicionar classe active ao botão clicado
                this.classList.add('active');
                if (this.classList.contains('btn-outline-primary')) {
                    this.classList.remove('btn-outline-primary');
                    this.classList.add('btn-primary');
                } else if (this.classList.contains('btn-outline-success')) {
                    this.classList.remove('btn-outline-success');
                    this.classList.add('btn-success');
                } else if (this.classList.contains('btn-outline-purple')) {
                    this.classList.remove('btn-outline-purple');
                    this.classList.add('btn-purple');
                } else if (this.classList.contains('btn-outline-orange')) {
                    this.classList.remove('btn-outline-orange');
                    this.classList.add('btn-orange');
                } else if (this.classList.contains('btn-outline-warning')) {
                    this.classList.remove('btn-outline-warning');
                    this.classList.add('btn-warning');
                } else {
                    this.classList.add('btn-dark');
                }
                
                // Filtrar projetos
                const filtro = this.getAttribute('data-filter');
                const projetoCards = document.querySelectorAll('.projeto-card');
                
                projetoCards.forEach(card => {
                    if (filtro === 'todos' || card.getAttribute('data-categoria') === filtro) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
        
        // Configurar modal de detalhes
        detalhesModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const projetoId = button.getAttribute('data-projeto-id');
            const projeto = projetos.find(p => p.id == projetoId);
            
            if (projeto) {
                // Armazenar projeto atual para uso no botão de email
                detalhesModal.setAttribute('data-projeto-atual', projetoId);
                
                const modalBody = detalhesModal.querySelector('#detalhes-conteudo');
                
                // Formatar arquivos como links
                let arquivosHtml = '';
                if (projeto.arquivos && projeto.arquivos.length > 0) {
                    arquivosHtml = '<ul>';
                    projeto.arquivos.forEach(arquivo => {
                        // Verificar se é um link para GitHub
                        if (arquivo.includes('github.com')) {
                            arquivosHtml += `<li><a href="${arquivo}" target="_blank">Ver Código no GitHub</a></li>`;
                        } 
                        // Verificar se é um link para o simulador
                        else if (arquivo.includes('manus.space')) {
                            arquivosHtml += `<li><a href="${arquivo}" target="_blank">Acessar Aplicação</a></li>`;
                        }
                        // Outros arquivos
                        else {
                            arquivosHtml += `<li><a href="${arquivo}" target="_blank">${arquivo}</a></li>`;
                        }
                    });
                    arquivosHtml += '</ul>';
                } else {
                    arquivosHtml = '<p>Nenhum arquivo disponível</p>';
                }
                
                // Preencher o conteúdo do modal
                modalBody.innerHTML = `
                    <h4>${projeto.nome}</h4>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <p><strong>Departamento:</strong> ${projeto.departamento.charAt(0).toUpperCase() + projeto.departamento.slice(1)}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Status:</strong> <span class="status-badge ${projeto.status}">${projeto.status.charAt(0).toUpperCase() + projeto.status.slice(1).replace('-', ' ')}</span></p>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <p><strong>Data de Início:</strong> ${projeto.dataInicio}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Data de Conclusão:</strong> ${projeto.dataConclusao}</p>
                        </div>
                    </div>
                    <div class="mb-3">
                        <p><strong>Descrição:</strong></p>
                        <p>${projeto.descricao}</p>
                    </div>
                    <div class="mb-3">
                        <p><strong>Arquivos:</strong></p>
                        ${arquivosHtml}
                    </div>
                    <div class="mb-3">
                        <p><strong>E-mail para Notificações:</strong> ${projeto.emailNotificacoes || 'Não configurado'}</p>
                    </div>
                `;
            }
        });
        
        // Configurar botão de enviar email no modal de detalhes
        if (emailBtnModal) {
            emailBtnModal.addEventListener('click', function() {
                const projetoId = detalhesModal.getAttribute('data-projeto-atual');
                const projeto = projetos.find(p => p.id == projetoId);
                
                if (projeto) {
                    enviarEmailProjeto(projeto);
                }
            });
        }
        
        // Configurar botão de salvar novo projeto
        salvarProjetoBtn.addEventListener('click', handleSalvarProjeto);
    }
    
    // Handler para salvar novo projeto
    async function handleSalvarProjeto() {
        // Validar formulário
        const form = document.getElementById('novoprojetoForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Desabilitar botão durante o salvamento
        salvarProjetoBtn.disabled = true;
        salvarProjetoBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';
        
        try {
            // Coletar dados do formulário
            const nomeProjeto = document.getElementById('nome_projeto').value;
            const departamento = document.getElementById('departamento').value;
            const status = document.getElementById('status').value;
            const dataInicio = formatarData(document.getElementById('data_inicio').value);
            const dataConclusao = formatarData(document.getElementById('data_conclusao').value);
            const descricao = document.getElementById('descricao').value;
            const arquivosInput = document.getElementById('arquivos').value;
            const emailNotificacoes = document.getElementById('email_notificacoes').value;
            
            // Processar arquivos (separados por vírgula ou nova linha)
            const arquivos = arquivosInput
                .split(/[\n,]/)
                .map(url => url.trim())
                .filter(url => url.length > 0);
            
            // Criar objeto do projeto
            const novoProjeto = {
                nome: nomeProjeto,
                departamento: departamento,
                status: status,
                dataInicio: dataInicio,
                dataConclusao: dataConclusao,
                descricao: descricao,
                arquivos: arquivos,
                emailNotificacoes: emailNotificacoes
            };
            
            // Salvar no Supabase
            const projetoSalvo = await adicionarProjeto(novoProjeto);
            
            if (projetoSalvo) {
                // Adicionar à lista de projetos
                projetos.push(projetoSalvo);
                
                // Renderizar projetos
                renderizarProjetos();
                
                // Fechar modal
                const modal = bootstrap.Modal.getInstance(novoprojetoModal);
                modal.hide();
                
                // Mostrar mensagem de sucesso
                alert('Projeto adicionado com sucesso!');
            } else {
                throw new Error('Erro ao salvar projeto');
            }
        } catch (error) {
            console.error('Erro ao salvar projeto:', error);
            alert('Erro ao salvar projeto. Tente novamente.');
        } finally {
            // Restaurar botão
            salvarProjetoBtn.disabled = false;
            salvarProjetoBtn.textContent = 'Salvar Projeto';
        }
    }
    
    // Handler para excluir projeto
    async function handleExcluirProjeto() {
        const projetoId = this.getAttribute('data-projeto-id');
        
        if (confirm('Tem certeza que deseja excluir este projeto?')) {
            try {
                // Desabilitar botão durante a exclusão
                this.disabled = true;
                this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
                
                // Excluir do Supabase
                const sucesso = await excluirProjeto(projetoId);
                
                if (sucesso) {
                    // Remover da lista de projetos
                    projetos = projetos.filter(p => p.id != projetoId);
                    
                    // Renderizar projetos
                    renderizarProjetos();
                    
                    // Mostrar mensagem de sucesso
                    alert('Projeto excluído com sucesso!');
                } else {
                    throw new Error('Erro ao excluir projeto');
                }
            } catch (error) {
                console.error('Erro ao excluir projeto:', error);
                alert('Erro ao excluir projeto. Tente novamente.');
                
                // Restaurar botão
                this.disabled = false;
                this.innerHTML = '<i class="bi bi-trash"></i>';
            }
        }
    }
    
    // Handler para enviar email
    function handleEnviarEmail() {
        const projetoId = this.getAttribute('data-projeto-id');
        const projeto = projetos.find(p => p.id == projetoId);
        
        if (projeto) {
            enviarEmailProjeto(projeto);
        }
    }
    
    // Função para enviar email do projeto
    function enviarEmailProjeto(projeto) {
        // Preparar dados para o template
        const templateParams = {
            to_email: projeto.emailNotificacoes,
            projeto_nome: projeto.nome,
            projeto_status: projeto.status.charAt(0).toUpperCase() + projeto.status.slice(1).replace('-', ' '),
            data_inicio: projeto.dataInicio,
            data_conclusao: projeto.dataConclusao,
            descricao: projeto.descricao
        };
        
        // Mostrar indicador de carregamento
        const emailBtn = document.querySelector(`[data-projeto-id="${projeto.id}"].btn-enviar-email`) || emailBtnModal;
        if (emailBtn) {
            emailBtn.disabled = true;
            emailBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
        }
        
        // Enviar email usando EmailJS
        emailjs.send('service_ej7aspa', 'template_l2gjdbw', templateParams)
            .then(function(response) {
                console.log('Email enviado com sucesso:', response);
                alert(`Email enviado com sucesso para ${projeto.emailNotificacoes}!`);
                
                // Restaurar botão
                if (emailBtn) {
                    emailBtn.disabled = false;
                    emailBtn.textContent = emailBtn === emailBtnModal ? 'Enviar por E-mail' : 'Enviar Email';
                }
            })
            .catch(function(error) {
                console.error('Erro ao enviar email:', error);
                alert(`Erro ao enviar email: ${error.text}`);
                
                // Restaurar botão
                if (emailBtn) {
                    emailBtn.disabled = false;
                    emailBtn.textContent = emailBtn === emailBtnModal ? 'Enviar por E-mail' : 'Enviar Email';
                }
            });
    }
    
    // Função para formatar data de YYYY-MM-DD para DD/MM/YYYY
    function formatarData(dataISO) {
        if (!dataISO) return '';
        
        const partes = dataISO.split('-');
        if (partes.length !== 3) return dataISO;
        
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
});
