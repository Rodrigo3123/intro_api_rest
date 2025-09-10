const API_URL = "https://68bb0df284055bce63f10639.mockapi.io/api/v1/dispositivos_IoT";
const tabla = document.getElementById("tablaRegistros");
const form = document.getElementById("formStatus");
const ultimoStatus = document.getElementById("ultimoStatus");

// Obtener IP pública del cliente
async function getIP() {
  try {
    let res = await fetch("https://api.ipify.org?format=json");
    let data = await res.json();
    return data.ip;
  } catch (error) {
    console.error("Error obteniendo IP:", error);
    return "0.0.0.0";
  }
}

// 🔹 Función para convertir "8/9/2025, 12:07:36 p.m." en objeto Date
function parseFecha(fechaStr) {
  if (!fechaStr) return new Date(0);

  // Separar fecha y hora
  let [fecha, hora] = fechaStr.split(", ");
  let [dia, mes, anio] = fecha.split("/").map(Number);

  // Separar hora en partes
  let [h, m, sPart] = hora.split(":");
  let segundos = parseInt(sPart.split(" ")[0]);
  let periodo = sPart.includes("p.m.") ? "PM" : "AM";

  h = parseInt(h);
  m = parseInt(m);

  // Convertir a formato 24h
  if (periodo === "PM" && h < 12) h += 12;
  if (periodo === "AM" && h === 12) h = 0;

  return new Date(anio, mes - 1, dia, h, m, segundos);
}

// Cargar últimos 5 registros (más recientes primero)
async function cargarRegistros() {
  try {
    let res = await fetch(API_URL);
    let data = await res.json();

    // Ordenar de más reciente a más antiguo usando parseFecha
    data.sort((a, b) => parseFecha(b.date) - parseFecha(a.date));

    // Tomar solo los 5 más nuevos
    let ultimos = data.slice(0, 5);

    // Limpiar tabla
    tabla.innerHTML = "";
    ultimos.forEach(reg => {
      let fila = `
        <tr>
          <td>${reg.id}</td>
          <td>${reg.name}</td>
          <td>${reg.status}</td>
          <td>${reg.ip}</td>
          <td>${reg.date}</td>
        </tr>
      `;
      tabla.innerHTML += fila;
    });

    // Mostrar último status
    if (ultimos.length > 0) {
      ultimoStatus.innerHTML = `Último status: <strong>${ultimos[0].status}</strong>`;
    }
  } catch (error) {
    console.error("Error cargando registros:", error);
  }
}

// Enviar nuevo comando
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let status = document.getElementById("status").value;
  let ip = await getIP();

  let nuevoRegistro = {
    name: "Dispositivo IoT",
    status: status,
    ip: ip,
    date: new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" })
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoRegistro)
    });

    form.reset();
    cargarRegistros();
  } catch (error) {
    console.error("Error enviando registro:", error);
  }
});

// Inicialización
cargarRegistros();
