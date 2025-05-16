// Script para o Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos do DOM
    const btnNovoProjeto = document.getElementById('btnNovoProjeto');
    const filterButtons = document.querySelectorAll('.filter-buttons .btn');
    const projetoCards = document.querySelectorAll('.projeto-card');
    const detalhesModal = document.getElementById('detalhesModal');
    const novoprojetoModal = document.getElementById('novoprojetoModal');
    const salvarProjetoBtn = document.getElementById('salvarProjeto');
    const botoesExcluir = document.querySelectorAll('.excluir-projeto');
    const emailBtnModal = document.querySelector('.modal-footer .btn-primary');
    
    // Carregar projetos do localStorage ou usar os padrões
    let projetos = [];
    
    // Tentar carregar projetos do localStorage
    const projetosArmazenados = localStorage.getItem('dashboardProjetos');
    if (projetosArmazenados) {
        projetos = JSON.parse(projetosArmazenados);
    } else {
        // Dados dos projetos padrão
        projetos = [
            {
                id: 1,
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
                id: 2,
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
                id: 3,
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
                id: 4,
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
                id: 5,
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
                id: 6,
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
                id: 7,
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
                id: 8,
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
                id: 9,
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
                id: 10,
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
                id: 11,
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
                id: 12,
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
                id: 13,
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
        
        // Salvar projetos padrão no localStorage
        localStorage.setItem('dashboardProjetos', JSON.stringify(projetos));
    }
    
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
            
            projetoCards.forEach(card => {
                if (filtro === 'todos' || card.getAttribute('data-categoria') === filtro) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Variável para armazenar o projeto atual no modal de detalhes
    let projetoAtualModal = null;
    
    // Configurar modal de detalhes
    detalhesModal.addEventListener('show.bs.modal', function(event) {
        const button = event.relatedTarget;
        const projetoId = button.getAttribute('data-projeto-id');
        const projeto = projetos.find(p => p.id == projetoId);
        
        if (projeto) {
            // Armazenar projeto atual para uso no botão de email
            projetoAtualModal = projeto;
            
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
            if (projetoAtualModal) {
                // Preparar dados para o template
                const templateParams = {
                    to_email: projetoAtualModal.emailNotificacoes,
                    projeto_nome: projetoAtualModal.nome,
                    projeto_status: projetoAtualModal.status.charAt(0).toUpperCase() + projetoAtualModal.status.slice(1).replace('-', ' '),
                    data_inicio: projetoAtualModal.dataInicio,
                    data_conclusao: projetoAtualModal.dataConclusao,
                    descricao: projetoAtualModal.descricao
                };
                
                // Mostrar indicador de carregamento
                emailBtnModal.disabled = true;
                emailBtnModal.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
                
                // Enviar email usando EmailJS
                emailjs.send('service_ej7aspa', 'template_l2gjdbw', templateParams)
                    .then(function(response) {
                        console.log('Email enviado com sucesso:', response);
                        alert(`Email enviado com sucesso para ${projetoAtualModal.emailNotificacoes}!`);
                        
                        // Restaurar botão
                        emailBtnModal.disabled = false;
                        emailBtnModal.textContent = 'Enviar por E-mail';
                    })
                    .catch(function(error) {
                        console.error('Erro ao enviar email:', error);
                        alert(`Erro ao enviar email: ${error.text}`);
                        
                        // Restaurar botão
                        emailBtnModal.disabled = false;
                        emailBtnModal.textContent = 'Enviar por E-mail';
                    });
            }
        });
    }
    
    // Configurar botão de salvar projeto
    salvarProjetoBtn.addEventListener('click', function() {
        const form = document.getElementById('novoprojetoForm');
        
        // Validar formulário
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Obter valores do formulário
        const nomeProjeto = document.getElementById('nome_projeto').value;
        const departamento = document.getElementById('departamento').value;
        const status = document.getElementById('status').value;
        const dataInicio = document.getElementById('data_inicio').value;
        const dataConclusao = document.getElementById('data_conclusao').value;
        const descricao = document.getElementById('descricao').value;
        const arquivos = document.getElementById('arquivos').value;
        const emailNotificacoes = document.getElementById('email_notificacoes').value;
        
        // Gerar ID único para o novo projeto
        const novoId = projetos.length > 0 ? Math.max(...projetos.map(p => p.id)) + 1 : 1;
        
        // Criar novo projeto
        const novoProjeto = {
            id: novoId,
            nome: nomeProjeto,
            departamento: departamento,
            status: status,
            dataInicio: formatarData(dataInicio),
            dataConclusao: formatarData(dataConclusao),
            descricao: descricao,
            arquivos: arquivos ? arquivos.split(',').map(url => url.trim()) : [],
            emailNotificacoes: emailNotificacoes
        };
        
        // Adicionar à lista de projetos
        projetos.push(novoProjeto);
        
        // Salvar no localStorage
        localStorage.setItem('dashboardProjetos', JSON.stringify(projetos));
        
        // Fechar modal
        const novoprojetoModalObj = bootstrap.Modal.getInstance(novoprojetoModal);
        novoprojetoModalObj.hide();
        
        // Notificar usuário
        alert('Projeto adicionado com sucesso! A página será recarregada para mostrar o novo projeto.');
        
        // Recarregar página para mostrar novo projeto
        location.reload();
    });
    
    // Função para formatar data
    function formatarData(dataISO) {
        if (!dataISO) return '';
        
        const data = new Date(dataISO);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        
        return `${dia}/${mes}/${ano}`;
    }
    
    // Configurar botões de exclusão de projetos
    botoesExcluir.forEach(botao => {
        botao.addEventListener('click', function() {
            const projetoId = parseInt(this.getAttribute('data-projeto-id'));
            
            // Confirmar exclusão
            if (confirm(`Tem certeza que deseja excluir este projeto?`)) {
                // Encontrar índice do projeto no array
                const projetoIndex = projetos.findIndex(p => p.id === projetoId);
                
                if (projetoIndex !== -1) {
                    // Remover projeto do array
                    const projetoRemovido = projetos.splice(projetoIndex, 1)[0];
                    
                    // Atualizar localStorage
                    localStorage.setItem('dashboardProjetos', JSON.stringify(projetos));
                    
                    // Remover card do DOM
                    const projetoCard = this.closest('.projeto-card');
                    if (projetoCard) {
                        projetoCard.remove();
                    }
                    
                    // Notificar usuário
                    alert(`Projeto "${projetoRemovido.nome}" excluído com sucesso!`);
                }
            }
        });
    });
    
    // Configurar botões de envio de email nos cards de projeto
    document.querySelectorAll('.projeto-card .btn-primary').forEach(botao => {
        if (botao.textContent.trim() === 'Enviar Email') {
            botao.title = 'Enviar notificação por email sobre este projeto';
            
            botao.addEventListener('click', function() {
                const projetoCard = this.closest('.projeto-card');
                const projetoId = parseInt(projetoCard.querySelector('.excluir-projeto').getAttribute('data-projeto-id'));
                const projeto = projetos.find(p => p.id === projetoId);
                
                if (projeto) {
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
                    botao.disabled = true;
                    botao.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
                    
                    // Enviar email usando EmailJS
                    emailjs.send('service_ej7aspa', 'template_l2gjdbw', templateParams)
                        .then(function(response) {
                            console.log('Email enviado com sucesso:', response);
                            alert(`Email enviado com sucesso para ${projeto.emailNotificacoes}!`);
                            
                            // Restaurar botão
                            botao.disabled = false;
                            botao.textContent = 'Enviar Email';
                        })
                        .catch(function(error) {
                            console.error('Erro ao enviar email:', error);
                            alert(`Erro ao enviar email: ${error.text}`);
                            
                            // Restaurar botão
                            botao.disabled = false;
                            botao.textContent = 'Enviar Email';
                        });
                }
            });
        }
    });
    
    // Renderizar projetos do localStorage
    function renderizarProjetos() {
        const container = document.querySelector('.row.row-cols-1.row-cols-md-2.row-cols-lg-3.g-4');
        
        // Limpar container
        container.innerHTML = '';
        
        // Renderizar cada projeto
        projetos.forEach(projeto => {
            // Determinar classe CSS para o card com base no departamento
            let cardClass = '';
            switch(projeto.departamento) {
                case 'programacao':
                    cardClass = 'programacao-card';
                    break;
                case 'copywriting':
                    cardClass = 'copywriting-card';
                    break;
                case 'design':
                    cardClass = 'design-card';
                    break;
                case 'social-media':
                    cardClass = 'social-media-card';
                    break;
                case 'prospeccao':
                    cardClass = 'prospeccao-card';
                    break;
                default:
                    cardClass = '';
            }
            
            // Determinar classe CSS para o status
            let statusClass = '';
            let statusText = '';
            switch(projeto.status) {
                case 'pendente':
                    statusClass = 'pendente';
                    statusText = 'Pendente';
                    break;
                case 'em-andamento':
                    statusClass = 'em-andamento';
                    statusText = 'Em Andamento';
                    break;
                case 'concluido':
                    statusClass = 'concluido';
                    statusText = 'Concluído';
                    break;
                default:
                    statusClass = '';
                    statusText = projeto.status;
            }
            
            // Criar HTML do card
            const cardHTML = `
                <div class="col projeto-card" data-categoria="${projeto.departamento}">
                    <div class="card h-100 ${cardClass}">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h5 class="card-title mb-0">${projeto.nome}</h5>
                                <span class="status-badge ${statusClass}">${statusText}</span>
                            </div>
                            <h6 class="card-subtitle mb-2 text-muted">${projeto.departamento.charAt(0).toUpperCase() + projeto.departamento.slice(1)}</h6>
                            <p class="card-text">${projeto.descricao}</p>
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <div>
                                    <button class="btn btn-primary btn-sm me-1">Enviar Email</button>
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
                </div>
            `;
            
            // Adicionar card ao container
            container.innerHTML += cardHTML;
        });
        
        // Reconfigurar event listeners para os novos elementos
        document.querySelectorAll('.excluir-projeto').forEach(botao => {
            botao.addEventListener('click', function() {
                const projetoId = parseInt(this.getAttribute('data-projeto-id'));
                
                // Confirmar exclusão
                if (confirm(`Tem certeza que deseja excluir este projeto?`)) {
                    // Encontrar índice do projeto no array
                    const projetoIndex = projetos.findIndex(p => p.id === projetoId);
                    
                    if (projetoIndex !== -1) {
                        // Remover projeto do array
                        const projetoRemovido = projetos.splice(projetoIndex, 1)[0];
                        
                        // Atualizar localStorage
                        localStorage.setItem('dashboardProjetos', JSON.stringify(projetos));
                        
                        // Remover card do DOM
                        const projetoCard = this.closest('.projeto-card');
                        if (projetoCard) {
                            projetoCard.remove();
                        }
                        
                        // Notificar usuário
                        alert(`Projeto "${projetoRemovido.nome}" excluído com sucesso!`);
                    }
                }
            });
        });
        
        // Reconfigurar botões de envio de email
        document.querySelectorAll('.projeto-card .btn-primary').forEach(botao => {
            if (botao.textContent.trim() === 'Enviar Email') {
                botao.title = 'Enviar notificação por email sobre este projeto';
                
                botao.addEventListener('click', function() {
                    const projetoCard = this.closest('.projeto-card');
                    const projetoId = parseInt(projetoCard.querySelector('.excluir-projeto').getAttribute('data-projeto-id'));
                    const projeto = projetos.find(p => p.id === projetoId);
                    
                    if (projeto) {
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
                        botao.disabled = true;
                        botao.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
                        
                        // Enviar email usando EmailJS
                        emailjs.send('service_ej7aspa', 'template_l2gjdbw', templateParams)
                            .then(function(response) {
                                console.log('Email enviado com sucesso:', response);
                                alert(`Email enviado com sucesso para ${projeto.emailNotificacoes}!`);
                                
                                // Restaurar botão
                                botao.disabled = false;
                                botao.textContent = 'Enviar Email';
                            })
                            .catch(function(error) {
                                console.error('Erro ao enviar email:', error);
                                alert(`Erro ao enviar email: ${error.text}`);
                                
                                // Restaurar botão
                                botao.disabled = false;
                                botao.textContent = 'Enviar Email';
                            });
                    }
                });
            }
        });
    }
    
    // Renderizar projetos ao carregar a página
    renderizarProjetos();
});
