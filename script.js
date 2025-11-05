// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC3VHl-Wha92546ZVKcomw_TG5krxiYud4",
  authDomain: "agenda-igreja1.firebaseapp.com",
  databaseURL: "https://agenda-igreja1-default-rtdb.firebaseio.com/",
  projectId: "agenda-igreja1",
  storageBucket: "agenda-igreja1.firebasestorage.app",
  messagingSenderId: "739972842851",
  appId: "1:739972842851:web:bc40bc958ffcd9dcd3ff56"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Referências aos elementos HTML
const form = document.getElementById("formEvento");
const listaEventos = document.getElementById("listaEventos");

// Função para adicionar evento
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;
  const descricao = document.getElementById("descricao").value;

  if (nome && data && hora && descricao) {
    const novoEvento = { nome, data, hora, descricao };
    db.ref("eventos").push(novoEvento);
    form.reset();
  }
});

// Função para exibir os eventos
db.ref("eventos").on("value", (snapshot) => {
  listaEventos.innerHTML = "";
  snapshot.forEach((childSnapshot) => {
    const evento = childSnapshot.val();
    const item = document.createElement("div");
    item.classList.add("evento");
    item.innerHTML = `
      <h3>${evento.nome}</h3>
      <p><strong>Data:</strong> ${evento.data} | <strong>Hora:</strong> ${evento.hora}</p>
      <p>${evento.descricao}</p>
      <hr>
    `;
    listaEventos.appendChild(item);
  });
});
