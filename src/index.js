const { leerConfiguracion } = require("./config/entorno");
const { crearServicioReservas } = require("./servicios/reservas");
const { crearApp } = require("./app");

const reservasIniciales = [
  {
    id: 1,
    estudiante: "Juan Pérez",
    email: "juan@gmail.com",
    sala: "Sala Norte",
    fecha: "05/09/2026",
    turno: "Mañana",
    personas: 2,
  },
  {
    id: 2,
    estudiante: "María López",
    email: "maria@gmail.com",
    sala: "Sala Sur",
    fecha: "26/09/2026",
    turno: "Tarde",
    personas: 4,
  },
  {
    id: 3,
    estudiante: "Carlos Gómez",
    email: "carlos@gmail.com",
    sala: "Sala Multimedia",
    fecha: "27/09/2026",
    turno: "Noche",
    personas: 3,
  },
  {
    id: 4,
    estudiante: "Ana Rodríguez",
    email: "ana@gmail.com",
    sala: "Sala Norte",
    fecha: "28/09/2026",
    turno: "Mañana",
    personas: 1,
  },
];

//Funcion principal de inicio
async function main() {
  //Leer configuración
  const { puerto, formatoRegistro } = leerConfiguracion();
  //Leemos el archivo JSON de reservas iniciales
  const servicioReservas = crearServicioReservas(reservasIniciales);
  const app = crearApp({ servicioReservas, formatoRegistro });

  //Servidor escuchando listo para las peticiones
  app.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
  });
}
main().catch((error) => {
  console.error("No se pudo iniciar la aplicación:", error);
  process.exitCode = 1;
});
