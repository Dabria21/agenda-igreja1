
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyC3VHl-Wha92546ZVKcomw_TG5krxiYud4",
  authDomain: "agenda-igreja1.firebaseapp.com",
  projectId: "agenda-igreja1",
  storageBucket: "agenda-igreja1.firebasestorage.app",
  messagingSenderId: "739972842851",
  appId: "1:739972842851:web:bc40bc958ffcd9dcd3ff56"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const btnAdicionar = document.getElementById("adicionar");
const lista = document.getElementById("lista-eventos");

btnAdicionar.addEventListener("click", () => {
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;
  const descricao = document.getElementById("descricao").value;

  if (data && hora && descricao) {
    push(ref(db, "eventos"), {
      data,
      hora,
      descricao
    });

    document.getElementById("data").value = "";
    document.getElementById("hora").value = "";
    document.getElementById("descricao").value = "";
  }
});


onValue(ref(db, "eventos"), (snapshot) => {
  lista.innerHTML = "";
  const eventos = [];

  snapshot.forEach((childSnapshot) => {
    eventos.push(childSnapshot.val());
  });

  eventos.sort((a, b) => new Date(`${a.data} ${a.hora}`) - new Date(`${b.data} ${b.hora}`));

  eventos.forEach((evento) => {
    const li = document.createElement("li");
    li.textContent = `${evento.data} ${evento.hora} — ${evento.descricao}`;
    lista.appendChild(li);
  });
});
