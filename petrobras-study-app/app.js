const STORAGE_KEY = 'petroprova-state-v1';

const examInsights = {
  totalQuestoesAnalisadas: 180,
  padraoBanca: [
    'Enunciados contextualizados com situações industriais reais.',
    'Cobrança forte de interpretação técnica + norma aplicada.',
    'Distratores próximos: exige atenção a unidades e conceitos.',
    'Matemática com foco em regra de três, porcentagem e leitura de gráfico.',
  ],
  distribuicao: {
    'END': 25,
    'Corrosão': 20,
    'Soldagem': 15,
    'Metrologia': 12,
    'Materiais': 10,
    'Português': 10,
    'Matemática': 8,
  }
};

const studyContent = {
  'END': {
    conceitos: ['LP', 'PM', 'US', 'Partículas Magnéticas'],
    resumo: 'Cesgranrio costuma cobrar princípio físico do ensaio, aplicabilidade e limitações.',
    exemplo: 'Líquido penetrante detecta descontinuidades abertas à superfície em materiais não porosos.'
  },
  'Corrosão': {
    conceitos: ['Pilha eletroquímica', 'Proteção catódica', 'Taxa de corrosão'],
    resumo: 'Foco em mecanismos (uniforme, pite, galvânica) e métodos de mitigação.',
    exemplo: 'Par galvânico entre metais distintos acelera corrosão no metal menos nobre.'
  },
  'Soldagem': {
    conceitos: ['ZTA', 'Defeitos de solda', 'Processos SMAW/MIG/TIG'],
    resumo: 'Questões frequentes sobre parâmetros, descontinuidades e inspeção de juntas.',
    exemplo: 'Aumento de aporte térmico pode ampliar a ZTA e alterar propriedades mecânicas.'
  },
  'Metrologia': {
    conceitos: ['Paquímetro', 'Micrômetro', 'Incerteza de medição'],
    resumo: 'A banca cobra leitura de instrumentos e conversões de unidades.',
    exemplo: 'Erro sistemático compromete exatidão, mesmo com boa repetibilidade.'
  }
};

const questions = [
  {
    id: 1,
    materia: 'Corrosão',
    tema: 'Proteção catódica',
    dificuldade: 'Média',
    enunciado: 'A proteção catódica por corrente impressa tem como objetivo principal:',
    alternativas: [
      'Aumentar a resistência mecânica do aço.',
      'Reduzir o potencial de corrosão da estrutura.',
      'Eliminar a necessidade de pintura.',
      'Promover anodização da superfície.',
      'Elevar a dureza superficial do metal.'
    ],
    correta: 1,
    explicacao: 'A proteção catódica desloca o potencial eletroquímico para reduzir a corrosão.'
  },
  {
    id: 2,
    materia: 'END',
    tema: 'Líquido Penetrante',
    dificuldade: 'Fácil',
    enunciado: 'O ensaio por líquido penetrante é indicado para detectar:',
    alternativas: [
      'Falhas internas profundas.',
      'Descontinuidades superficiais abertas.',
      'Composição química da peça.',
      'Dureza superficial por deformação.',
      'Tensões residuais internas.'
    ],
    correta: 1,
    explicacao: 'O método revela descontinuidades abertas na superfície.'
  },
  {
    id: 3,
    materia: 'Matemática',
    tema: 'Porcentagem',
    dificuldade: 'Fácil',
    enunciado: 'Uma taxa de corrosão caiu de 5 mm/ano para 4 mm/ano. A redução percentual foi de:',
    alternativas: ['10%', '15%', '20%', '25%', '30%'],
    correta: 2,
    explicacao: 'Redução = 1/5 = 20%.'
  },
  {
    id: 4,
    materia: 'Português',
    tema: 'Interpretação',
    dificuldade: 'Média',
    enunciado: 'Em textos técnicos, a função principal de gráficos e tabelas é:',
    alternativas: [
      'Substituir o texto integralmente.',
      'Decorar visualmente o documento.',
      'Sintetizar dados e apoiar argumentação.',
      'Eliminar a necessidade de revisão.',
      'Reduzir o rigor técnico.'
    ],
    correta: 2,
    explicacao: 'A função é apoiar compreensão de dados e argumentos.'
  },
  {
    id: 5,
    materia: 'Soldagem',
    tema: 'Defeitos',
    dificuldade: 'Difícil',
    enunciado: 'A falta de fusão em juntas soldadas pode ser causada por:',
    alternativas: [
      'Corrente de soldagem inadequada e técnica incorreta.',
      'Excesso de limpeza da junta.',
      'Uso de gás inerte puro sempre.',
      'Metal base sem revestimento.',
      'Baixa espessura da peça em todas as situações.'
    ],
    correta: 0,
    explicacao: 'Parâmetros e execução inadequados são causas típicas da falta de fusão.'
  }
];

const defaultState = {
  temaEscuro: false,
  tempoEstudoMin: 320,
  resolvidas: {},
  acertosPorMateria: {
    'Corrosão': { acertos: 2, total: 5 },
    'END': { acertos: 8, total: 11 },
    'Soldagem': { acertos: 8, total: 10 },
    'Metrologia': { acertos: 3, total: 6 },
  },
  revisao: [1, 5],
};

let state = loadState();

function loadState() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch {
    return defaultState;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const screens = [
  'dashboard','radar','estudo','questoes','treino','simulado','ia','revisao','simulado-inteligente'
];

function renderTabs() {
  const tabs = document.getElementById('tabs');
  tabs.innerHTML = screens.map((id, i) => `<button class="${i===0?'active':''}" data-target="${id}">${document.getElementById(id).dataset.screen}</button>`).join('');
  tabs.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      screens.forEach(s => document.getElementById(s).classList.toggle('hidden', s !== btn.dataset.target));
    });
  });
}

function totalAccuracy() {
  const items = Object.values(state.acertosPorMateria);
  const acertos = items.reduce((a, c) => a + c.acertos, 0);
  const total = items.reduce((a, c) => a + c.total, 0);
  return total ? Math.round((acertos / total) * 100) : 0;
}

function recommendedSubjects() {
  return Object.entries(state.acertosPorMateria)
    .map(([materia, v]) => ({ materia, pct: (v.acertos / v.total) * 100 }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 3);
}

function renderDashboard() {
  const recs = recommendedSubjects();
  document.getElementById('dashboard').innerHTML = `
    <h2>Dashboard</h2>
    <div class="kpi-grid">
      <div class="kpi"><strong>${totalAccuracy()}%</strong><br/>Taxa de acerto</div>
      <div class="kpi"><strong>${state.tempoEstudoMin} min</strong><br/>Tempo de estudo</div>
      <div class="kpi"><strong>${Object.keys(state.resolvidas).length}</strong><br/>Questões resolvidas</div>
      <div class="kpi"><strong>${state.revisao.length}</strong><br/>Pendentes de revisão</div>
    </div>
    <h3>Estudar hoje</h3>
    <ul class="list">${recs.map(r => `<li>${r.materia} (${Math.round(r.pct)}%)</li>`).join('')}</ul>
    <div class="progress"><div style="width:${Math.min(100, state.tempoEstudoMin / 6)}%"></div></div>
    <p class="small">Meta diária: 60 min</p>
  `;
}

function renderRadar() {
  const r = examInsights.distribuicao;
  const bars = Object.entries(r)
    .map(([k,v]) => `<p><span class="badge">${k}</span>${v}%<div class="progress"><div style="width:${v}%"></div></div></p>`)
    .join('');
  document.getElementById('radar').innerHTML = `
    <h2>Radar da Prova (Cesgranrio)</h2>
    <p class="small">Base: ${examInsights.totalQuestoesAnalisadas} questões de provas anteriores.</p>
    ${bars}
    <h3>Padrões da banca</h3>
    <ul class="list">${examInsights.padraoBanca.map(p=>`<li>${p}</li>`).join('')}</ul>
  `;
}

function renderEstudo() {
  document.getElementById('estudo').innerHTML = `
    <h2>Modo Estudo</h2>
    ${Object.entries(studyContent).map(([materia, c]) => `
      <article class="question">
        <h3>${materia}</h3>
        <p><strong>Conceitos principais:</strong> ${c.conceitos.join(', ')}</p>
        <p><strong>Resumo focado:</strong> ${c.resumo}</p>
        <p><strong>Exemplo prático:</strong> ${c.exemplo}</p>
      </article>
    `).join('')}
  `;
}

function renderQuestionList(targetId, list) {
  document.getElementById(targetId).innerHTML = list.map(q => `
    <article class="question">
      <div><span class="badge">${q.materia}</span><span class="badge">${q.tema}</span><span class="badge">${q.dificuldade}</span></div>
      <p><strong>Q${q.id}.</strong> ${q.enunciado}</p>
      ${q.alternativas.map((a, i) => `<label class="alt"><input type="radio" name="q-${targetId}-${q.id}" value="${i}"/> ${a}</label>`).join('')}
      <button class="primary" data-check="${targetId}" data-qid="${q.id}">Responder</button>
      <p id="res-${targetId}-${q.id}" class="small"></p>
    </article>
  `).join('');

  document.querySelectorAll(`button[data-check="${targetId}"]`).forEach(btn => {
    btn.addEventListener('click', () => checkAnswer(targetId, Number(btn.dataset.qid), list));
  });
}

function checkAnswer(targetId, qid, list) {
  const q = list.find(x => x.id === qid);
  const selected = document.querySelector(`input[name="q-${targetId}-${qid}"]:checked`);
  const box = document.getElementById(`res-${targetId}-${qid}`);
  if (!selected) {
    box.textContent = 'Selecione uma alternativa.';
    return;
  }
  const correct = Number(selected.value) === q.correta;
  box.textContent = correct ? `✅ Correta! ${q.explicacao}` : `❌ Incorreta. ${q.explicacao}`;
  state.resolvidas[qid] = correct;
  if (!correct && !state.revisao.includes(qid)) state.revisao.push(qid);
  saveState();
  renderDashboard();
  renderIA();
  renderRevisao();
}

function renderQuestoes() {
  document.getElementById('questoes').innerHTML = '<h2>Banco de Questões</h2><p class="small">Organizadas por matéria, tema e dificuldade.</p><div id="questoes-list"></div>';
  renderQuestionList('questoes-list', questions);
}

function renderTreino() {
  const temas = [...new Set(questions.map(q => q.materia))];
  document.getElementById('treino').innerHTML = `
    <h2>Modo Treino</h2>
    <p>Escolha o tema:</p>
    ${temas.map(t => `<button class="badge" data-tema="${t}">${t}</button>`).join('')}
    <div id="treino-list" style="margin-top:.6rem"></div>
  `;
  document.querySelectorAll('[data-tema]').forEach(b => {
    b.addEventListener('click', () => renderQuestionList('treino-list', questions.filter(q => q.materia === b.dataset.tema)));
  });
}

function renderSimulado() {
  document.getElementById('simulado').innerHTML = `
    <h2>Simulado (60 questões / 4h)</h2>
    <p class="small">Estrutura: 10 Português, 10 Matemática, 40 Técnicas.</p>
    <button class="primary" id="startSimulado">Iniciar simulado rápido (demo)</button>
    <p id="timer" class="small"></p>
    <p id="score" class="small"></p>
  `;
  document.getElementById('startSimulado').addEventListener('click', startSimulado);
}

function startSimulado() {
  let seconds = 30;
  const timer = document.getElementById('timer');
  const score = document.getElementById('score');
  timer.textContent = 'Cronômetro: 00:30';
  const int = setInterval(() => {
    seconds--;
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    timer.textContent = `Cronômetro: ${mm}:${ss}`;
    if (seconds <= 0) {
      clearInterval(int);
      score.textContent = `Resultado final (demo): ${totalAccuracy()}% de acerto estimado.`;
    }
  }, 1000);
}

function renderIA() {
  const items = Object.entries(state.acertosPorMateria)
    .map(([m, v]) => ({ m, pct: Math.round((v.acertos / v.total) * 100) }))
    .sort((a,b) => a.pct - b.pct);
  document.getElementById('ia').innerHTML = `
    <h2>IA de Estudo</h2>
    ${items.map(i => `<p>${i.m} → <strong>${i.pct}%</strong></p>`).join('')}
    <p><strong>Recomendação:</strong> Estudar ${items[0].m} e ${items[1].m} nos próximos blocos.</p>
  `;
}

function renderRevisao() {
  const wrong = questions.filter(q => state.revisao.includes(q.id));
  document.getElementById('revisao').innerHTML = `
    <h2>Revisão Inteligente (Repetição espaçada)</h2>
    <p class="small">Priorizando conteúdos com maior erro.</p>
    <ul class="list">${wrong.map(q => `<li>${q.materia} - ${q.tema} (Q${q.id})</li>`).join('') || '<li>Nenhum erro pendente.</li>'}</ul>
  `;
}

function renderSimuladoInteligente() {
  document.getElementById('simulado-inteligente').innerHTML = `
    <h2>Simulado Inteligente</h2>
    <p>Gera automaticamente mais questões das matérias com menor desempenho.</p>
    <button class="primary" id="smartBtn">Gerar Simulado Inteligente</button>
    <p id="smartResult" class="small"></p>
  `;
  document.getElementById('smartBtn').addEventListener('click', () => {
    const weak = recommendedSubjects();
    document.getElementById('smartResult').textContent = `Simulado criado com foco em: ${weak.map(w => w.materia).join(', ')}.`;
  });
}

function setupTheme() {
  document.body.classList.toggle('dark', state.temaEscuro);
  const btn = document.getElementById('themeToggle');
  btn.textContent = state.temaEscuro ? '☀️' : '🌙';
  btn.addEventListener('click', () => {
    state.temaEscuro = !state.temaEscuro;
    saveState();
    setupTheme();
  });
}

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js');
  }
}

function init() {
  renderTabs();
  renderDashboard();
  renderRadar();
  renderEstudo();
  renderQuestoes();
  renderTreino();
  renderSimulado();
  renderIA();
  renderRevisao();
  renderSimuladoInteligente();
  setupTheme();
  registerSW();
}

init();
