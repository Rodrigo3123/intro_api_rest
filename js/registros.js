const API_URL = "https://68bb0df284055bce63f10639.mockapi.io/api/v1/dispositivos_IoT";
const tabla10 = document.getElementById("tablaRegistros10");
const ultimoStatusGrande = document.getElementById("ultimoStatusGrande");

// Cargar últimos 10 registros ordenados por ID descendente
async function cargarRegistros10() {
  try {
    let res = await fetch(API_URL);
    let data = await res.json();

    // Ordenar por ID descendente (el mayor ID primero)
    data.sort((a, b) => b.id - a.id);

    // Mostrar el último status (registro con mayor ID)
    if (data.length > 0) {
      ultimoStatusGrande.innerHTML = `Último status: <span class="text-success">${data[0].status}</span>`;
    }

    // Tomar solo los 10 más recientes
    let ultimos = data.slice(0, 10);

    // Limpiar tabla
    tabla10.innerHTML = "";
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
      tabla10.innerHTML += fila;
    });
  } catch (error) {
    console.error("Error cargando registros:", error);
  }
}

// Polling cada 2 segundos
setInterval(cargarRegistros10, 2000);

// Carga inicial
cargarRegistros10();

