/* script.js - agenda de eventos com localStorage */

const STORAGE_KEY = 'agendaEventosIgreja_v1';
let eventos = [];

// elementos
const dataInput = document.getElementById('data');
const horaInput = document.getElementById('hora');
const nomeInput = document.getElementById('nome');
const descricaoInput = document.getElementById('descricao');
const btnAdicionar = document.getElementById('btnAdicionar');
const btnLimpar = document.getElementById('btnLimpar');
const listaEventos = document.getElementById('listaEventos');

// ----- inicialização -----
window.addEventListener('DOMContentLoaded', () => {
  carregarEventos();
  renderizarLista();
});

// ----- handlers -----
btnAdicionar.addEventListener('click', () => {
  adicionarEvento();
});

btnLimpar.addEventListener('click', () => {
  dataInput.value = '';
  horaInput.value = '';
  nomeInput.value = '';
  descricaoInput.value = '';
});

// ----- funções -----
function adicionarEvento() {
  const data = dataInput.value;
  const hora = horaInput.value;
  const nome = (nomeInput.value || '').trim();
  const descricao = (descricaoInput.value || '').trim();

  if (!data || !hora || !nome) {
    alert('Por favor, preencha data, hora e nome do evento.');
    return;
  }

  const criadoEm = new Date().toISOString();
  const dataHoraISO = new Date(`${data}T${hora}`).toISOString();

  const evento = {
    id: Date.now(),
    data,
    hora,
    dataHoraISO,
    nome,
    descricao,
    criadoEm
  };

  eventos.push(evento);
  salvarEventos();
  renderizarLista();
  dataInput.value = '';
  horaInput.value = '';
  nomeInput.value = '';
  descricaoInput.value = '';
}

function excluirEvento(id) {
  if (!confirm('Deseja realmente excluir este evento?')) return;
  eventos = eventos.filter(e => e.id !== id);
  salvarEventos();
  renderizarLista();
}

function ordenarEventos(arr) {
  return arr.slice().sort((a,b) => {
    if (a.dataHoraISO < b.dataHoraISO) return -1;
    if (a.dataHoraISO > b.dataHoraISO) return 1;
    return 0;
  });
}

function renderizarLista() {
  listaEventos.innerHTML = '';
  if (!eventos || eventos.length === 0) {
    listaEventos.innerHTML = '<p>Nenhum evento registrado.</p>';
    return;
  }

  const ordenados = ordenarEventos(eventos);
  ordenados.forEach(ev => {
    const el = document.createElement('div');
    el.className = 'evento';

    const d = new Date(ev.dataHoraISO);
    const dataFormat = d.toLocaleDateString();
    const horaFormat = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    const left = document.createElement('div');
    left.className = 'evento-left';
    left.innerHTML = `
      <h3>${escapeHtml(ev.nome)}</h3>
      <p><strong>${dataFormat} às ${horaFormat}</strong> ${ev.descricao ? ' | ' + escapeHtml(ev.descricao) : ''}</p>
      <small>Cadastrado em: ${new Date(ev.criadoEm).toLocaleString()}</small>
    `;

    const actions = document.createElement('div');
    actions.className = 'event-actions';
    actions.innerHTML = `
      <button class="edit" onclick="preencherEdicao(${ev.id})">Editar</button>
      <button onclick="excluirEvento(${ev.id})">Excluir</button>
    `;

    el.appendChild(left);
    el.appendChild(actions);
    listaEventos.appendChild(el);
  });
}

function preencherEdicao(id) {
  const ev = eventos.find(x => x.id === id);
  if (!ev) return;
  dataInput.value = ev.data;
  horaInput.value = ev.hora;
  nomeInput.value = ev.nome;
  descricaoInput.value = ev.descricao;

  eventos = eventos.filter(x => x.id !== id);
  salvarEventos();
  renderizarLista();
}

// localStorage
function salvarEventos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eventos));
  } catch(e) {
    console.error('Erro ao salvar eventos:', e);
  }
}

function carregarEventos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    eventos = raw ? JSON.parse(raw) : [];
  } catch(e) {
    console.error('Erro ao carregar eventos:', e);
    eventos = [];
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
