/* Declaracion de los servicios de reservas */
function crearServicioReservas(reservasIniciales) {
  const reservas = [...reservasIniciales];

  //Listar todas las reservas disponibles
  function listar() {
    console.log(reservas);
    return [...reservas];
  }

  //Buscar una reserva determinada por id
  function obtenerPorId(id) {
    return reservas.find((reserva) => reserva.id === id) ?? null;
  }

  //Crear una nueva reserva
  function crear(datosValidados) {
    const ultimoId = reservas.reduce(
      (mayor, reserva) => Math.max(mayor, reserva.id),
      0,
    );
    const nuevo = { id: ultimoId + 1, ...datosValidados };
    reservas.push(nuevo);
    return nuevo;
  }
  return { listar, obtenerPorId, crear };
}
module.exports = { crearServicioReservas };
