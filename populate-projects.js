// populate-projects.js
// Script para popular o Supabase com os projetos originais
// Execute este script apenas uma vez para adicionar os projetos iniciais

// Importar as funções do supabase.js
document.addEventListener('DOMContentLoaded', function() {
  // Criar botão
  const btnPopular = document.createElement('button');
  btnPopular.textContent = 'Importar Projetos Originais';
  btnPopular.className = 'btn btn-warning';
  btnPopular.style.position = 'fixed';
  btnPopular.style.bottom = '20px';
  btnPopular.style.right = '20px';
  btnPopular.style.zIndex = '1000';
  
  // Adicionar evento de clique
  btnPopular.addEventListener('click', function() {
    if (confirm('Isso irá adicionar todos os projetos originais ao Supabase. Continuar?')) {
      populateProjects();
    }
  });
  
  // Adicionar ao corpo do documento
  document.body.appendChild(btnPopular);
});

async function populateProjects() {
  console.log("Iniciando população de projetos no Supabase...");
  
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
      const resultado = await adicionarProjeto(projeto);
      if (resultado) {
        sucessos++;
        console.log(`Projeto adicionado com sucesso: ${projeto.nome}`);
      } else {
        falhas++;
        console.error(`Falha ao adicionar projeto: ${projeto.nome}`);
      }
    } catch (error) {
      falhas++;
      console.error(`Erro ao adicionar projeto ${projeto.nome}:`, error);
    }
  }

  console.log(`População concluída! Sucessos: ${sucessos}, Falhas: ${falhas}`);
  alert(`População de projetos concluída!\nProjetos adicionados: ${sucessos}\nFalhas: ${falhas}\n\nAtualize a página para ver os projetos.`);
}
