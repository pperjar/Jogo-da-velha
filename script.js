// Variáveis e Configurações Iniciais
let tabuleiro = ['', '', '', '', '', '', '', '', '']; // Tabuleiro vazio
let vezJogador = 'X'; // Começa com o jogador X
let jogoAtivo = true; // O jogo começa ativo
let placar = JSON.parse(sessionStorage.getItem('placar')) || { jogador1: 0, jogador2: 0 }; // Carrega o placar ou inicia com 0

const botoes = document.querySelectorAll('button[data-pos]');
const placarElementos = document.querySelectorAll('.placar span');

// Função para desabilitar os botões após o fim do jogo
function desabilitarBotoes() {
    botoes.forEach(botao => {
        botao.disabled = true;
    });
}

// Função para habilitar os botões novamente
function habilitarBotoes() {
    botoes.forEach(botao => {
        botao.disabled = false;
    });
}

// Função para atualizar o placar
function atualizarPlacar() {
    placarElementos[0].textContent = placar.jogador1;
    placarElementos[1].textContent = placar.jogador2;
    sessionStorage.setItem('placar', JSON.stringify(placar)); // Salva o placar no sessionStorage
}

// Função para fazer uma jogada
function jogar(posicao) {
    if (tabuleiro[posicao] || !jogoAtivo) return; // Se a célula já estiver preenchida ou o jogo estiver terminado, nada acontece

    tabuleiro[posicao] = vezJogador;
    document.querySelector(`button[data-pos='${posicao}']`).textContent = vezJogador;

    const resultado = verificarVitoria();

    if (resultado) {
        jogoAtivo = false; // Finaliza o jogo
        if (resultado === 'X') {
            placar.jogador1++;
        } else if (resultado === 'O') {
            placar.jogador2++;
        } else {
            placar.jogador1++;
            placar.jogador2++;
        }
        sessionStorage.setItem('placar', JSON.stringify(placar)); // Atualiza o placar no sessionStorage
        atualizarPlacar(); // Atualiza o placar na interface
        
        // Aguarda 2 segundos antes de desabilitar os botões e perguntar se deseja jogar novamente
        setTimeout(() => {
            desabilitarBotoes(); // Desabilita os botões
            
            // Identificar o vencedor e mostrar na mensagem de confirmação
            let vencedor = resultado === 'empate' ? 'Empate' : (resultado === 'X' ? 'Jogador 1 (X)' : 'Jogador 2 (O)');
            
            // Exibe a caixa de diálogo perguntando se o jogador quer jogar novamente, mostrando o vencedor
            if (window.confirm(`O jogo terminou! ${vencedor} ganhou. Quer jogar novamente?`)) {
                reiniciarJogo(); // Reinicia a partida sem alterar o placar
            }
        }, 2000); // Espera 2 segundos antes de mostrar a mensagem de reinício

        return;
    }

    // Alterna entre os jogadores
    vezJogador = vezJogador === 'X' ? 'O' : 'X';
}

// Função para verificar se há uma vitória
function verificarVitoria() {
    const combinacoes = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < combinacoes.length; i++) {
        const [a, b, c] = combinacoes[i];
        if (tabuleiro[a] && tabuleiro[a] === tabuleiro[b] && tabuleiro[a] === tabuleiro[c]) {
            // Se há uma vitória
            return tabuleiro[a]; // Retorna 'X' ou 'O'
        }
    }

    return tabuleiro.includes('') ? null : 'empate'; // Se não houver vitória e não houver mais espaços, é empate
}

// Função para reiniciar o jogo sem resetar o placar
function reiniciarJogo() {
    tabuleiro = ['', '', '', '', '', '', '', '', '']; // Limpa o tabuleiro
    vezJogador = 'X'; // Reseta a vez do jogador para 'X'
    jogoAtivo = true; // O jogo volta a estar ativo

    // Limpa os botões (remover texto de 'X' e 'O')
    botoes.forEach(botao => {
        botao.textContent = '';
    });

    habilitarBotoes(); // Habilita os botões novamente
}

// Adiciona o evento de clique para cada botão do tabuleiro
botoes.forEach(botao => {
    botao.addEventListener('click', (e) => {
        const posicao = e.target.dataset.pos;
        jogar(posicao);
    });
});

// Adiciona o evento para o botão de reiniciar
document.getElementById('reiniciar').addEventListener('click', reiniciarJogo);

// Inicializa o placar na interface
atualizarPlacar();