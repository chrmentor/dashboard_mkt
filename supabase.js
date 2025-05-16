// Configuração do Supabase
const SUPABASE_URL = 'https://uvnhezzprjzlqkogcobl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2bmhlenpwcmp6bHFrb2djb2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MzE2MTAsImV4cCI6MjA2MzAwNzYxMH0.Juzb-P4iblp8EMZk-PToF3S0WGFbMpSM5Cb8X41MCh0';

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
