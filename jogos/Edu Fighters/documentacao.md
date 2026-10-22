# Documentação: EDU FIGHTER — Ritmo Ajustado

Esta documentação fornece uma visão geral completa sobre a estrutura, variáveis, funções e componentes do arquivo `index.html` do jogo **Edu Fighter**.

---

## 1. Estrutura Visual e Componentes (HTML/CSS)

O jogo ocorre dentro da div `#game-container`, que abriga todas as telas (menus) e o elemento `<canvas>` usado para renderizar o jogo. A navegação entre as telas é feita alternando a classe CSS `.hidden`.

### Telas Principais (`.screen`)
- **`#screen-title`**: Menu principal do jogo com botões para as outras seções.
- **`#screen-powers`**: Menu de seleção de poderes (ex: Sandevistan, Nova Shield, Sukuna, etc.).
- **`#screen-phases`**: Menu de seleção de fases (Matemática, Ciências, História, Geografia e Misto).
- **`#screen-boss`**: Menu para o modo *Boss Rush* (enfrentar chefões diretamente).
- **`#screen-shop`**: Loja para compra de vidas extras, escudos e poderes.
- **`#screen-codes`**: Tela de resgate de códigos secretos e cheats.
- **`#screen-options`**: Tela com as instruções e controles do jogo.
- **`#screen-highscore`**: Tela que exibe o ranking de pontuações (Top 10).
- **`#screen-phaseclear`**: Tela exibida ao concluir uma fase (antes de um Boss).
- **`#screen-gameover`**: Tela final de Vitória ou Derrota, mostrando a pontuação final.

### Elementos da HUD (Interface durante o Jogo)
- **`#hud`**: Container superior com as informações principais do jogador (Pontuação, Fase atual, Barra de vida e Quantidade de usos do Poder).
- **`#question-box`**: Caixa que exibe a pergunta atual da fase.
- **`#super-bar-container`**: Barra de carregamento do especial (usada principalmente para o poder Sandevistan).
- **`#boss-name` & `#boss-hp-wrap`**: Interface exibida apenas durante batalhas contra chefes (nome e barra de vida).
- **`#c`**: O Canvas HTML (`<canvas>`) responsável pela renderização dos gráficos 2D.

---

## 2. Variáveis Globais e Estado do Jogo

- **Progresso e Configuração:**
  - `coins`: Moedas obtidas no jogo, usadas na loja (Salvo no `localStorage`).
  - `unlockedPowers`: Array contendo os nomes dos poderes desbloqueados.
  - `phasesDone`: Acompanha o número de fases que o jogador já completou.
  - `ranking`: Histórico das melhores pontuações (`localStorage`).
  - `adminMode`: Flag booleana ativada por código secreto, libera tudo e dá invencibilidade.
  - `shopLife`, `shopShield`: Vidas e escudo extras adquiridos na loja.

- **Estado da Partida:**
  - `gameState`: Controla o loop principal (`MENU`, `PLAYING`, `BOSS`).
  - `score`, `lives`, `maxLives`: Pontuação e vida atuais do jogador.
  - `currentPhaseIdx`, `qIndex`, `currentPhaseData`, `currentQuestion`, `theme`: Váriaveis que controlam a progressão de perguntas da fase atual.
  - `bossMode`, `isMiniBoss`, `currentBoss`: Variáveis ativadas no final das fases ou no menu de Boss.

- **Variáveis de Entidades e Efeitos:**
  - `bullets`, `enemies`, `bossBullets`, `particles`, `minions`, `slashes`, `cherries`, `lasers`, `afterimages`: Arrays que armazenam todas as entidades ativas na tela para atualização a cada frame.
  - `player`: Objeto contendo coordenadas (`x, y`), tamanho, tempo de invulnerabilidade (`invuln`) e cooldown do tiro (`lastShot`).

---

## 3. Principais Funções e Suas Ações

### Controle e Áudio
- **`initAudio()`**: Inicializa o contexto de áudio nativo do navegador no primeiro clique do usuário.
- **`playSound(t)`**: Sintetizador embutido. Reproduz sons baseados em ondas procedurais (ex: *shoot*, *hit*, *wrong*, *super*, *slash*, *clear*).

### Persistência e UI
- **`save()`**: Salva variáveis de progresso (Moedas, Poderes, Fases, Rank) no `localStorage`.
- **`updateUI()`**: Atualiza botões e travas visuais no menu baseando-se no progresso e modo administrador.
- **`showScreen(id)`**: Oculta todas as telas e exibe a tela desejada pelo `id`.
- **`renderShop()`**: Gera dinamicamente a lista de itens da loja com base no dinheiro e poderes adquiridos.
- **`buy(id, price)`**: Realiza transações na loja se o jogador tiver moedas suficientes.
- **`redeemCode()`**: Lida com códigos digitados (`lordotavio` = Admin, `resetall` = Limpar Progresso, etc.).
- **`renderRank()`**: Desenha a lista do top 10 na tela de *Highscore*.
- **`updateLifeBar()`, `updateBossHp()`, `updatePowerUI()`**: Funções auxiliares para atualizar as barras de progresso visuais.

### Lógica de Fase
- **`startPhase(idx)`**: Prepara os status, reseta as entidades e carrega a fase escolhida na array `PHASES`.
- **`loadNextQuestion()`**: Carrega a próxima pergunta, distribui as opções (como inimigos) na tela e atualiza os marcadores. Caso não haja mais perguntas, chama o `startMiniBoss()`.
- **`onCorrect()`**: Chamada quando o jogador atira na opção correta. Ganha pontos, moedas, enche a barra de *Super* e avança para a próxima etapa.
- **`loseLife(r)`**: Chamada quando o jogador erra uma pergunta ou quando deixa a resposta correta sair da tela. Subtrai vida.
- **`endGame(win, msg)`**: Finaliza a partida atual (Vitória/Derrota), salva pontuações, destranca recompensas e retorna aos menus.

### Lógica de Batalha de Chefes (Bosses)
- **`startMiniBoss()`**: Configura e inicializa a versão fraca de um Boss, servindo como desafio final de uma fase.
- **`tryBoss(idx)` / `startRealBoss(idx)`**: Inicia as batalhas exclusivas do menu de Chefes, onde eles têm seus HP totais.
- **`bossAttack()`**: Motor de ataques padronizados do chefe. Puxa do `attackIndex` qual ataque deverá ser disparado em loop.
- **`drawBoss(b)`**: Desenha os diferentes chefões proceduralmente (usando o Context API do HTML Canvas) conforme seus nomes/fases.

### Lógica de Habilidades
- **`activateShield()`**: (Tecla E) Ativa um escudo bloqueador focado em Chefes, se o item estiver comprado.
- **`activateSuper()`**: (Tecla Shift) Ativa o Especial selecionado. Lida com: congelar/retardar o tempo (*Sandevistan*, *The World*), invocar lasers (*Opala*), ou invocar domínio (*Sukuna*).
- **`subAbility(k)`**: Processa as teclas Z, X, C exclusivas da expansão de domínio (*Sukuna*), gerando cortes e danos em área.

### Renderização (Game Loop)
- **`loop(t)`**: **Coração do Jogo**. Roda através do `requestAnimationFrame`. Funcionalidades que executa em cada frame:
  1. Calcula a diferença de tempo (`dt`).
  2. Limpa e desenha o background chamando `drawBackground(t)`.
  3. Controla a movimentação do Player com limite de bordas.
  4. Lida com efeitos de desfoque de velocidade (`afterimages`).
  5. Atualiza a física de todas as instâncias (tiros, inimigos, minúsculos, lasers, bosses).
  6. Realiza validações de colisão com as caixas delimitadoras (*Bounding Boxes*).
  7. Solicita o próximo frame repetindo o ciclo.
- **`drawBackground(t)`**: Renderiza belos efeitos espaciais (nebulosas, auroras, buraco negro) de acordo com o `theme` da fase atual.

---

Este arquivo centraliza em um só lugar todo o motor gráfico, estado e estilos do jogo, sem depender de scripts, imagens externas ou engines como Phaser ou Unity. Tudo é processado puramente via Canvas API, Math.random e manipulação direta do DOM.
