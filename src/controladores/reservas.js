function crearControladorReservas(servicioReservas) {
  
  function listar(req, res) {
    res.status(200).render("reservas/lista", {
      titulo: "Lista de reservas",
      reservas: servicioReservas.listar(),
    });
  }

  function mostrarFormulario(req, res) {
    res.render("reservas/nueva", {
      titulo: "Nueva Reserva",
      error: null,
      valores: {},
    });
  }

  function mostrarDetalle(req, res) {
    const id = Number(req.params.id);
    const reserva = servicioReservas.obtenerPorId(id);

    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
        mensaje: "No existe una reserva con ese identificador.",
      });
    }
    res.render("reservas/detalle", {
      titulo: reserva.estudiante,
      reserva,
    });
  }

  function crear(req, res) {
    servicioReservas.crear(req.reservasValidada);
    res.redirect("/reservas");
  }

  function listarApi(req, res) {
    res.status(200).json(servicioReservas.listar());
  }

  return { listar, mostrarFormulario, mostrarDetalle, crear, listarApi };
}
module.exports = { crearControladorReservas };
