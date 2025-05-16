// Configuração do Supabase
const SUPABASE_URL = 'SUA_URL_DO_SUPABASE';
const SUPABASE_KEY = 'SUA_CHAVE_ANONIMA_DO_SUPABASE';

// Inicialização do cliente Supabase
let supabase = null;

// Função para inicializar o Supabase
async function initSupabase() {
    if (!supabase) {
        // Carrega a biblioteca do Supabase via CDN
        await loadSupabaseScript();
        
        // Cria o cliente Supabase
        supabase = supabaseClient.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Supabase inicializado com sucesso!');
    }
    return supabase;
}

// Função para carregar o script do Supabase
function loadSupabaseScript() {
    return new Promise((resolve, reject) => {
        if (window.supabaseClient) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = () => {
            window.supabaseClient = supabase;
            resolve();
        };
        script.onerror = () => {
            reject(new Error('Falha ao carregar o script do Supabase'));
        };
        document.head.appendChild(script);
    });
}

// Funções CRUD para projetos
async function buscarProjetos() {
    const supabaseClient = await initSupabase();
    const { data, error } = await supabaseClient
        .from('projetos')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Erro ao buscar projetos:', error);
        return [];
    }
    
    return data || [];
}

async function adicionarProjeto(projeto) {
    const supabaseClient = await initSupabase();
    const { data, error } = await supabaseClient
        .from('projetos')
        .insert([projeto])
        .select();
    
    if (error) {
        console.error('Erro ao adicionar projeto:', error);
        return null;
    }
    
    return data[0];
}

async function atualizarProjeto(id, projeto) {
    const supabaseClient = await initSupabase();
    const { data, error } = await supabaseClient
        .from('projetos')
        .update(projeto)
        .eq('id', id)
        .select();
    
    if (error) {
        console.error('Erro ao atualizar projeto:', error);
        return null;
    }
    
    return data[0];
}

async function excluirProjeto(id) {
    const supabaseClient = await initSupabase();
    const { error } = await supabaseClient
        .from('projetos')
        .delete()
        .eq('id', id);
    
    if (error) {
        console.error('Erro ao excluir projeto:', error);
        return false;
    }
    
    return true;
}
