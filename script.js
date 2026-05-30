// Variáveis de estado (simulação de produção e tecnologia)
let campoStats = {
    colheitasTon: 1240,      // toneladas atuais
    produtividade: 92,      // percentual
};

let cidadeStats = {
    alimentosRecebidos: 890,   // toneladas acumuladas na cidade (mercado)
    inovacaoIndex: 78,         // indice de inovação (tecnologia aplicada ao campo)
};

let historicoMensagens = [];   // armazenar logs customizados (não obrigatório, mas sincronizaremos com DOM)

// Elementos DOM
const colheitasEl = document.getElementById('colheitasQtde');
const produtividadeEl = document.getElementById('produtividade');
const alimentosRecebidosEl = document.getElementById('alimentosRecebidos');
const inovacaoIndexEl = document.getElementById('inovacaoIndex');
const integracaoBar = document.getElementById('integracaoBar');
const integracaoPercentualSpan = document.getElementById('integracaoPercentual');
const logContainer = document.getElementById('logContainer');

// Função para atualizar todos os displays de números e barra de integração
function atualizarInterface() {
    colheitasEl.innerText = campoStats.colheitasTon;
    produtividadeEl.innerText = `${campoStats.produtividade}%`;
    alimentosRecebidosEl.innerText = cidadeStats.alimentosRecebidos;
    inovacaoIndexEl.innerText = `${cidadeStats.inovacaoIndex}%`;

    // Cálculo do índice de integração: média ponderada entre o quanto a cidade absorveu e a tecnologia do campo
    // Quanto mais alimentos foram recebidos e maior a inovação, maior integração.
    // Valores de referência máximos: alimentos recebidos até 2500 ton, inovação até 100
    let maxAlimentosRef = 2500;
    let fatorAlimentos = Math.min(cidadeStats.alimentosRecebidos / maxAlimentosRef, 1);
    let fatorInovacao = cidadeStats.inovacaoIndex / 100;
    // incluir produtividade do campo como fator de força
    let fatorProdutividade = campoStats.produtividade / 100;
    let integracao = Math.round(((fatorAlimentos * 0.5) + (fatorInovacao * 0.3) + (fatorProdutividade * 0.2)) * 100);
    integracao = Math.min(integracao, 100);
    integracaoBar.style.width = `${integracao}%`;
    integracaoPercentualSpan.innerText = `${integracao}%`;
}

// Função para adicionar mensagem no log (histórico)
function adicionarLog(mensagem, tipo = 'info') {
    // tipo pode ser 'success', 'system', 'info'
    const logDiv = document.createElement('div');
    logDiv.className = `log-entry ${tipo === 'success' ? 'success-msg' : (tipo === 'system' ? 'system-msg' : 'info-msg')}`;
    let icon = '<i class="fas fa-leaf"></i>';
    if (tipo === 'success') icon = '<i class="fas fa-check-circle"></i>';
    if (tipo === 'info') icon = '<i class="fas fa-info-circle"></i>';
    if (tipo === 'system') icon = '<i class="fas fa-sync-alt"></i>';
    logDiv.innerHTML = `${icon} <span>${mensagem}</span>`;
    logContainer.prepend(logDiv);   // mostra as últimas no topo
    if (logContainer.children.length > 12) {
        logContainer.removeChild(logContainer.lastChild);
    }
    // Opcional: guardar em array para limpeza futura, mas limparLog remove todos
}

// Função para limpar todo o histórico (mas manter mensagem inicial sistêmica opcional)
function limparHistorico() {
    while (logContainer.firstChild) {
        logContainer.removeChild(logContainer.firstChild);
    }
    // Adiciona mensagem padrão de sistema limpo
    adicionarLog("📋 Histórico de conexões limpo. Nova jornada de integração campo-cidade!", "system");
}

// Evento: Enviar produção do campo para cidade
function enviarProducaoCampoCidade() {
    // Simula o envio de toneladas baseado na colheita atual e produtividade
    let toneladasEnviadas = Math.floor(campoStats.colheitasTon * 0.12 + 8); // entre 8% e 20% da colheita atual
    if (toneladasEnviadas <= 0) toneladasEnviadas = 15;
    if (toneladasEnviadas > campoStats.colheitasTon) toneladasEnviadas = campoStats.colheitasTon;
    
    // Atualiza stats: campo perde toneladas (vende / distribui), cidade recebe
    campoStats.colheitasTon = Math.max(0, campoStats.colheitasTon - toneladasEnviadas);
    cidadeStats.alimentosRecebidos += toneladasEnviadas;
    
    // A produtividade do campo aumenta levemente com base na experiência + feedback da cidade (melhorias)
    let incrementoProd = Math.floor(Math.random() * 3) + 1; // 1 a 3%
    campoStats.produtividade = Math.min(100, campoStats.produtividade + incrementoProd);
    
    // A inovação da cidade também aumenta ao receber alimentos pois estimula tecnologia em logística
    let inovGain = Math.floor(Math.random() * 4) + 1;
    cidadeStats.inovacaoIndex = Math.min(100, cidadeStats.inovacaoIndex + inovGain);
    
    atualizarInterface();
    adicionarLog(`🚜🌽 ENVIO CAMPO → CIDADE: ${toneladasEnviadas} toneladas de alimentos enviadas! Campo ganhou +${incrementoProd}% produtividade. Cidade aumentou inovação em +${inovGain}%.`, 'success');
    
    // Verifica se o campo está com pouca produção, sugerir suporte da cidade
    if (campoStats.colheitasTon < 800) {
        adicionarLog(`⚠️ Campo está com estoque reduzido (${campoStats.colheitasTon} t). Que tal a cidade enviar tecnologias para fortalecer a produção?`, 'info');
    }
}

// Evento: Cidade envia tecnologia e inovação para o campo
function enviarTecnologiaCidadeCampo() {
    // Tecnologia aumenta produtividade e colheita potencial
    let aumentoProdutividade = Math.floor(Math.random() * 8) + 4; // 4% a 11%
    let novaProducaoExtra = Math.floor(Math.random() * 60) + 20; // 20 a 80 toneladas
    
    // A cidade gasta um pouco do seu índice de inovação? Mas aqui usamos como recurso compartilhado, então inovação pode diminuir levemente se enviar muito, mas fortalecer vínculo.
    let custoInovacao = Math.floor(aumentoProdutividade / 3);
    let inovacaoAntes = cidadeStats.inovacaoIndex;
    cidadeStats.inovacaoIndex = Math.max(50, cidadeStats.inovacaoIndex - custoInovacao);
    
    // Campo recebe benefícios
    campoStats.produtividade = Math.min(100, campoStats.produtividade + aumentoProdutividade);
    campoStats.colheitasTon += novaProducaoExtra;
    
    atualizarInterface();
    adicionarLog(`💡📡 TECNOLOGIA DA CIDADE → CAMPO: +${aumentoProdutividade}% produtividade e +${novaProducaoExtra} toneladas! Inovação urbana investida (-${custoInovacao} pontos).`, 'info');
    
    // Se a cidade ficar com inovação baixa, mensagem motivacional
    if (cidadeStats.inovacaoIndex < 65) {
        adicionarLog(`🌆 Cidade sugere novo intercâmbio: recebendo mais alimentos do campo, podemos revitalizar a inovação!`, 'system');
    }
}

// Simular Grande Colheita (evento do campo)
function simularGrandeColheita() {
    let colheitaExtra = Math.floor(Math.random() * 180) + 80; // 80 a 260 toneladas
    campoStats.colheitasTon += colheitaExtra;
    let bonusProd = Math.floor(Math.random() * 5) + 1;
    campoStats.produtividade = Math.min(100, campoStats.produtividade + bonusProd);
    atualizarInterface();
    adicionarLog(`🌾🌿 GRANDE COLHEITA! Campo produz +${colheitaExtra} toneladas e +${bonusProd}% de eficiência. Fortalecendo toda cadeia!`, 'success');
}

// Inovação Acelerada (evento cidade)
function inovacaoAcelerada() {
    let ganhoInovacao = Math.floor(Math.random() * 15) + 6; // 6 a 20%
    cidadeStats.inovacaoIndex = Math.min(100, cidadeStats.inovacaoIndex + ganhoInovacao);
    // A cidade também pode repassar parte da inovação para o campo automaticamente através de parceria
    let repasseCampo = Math.floor(ganhoInovacao * 0.5);
    campoStats.produtividade = Math.min(100, campoStats.produtividade + repasseCampo);
    atualizarInterface();
    adicionarLog(`⚡🏙️ INOVAÇÃO URBANA ACELERADA! +${ganhoInovacao}% tecnologia na cidade, e campo recebe +${repasseCampo}% de produtividade via parceria.`, 'success');
}

// Configurar eventos e listeners
function inicializarEventos() {
    // Botões principais de transferência
    const botoesEnviar = document.querySelectorAll('.enviar-btn');
    botoesEnviar.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const origem = btn.getAttribute('data-origem');
            if (origem === 'campo') {
                enviarProducaoCampoCidade();
            } else if (origem === 'cidade') {
                enviarTecnologiaCidadeCampo();
            }
        });
    });
    
    // Botão limpar log
    const clearLogBtn = document.getElementById('limparLogBtn');
    if (clearLogBtn) clearLogBtn.addEventListener('click', limparHistorico);
    
    // Botões ações rápidas
    const simularColheita = document.getElementById('simularColheitaBtn');
    const inovacaoUrbana = document.getElementById('inovacaoUrbanaBtn');
    if (simularColheita) simularColheita.addEventListener('click', simularGrandeColheita);
    if (inovacaoUrbana) inovacaoUrbana.addEventListener('click', inovacaoAcelerada);
}

// Carrega informações iniciais de boas-vindas e estatísticas
function iniciarDemo() {
    atualizarInterface();
    inicializarEventos();
    // Adicionar log inicial amigável mostrando conexão ativa.
    adicionarLog(`🌍🌱 Agro Forte: Integração ativa! Use os botões para trocar recursos e fortalecer campo ↔ cidade.`, 'system');
}

// Iniciar tudo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', iniciarDemo);
