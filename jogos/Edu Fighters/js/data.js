// ===== BANCO DE QUESTÕES EDUCATIVAS & FASES EXPANDIDAS =====

const PHASES = [
  // FASE 1: Matemática & Aritmética Fundamental
  {
    theme: 'space',
    questions: [
      { q: "Quanto é 12 × 8?", c: "96", o: ["96", "84", "108", "92"] },
      { q: "Qual é a raiz quadrada de 144?", c: "12", o: ["12", "14", "16", "10"] },
      { q: "Quanto é 35% de 200?", c: "70", o: ["70", "60", "75", "80"] },
      { q: "Qual o valor de x na equação 3x + 15 = 45?", c: "10", o: ["10", "15", "8", "12"] },
      { q: "Quanto é 7³ (7 ao cubo)?", c: "343", o: ["343", "243", "357", "490"] },
      { q: "Qual é o menor número primo par?", c: "2", o: ["2", "4", "0", "1"] },
      { q: "Um triângulo com lados 3, 4 e 5 tem qual área?", c: "6", o: ["6", "12", "7.5", "10"] },
      { q: "Quanto é 150 ÷ 6?", c: "25", o: ["25", "24", "30", "26"] }
    ]
  },
  // FASE 2: Biologia & Ciências da Natureza
  {
    theme: 'aurora',
    questions: [
      { q: "Qual organela é a 'usina de energia' da célula?", c: "Mitocôndria", o: ["Mitocôndria", "Ribossomo", "Lisossomo", "Complexo de Golgi"] },
      { q: "Qual gás é absorvido pelas plantas na fotossíntese?", c: "Gás Carbônico", o: ["Gás Carbônico", "Oxigênio", "Nitrogênio", "Hélio"] },
      { q: "Qual o maior órgão do corpo humano?", c: "Pele", o: ["Pele", "Fígado", "Intestino", "Cérebro"] },
      { q: "Quantos ossos tem o corpo humano adulto?", c: "206", o: ["206", "195", "215", "300"] },
      { q: "Qual célula sanguínea é responsável pela defesa imune?", c: "Leucócitos", o: ["Leucócitos", "Hemácias", "Plaquetas", "Plasma"] },
      { q: "Qual ácido nucleico carrega a informação genética celular?", c: "DNA", o: ["DNA", "ATP", "RNAm", "Lipídio"] },
      { q: "Como se chama a divisão celular que gera gametas?", c: "Meiose", o: ["Meiose", "Mitose", "Bipartição", "Osmose"] },
      { q: "Qual vaso sanguíneo leva o sangue do coração aos órgãos?", c: "Artérias", o: ["Artérias", "Veias", "Capilares", "Vênulas"] }
    ]
  },
  // FASE 3: História Geral & do Brasil
  {
    theme: 'crystal',
    questions: [
      { q: "Em que ano ocorreu a Proclamação da República no Brasil?", c: "1889", o: ["1889", "1822", "1500", "1930"] },
      { q: "Qual civilização antiga construiu as Pirâmides de Gizé?", c: "Egípcia", o: ["Egípcia", "Mesopotâmica", "Grega", "Romana"] },
      { q: "Quem assinou a Lei Áurea em 1888 no Brasil?", c: "Princesa Isabel", o: ["Princesa Isabel", "D. Pedro II", "Tiradentes", "Marechal Deodoro"] },
      { q: "Em que século iniciou a Revolução Industrial na Inglaterra?", c: "Século XVIII", o: ["Século XVIII", "Século XVI", "Século XIX", "Século XX"] },
      { q: "Qual evento histórico encerrou a Idade Média em 1453?", c: "Queda de Constantinopla", o: ["Queda de Constantinopla", "Descoberta da América", "Peste Negra", "Tratado de Tordesilhas"] },
      { q: "Em que ano acabou a Segunda Guerra Mundial?", c: "1945", o: ["1945", "1939", "1918", "1950"] },
      { q: "Qual tratado dividiu o Novo Mundo entre Portugal e Espanha em 1494?", c: "Tratado de Tordesilhas", o: ["Tratado de Tordesilhas", "Tratado de Versalhes", "Tratado de Madri", "Tratado de Utrecht"] },
      { q: "Quem foi o líder da independência da Índia pelo pacifismo?", c: "Mahatma Gandhi", o: ["Mahatma Gandhi", "Nelson Mandela", "Martin Luther King", "Che Guevara"] }
    ]
  },
  // FASE 4: Geografia & Geopolítica Global
  {
    theme: 'nebula',
    questions: [
      { q: "Qual é o maior oceano da Terra?", c: "Oceano Pacífico", o: ["Oceano Pacífico", "Oceano Atlântico", "Oceano Índico", "Oceano Ártico"] },
      { q: "Qual é o rio mais extenso do planeta?", c: "Rio Amazonas", o: ["Rio Amazonas", "Rio Nilo", "Rio Yangtzé", "Rio Mississipi"] },
      { q: "Qual é o país mais populoso do mundo atualmente?", c: "Índia", o: ["Índia", "China", "Estados Unidos", "Indonésia"] },
      { q: "Qual placa tectônica cobre a maior parte do Brasil?", c: "Placa Sul-Americana", o: ["Placa Sul-Americana", "Placa de Nazca", "Placa Africana", "Placa do Pacífico"] },
      { q: "Qual é a capital do Canadá?", c: "Ottawa", o: ["Ottawa", "Toronto", "Vancouver", "Montreal"] },
      { q: "Em qual continente localiza-se o Deserto do Saara?", c: "África", o: ["África", "Ásia", "Oceania", "América do Sul"] },
      { q: "Qual a montanha mais alta do mundo acima do nível do mar?", c: "Monte Everest", o: ["Monte Everest", "K2", "Aconcágua", "Kilimanjaro"] },
      { q: "Qual camada da atmosfera absorve a maior parte dos raios UV?", c: "Camada de Ozônio", o: ["Camada de Ozônio", "Troposfera", "Termosfera", "Exosfera"] }
    ]
  },
  // FASE 5: Física, Química & Astronomia
  {
    theme: 'blackhole',
    questions: [
      { q: "Qual é a velocidade aproximada da luz no vácuo?", c: "300.000 km/s", o: ["300.000 km/s", "150.000 km/s", "1.000.000 km/s", "30.000 km/s"] },
      { q: "Segundo a 2ª Lei de Newton, Força é igual a:", c: "Massa × Aceleração", o: ["Massa × Aceleração", "Massa ÷ Velocidade", "Trabalho × Tempo", "Energia ÷ Distância"] },
      { q: "Qual é o elemento químico mais abundante no Universo?", c: "Hidrogênio", o: ["Hidrogênio", "Hélio", "Oxigênio", "Carbono"] },
      { q: "Qual planeta do Sistema Solar possui o maior número de luas conhecidas?", c: "Saturno", o: ["Saturno", "Júpiter", "Urano", "Netuno"] },
      { q: "Qual partícula atômica possui carga elétrica negativa?", c: "Elétron", o: ["Elétron", "Próton", "Nêutron", "Pósitron"] },
      { q: "A que temperatura na escala Celsius corresponde o Zero Absoluto?", c: "-273,15 °C", o: ["-273,15 °C", "0 °C", "-100 °C", "-459,67 °C"] },
      { q: "Qual tipo de ligação química ocorre por compartilhamento de elétrons?", c: "Ligação Covalente", o: ["Ligação Covalente", "Ligação Iônica", "Ligação Metálica", "Ponte de Hidrogênio"] },
      { q: "O que é um Ano-Luz?", c: "Unidade de Distância", o: ["Unidade de Distância", "Unidade de Tempo", "Velocidade Média", "Brilho Estelar"] }
    ]
  },
  // FASE 6: Lógica, Algoritmos & Computação
  {
    theme: 'space',
    questions: [
      { q: "Quantos bits formam 1 Byte?", c: "8 bits", o: ["8 bits", "4 bits", "16 bits", "32 bits"] },
      { q: "Qual estrutura de repetição executa enquanto uma condição for verdadeira?", c: "While", o: ["While", "If-Else", "Switch", "Break"] },
      { q: "O que significa a sigla CPU em um computador?", c: "Central Processing Unit", o: ["Central Processing Unit", "Central Power Unit", "Core Program Utility", "Computer Personal Unit"] },
      { q: "Qual é o número decimal equivalente ao binário 1010?", c: "10", o: ["10", "12", "8", "14"] },
      { q: "Na lógica booleana, a porta AND só retorna VERDADEIRO se:", c: "Todas as entradas forem verdadeiras", o: ["Todas as entradas forem verdadeiras", "Pelo menos uma for verdadeira", "Todas forem falsas", "As entradas forem opostas"] },
      { q: "Qual estrutura de dados opera sob o princípio LIFO (Last-In, First-Out)?", c: "Pilha (Stack)", o: ["Pilha (Stack)", "Fila (Queue)", "Lista Encadeada", "Árvore Binária"] },
      { q: "Qual protocolo é a base da comunicação de dados na World Wide Web?", c: "HTTP / HTTPS", o: ["HTTP / HTTPS", "FTP", "SMTP", "SSH"] },
      { q: "Qual a complexidade de tempo de uma busca binária em vetor ordenado?", c: "O(log n)", o: ["O(log n)", "O(n)", "O(n²)", "O(1)"] }
    ]
  },
  // FASE 7: Língua Portuguesa, Literatura & Arte (NOVA FASE)
  {
    theme: 'crystal',
    questions: [
      { q: "Quem escreveu a obra-prima 'Dom Casmurro'?", c: "Machado de Assis", o: ["Machado de Assis", "José de Alencar", "Clarice Lispector", "Graciliano Ramos"] },
      { q: "Qual figura de linguagem expressa um exagero intencional?", c: "Hipérbole", o: ["Hipérbole", "Metáfora", "Eufemismo", "Pleonasmo"] },
      { q: "Qual movimento artístico e literário ocorreu no Brasil em 1922?", c: "Modernismo", o: ["Modernismo", "Romantismo", "Barroco", "Realismo"] },
      { q: "Na gramática, palavras que possuem o mesmo som e grafia são:", c: "Homônimas", o: ["Homônimas", "Parônimas", "Sinônimas", "Antônimas"] },
      { q: "Quem é o autor do épico renascentista 'Os Lusíadas'?", c: "Luís de Camões", o: ["Luís de Camões", "Fernando Pessoa", "Eça de Queirós", "Gil Vicente"] },
      { q: "Qual a função da linguagem focada no canal de comunicação (ex: 'Alô?')?", c: "Função Fática", o: ["Função Fática", "Função Conativa", "Função Emotiva", "Função Metalinguística"] },
      { q: "Quem pintou o célebre quadro modernista 'Abaporu'?", c: "Tarsila do Amaral", o: ["Tarsila do Amaral", "Anita Malfatti", "Candido Portinari", "Di Cavalcanti"] },
      { q: "Qual termo sintático complementa o sentido de um verbo transitivo direto?", c: "Objeto Direto", o: ["Objeto Direto", "Objeto Indireto", "Adjunto Adnominal", "Predicativo"] }
    ]
  },
  // FASE 8: Desafio Supremo do Conhecimento & Cosmos (NOVA FASE)
  {
    theme: 'blackhole',
    questions: [
      { q: "Qual teoria unifica gravidade, espaço e tempo formulada por Einstein?", c: "Relatividade Geral", o: ["Relatividade Geral", "Mecânica Quântica", "Teoria das Cordas", "Termodinâmica"] },
      { q: "Qual evento cósmico marca o nascimento estimado do Universo há 13,8 bi de anos?", c: "Big Bang", o: ["Big Bang", "Supernova Primordial", "Colapso Quântico", "Inflação Estelar"] },
      { q: "Qual é o limite em torno de um buraco negro de onde nada pode escapar?", c: "Horizonte de Eventos", o: ["Horizonte de Eventos", "Singularidade", "Ergosfera", "Disco de Acreção"] },
      { q: "Qual filósofo grego foi mestre de Platão e famoso pelo método da maiêutica?", c: "Sócrates", o: ["Sócrates", "Aristóteles", "Pitágoras", "Heráclito"] },
      { q: "Qual elemento químico possui o número atômico 79 e o símbolo Au?", c: "Ouro", o: ["Ouro", "Prata", "Cobre", "Platina"] },
      { q: "Qual é a equação mais famosa de equivalência entre massa e energia?", c: "E = mc²", o: ["E = mc²", "F = ma", "V = λf", "P = IV"] },
      { q: "Em que cidade histórica localizava-se a mais famosa biblioteca da antiguidade?", c: "Alexandria", o: ["Alexandria", "Atenas", "Roma", "Babilônia"] },
      { q: "Qual constante fundamental da física relaciona a energia de um fóton à sua frequência?", c: "Constante de Planck", o: ["Constante de Planck", "Constante Gravitacional", "Constante de Boltzmann", "Constante de Hubble"] }
    ]
  }
];

// Cartas Rogue-lite do Draft (Boons / Penalidades)
const BOONS = [
  {
    name: "Tiro Duplo",
    desc: "+1 projétil frontal por disparo.",
    penaltyDesc: "Perde 10% de cadência.",
    color: "#00f3ff",
    apply: (stats) => { stats.multiShot = (stats.multiShot || 1) + 1; },
    penalty: (stats) => { stats.fireRate = Math.min(550, stats.fireRate + 35); }
  },
  {
    name: "Munição Pesada",
    desc: "+75% de dano nos disparos.",
    penaltyDesc: "Projéteis perdem um pouco de velocidade.",
    color: "#ff3366",
    apply: (stats) => { stats.damage = +(stats.damage + 0.75).toFixed(2); },
    penalty: (stats) => { stats.damage = Math.max(0.6, +(stats.damage - 0.15).toFixed(2)); }
  },
  {
    name: "Hiperpropulsor",
    desc: "+20% de velocidade de movimento.",
    penaltyDesc: "Movimento levemente mais lento.",
    color: "#00ff88",
    apply: (stats) => { stats.moveSpeed = +(stats.moveSpeed + 0.5).toFixed(2); },
    penalty: (stats) => { stats.moveSpeed = Math.max(1.6, +(stats.moveSpeed - 0.2).toFixed(2)); }
  },
  {
    name: "Gatilho Rápido",
    desc: "+30% de velocidade de ataque.",
    penaltyDesc: "Menor cadência de tiros.",
    color: "#ffcc00",
    apply: (stats) => { stats.fireRate = Math.max(140, stats.fireRate - 80); },
    penalty: (stats) => { stats.fireRate = Math.min(550, stats.fireRate + 45); }
  },
  {
    name: "Munição Ricochete",
    desc: "Tiros quicam 1x nas bordas da tela.",
    penaltyDesc: "Sem bônus de ricochete.",
    color: "#cc00ff",
    apply: (stats) => { stats.bounce = (stats.bounce || 0) + 1; },
    penalty: (stats) => { stats.damage = Math.max(0.7, +(stats.damage - 0.1).toFixed(2)); }
  },
  {
    name: "Sifão Vampírico",
    desc: "15% de chance de recuperar vida ao acertar inimigos.",
    penaltyDesc: "Perde 0.5 de vida imediata.",
    color: "#ff0055",
    apply: (stats) => { stats.lifesteal = (stats.lifesteal || 0) + 0.15; },
    penalty: (stats) => { if (typeof lives !== 'undefined') lives = Math.max(1, lives - 0.5); }
  },
  {
    name: "Munição Perfurante",
    desc: "Tiros atravessam múltiplos inimigos na fila.",
    penaltyDesc: "Tiros perdem 10% de dano.",
    color: "#ff9900",
    apply: (stats) => { stats.pierce = true; },
    penalty: (stats) => { stats.damage = Math.max(0.6, +(stats.damage - 0.2).toFixed(2)); }
  },
  {
    name: "Reflexo Ampliado",
    desc: "+50% de janela para executar Parry perfeito.",
    penaltyDesc: "Tempo de recarga do parry ligeiramente maior.",
    color: "#00ffff",
    apply: (stats) => { stats.parryBonus = (stats.parryBonus || 0) + 5; },
    penalty: (stats) => { stats.parryBonus = Math.max(0, (stats.parryBonus || 0) - 2); }
  }
];

// Gerador Procedural de Perguntas para o Modo Infinito
function generateProceduralQuestion(sector) {
  const types = ['arithmetic', 'algebra', 'percentage', 'sqrt', 'binary', 'logic'];
  const type = types[Math.floor(Math.random() * types.length)];
  const mult = Math.max(1, Math.floor(sector / 2));

  if (type === 'arithmetic') {
    const a = (Math.floor(Math.random() * 12) + 4) * mult;
    const b = Math.floor(Math.random() * 12) + 3;
    const isMul = Math.random() < 0.5;
    if (isMul) {
      const correct = a * b;
      const o1 = correct + b;
      const o2 = correct - a;
      const o3 = correct + (Math.random() > 0.5 ? 10 : -10);
      return { q: `Calcule: ${a} × ${b} = ?`, c: `${correct}`, o: [`${correct}`, `${o1}`, `${o2}`, `${o3}`] };
    } else {
      const prod = a * b;
      const correct = a;
      const o1 = correct + 2;
      const o2 = Math.max(1, correct - 2);
      const o3 = correct + b;
      return { q: `Calcule: ${prod} ÷ ${b} = ?`, c: `${correct}`, o: [`${correct}`, `${o1}`, `${o2}`, `${o3}`] };
    }
  } else if (type === 'algebra') {
    const x = Math.floor(Math.random() * 9) + 2;
    const a = Math.floor(Math.random() * 5) + 2;
    const b = Math.floor(Math.random() * 20) + 5;
    const c = a * x + b;
    return {
      q: `Qual é o valor de x em: ${a}x + ${b} = ${c}?`,
      c: `${x}`,
      o: [`${x}`, `${x + 1}`, `${Math.max(1, x - 1)}`, `${x + 2}`]
    };
  } else if (type === 'percentage') {
    const p = [10, 20, 25, 50, 75][Math.floor(Math.random() * 5)];
    const val = (Math.floor(Math.random() * 8) + 1) * 40;
    const correct = (p * val) / 100;
    return {
      q: `Quanto é ${p}% de ${val}?`,
      c: `${correct}`,
      o: [`${correct}`, `${correct + 10}`, `${Math.max(5, correct - 10)}`, `${correct * 2}`]
    };
  } else if (type === 'sqrt') {
    const base = Math.floor(Math.random() * 12) + 4;
    const sq = base * base;
    return {
      q: `Qual é a raiz quadrada de √${sq}?`,
      c: `${base}`,
      o: [`${base}`, `${base + 2}`, `${Math.max(2, base - 2)}`, `${base + 1}`]
    };
  } else if (type === 'binary') {
    const num = Math.floor(Math.random() * 15) + 1;
    const bin = num.toString(2);
    return {
      q: `Qual é o número decimal do binário (${bin})₂?`,
      c: `${num}`,
      o: [`${num}`, `${num + 1}`, `${Math.max(1, num - 1)}`, `${num + 2}`]
    };
  } else {
    const a = Math.floor(Math.random() * 6) + 2;
    const b = Math.floor(Math.random() * 6) + 2;
    const correct = a * a + b;
    return {
      q: `Se f(x) = x² + ${b}, quanto é f(${a})?`,
      c: `${correct}`,
      o: [`${correct}`, `${correct + a}`, `${correct - b}`, `${correct + 4}`]
    };
  }
}