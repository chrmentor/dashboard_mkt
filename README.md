# Dashboard de Projetos com Supabase

Este é um dashboard de projetos com persistência de dados utilizando o Supabase como backend. O dashboard permite gerenciar projetos de diferentes departamentos, com funcionalidades completas de CRUD (Criar, Ler, Atualizar, Deletar).

## Funcionalidades

- Visualização de projetos em cards organizados
- Filtragem por departamento
- Adição de novos projetos
- Visualização detalhada de cada projeto
- Exclusão de projetos
- Envio de e-mails de notificação
- Persistência de dados no Supabase

## Configuração

### 1. Configuração do Supabase

1. Crie uma conta no [Supabase](https://supabase.com/)
2. Crie um novo projeto
3. No SQL Editor, crie uma tabela `projetos` com a seguinte estrutura:

```sql
create table projetos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  departamento text not null,
  status text not null,
  dataInicio text not null,
  dataConclusao text not null,
  descricao text,
  arquivos jsonb default '[]'::jsonb,
  emailNotificacoes text,
  created_at timestamp with time zone default now()
);

-- Habilite RLS (Row Level Security)
alter table projetos enable row level security;

-- Crie uma política que permita acesso anônimo para todas as operações
create policy "Acesso anônimo completo" on projetos
  for all
  to anon
  using (true)
  with check (true);
```

### 2. Configuração do Dashboard

1. Clone este repositório
2. Abra o arquivo `supabase.js` e atualize as credenciais:

```javascript
// Configuração do Supabase
const SUPABASE_URL = 'SUA_URL_DO_SUPABASE'; // Ex: https://abcdefghijklm.supabase.co
const SUPABASE_KEY = 'SUA_CHAVE_ANONIMA_DO_SUPABASE'; // Chave anon/public
```

3. Abra o arquivo `index.html` em seu navegador ou hospede os arquivos em um servidor web

## Estrutura do Projeto

- `index.html` - Estrutura HTML do dashboard
- `styles.css` - Estilos CSS
- `script.js` - Lógica principal do dashboard
- `supabase.js` - Configuração e funções de integração com o Supabase
- `/css` - Arquivos CSS de bibliotecas (Bootstrap, Bootstrap Icons)
- `/js` - Arquivos JavaScript de bibliotecas (EmailJS)
- `/fonts` - Fontes utilizadas (Bootstrap Icons)
- `/img` - Imagens e logos

## Tecnologias Utilizadas

- HTML, CSS e JavaScript
- Bootstrap 5
- Bootstrap Icons
- EmailJS para envio de e-mails
- Supabase para persistência de dados

## Personalização

### Configuração do EmailJS

O dashboard utiliza o EmailJS para envio de e-mails. Para configurar seu próprio serviço:

1. Crie uma conta no [EmailJS](https://www.emailjs.com/)
2. Configure um serviço de e-mail e um template
3. Atualize as credenciais no arquivo `index.html`:

```javascript
emailjs.init({
    publicKey: "SUA_CHAVE_PUBLICA_EMAILJS"
});
```

4. Atualize os IDs de serviço e template no arquivo `script.js`:

```javascript
emailjs.send('SEU_SERVICE_ID', 'SEU_TEMPLATE_ID', templateParams)
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está licenciado sob a licença MIT.
