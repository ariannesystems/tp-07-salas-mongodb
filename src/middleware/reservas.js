/*-----------------------------------------CREACION DE 3 MIDDLEWARE PERSONALIZADOS----------------------------------*/

//MIDDLEWARE: Indica en que seccion se esta procesando la solicitud
function prepararAreaReservas(req, res, next) {
  res.locals.seccion = "Reservas de salas de estudio";
  console.log("Sección: " + res.locals.seccion);
  next();
}

//MIDDLEWARE: Comprueba que los datos de la reservas sean correctos antes de continuar
function validarReservas(req, res, next) {
  req.body = req.body || {};

  const estudiante = String(req.body.estudiante ?? "").trim();
  const email = String(req.body.email ?? "").trim();
  const sala = String(req.body.sala ?? "").trim();
  const fecha = String(req.body.fecha ?? "").trim();
  const turno = String(req.body.turno ?? "").trim();
  const personas = Number(req.body.personas);

  const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
  const turnos = ["Mañana", "Tarde", "Noche"];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !estudiante ||
    !email ||
    !emailRegex.test(email) ||
    !salasPermitidas.includes(sala) ||
    !fecha ||
    !turnos.includes(turno) ||
    !Number.isInteger(personas) ||
    personas < 1 ||
    personas > 6
  ) {
    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva reservas",
      error:
        "Completá todos los campos con valores válidos y seleccioná los valores permitidos.",
      valores: req.body,
    });
  }
  req.reservasValidada = { estudiante, email, sala, fecha, turno, personas };
  next();
}

module.exports = { prepararAreaReservas, validarReservas };
