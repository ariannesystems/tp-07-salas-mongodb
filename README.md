1. Punto de partida y nombre de la copia.
Nombre del trabajo: tp-07-salas-mongodb   
Punto de partida: Copia funcional del Trabajo Práctico 06 (aplicación Express con rutas, vistas, controladores y servicio en memoria intactos).   

2. Versiones utilizadas y confirmación del uso de Atlas Free (M0).
Node.js: Versión 20.6.0 o superior compatible con --env-file
Mongoose: Versión 9.11.1 para la conexión y modelado de datos.   
Entorno de base de datos: Clúster gratuito MongoDB Atlas Free (M0), operando en la nube exactamente como vimos en las clases teóricas y prácticas.

3. Pasos desde una descarga nueva: instalar dependencias, preparar el clúster gratuito, usuario e IP permitida,
copiar la plantilla de entorno y ejecutar.

Instalar dependencias: Abre la terminal en la raíz del proyecto y ejecuta: 
npm install

Instalar mongoose, biblioteca de modelado de datos para node.js y MongoDB: 
npm install mongoose

Acceso a atlas con login y crear una base de datos de MongoDB: https://account.mongodb.com/

Se creo una base de datos propia; reservas_salas_u7.   

Tener acceso a usuario de base de datos con permisos de lectura y escritura.   

En la sección de seguridad de red (Database & Network Access)->(IP Access List), configurar la dirección IP actual (o permitir acceso desde cualquier lugar con 0.0.0.0/0 para fines académicos).

Duplica el archivo de ejemplo .env.example y nombra la copia .env.   Remplaza en el archivo .env los marcadores de usuario, contraseña y host por los datos reales de la URI de conexión queproporciona Atlas.   

4. Diagnóstico DNS y resolutores usados, si hubo ajustes; comandos exactos de conexión, creación, listado,
calidad y arranque web.

Ajuste DNS: Siguiendo las recomendaciones de la clase inicial, se configuraron los servidores DNS en el módulo de conexión src/base-datos.js (dns.setServers(["8.8.8.8", "1.1.1.1"])), antes de conectar.

Comandos de comprobación útiles:

Comprobar la conexión con la base de datos:       node --env-file .env scripts/comprobar-conexion.js
Validación de una reserva sin guardar todavia:    node scripts/validar-producto.js
Crear una reserva de prueba en la base de datos:  node --env-file .env scripts/crear-reserva.js
Listar todas las reservas persistidas:            node --env-file .env scripts/listar-reservas.js

Ejecutar los controles de calidad (Prettier y ESLint):
npm run format
npm run check

Iniciar la aplicación web en memoria:  npm start

5. Mapa de archivos y explicación de esquema, modelo y colección.

El proyecto organiza sus responsabilidades de la siguiente manera:
   
   src/config/entorno.js: Centraliza la lectura de variables de configuración (como el puerto y la URI).   
   
   src/config/base-datos.js: Maneja la configuración DNS y establece la conexión segura con Mongoose.   
   
   src/modelos/reserva.js: Define el esquema de Mongoose asociado explícitamente a la colección reservas y sus reglas de validación.   
   
   scripts/ Contiene los programas independientes de terminal para comprobar la conexión, crear registros y listar la información.   

6. Campos y reglas, incluyendo límites que todavía no se controlan.

El modelo Reserva valida los siguientes campos obligatorios utilizando las reglas mínimas del dominio:
estudiante: String. Obligatorio y sin espacios en los extremos (trim).   
email:      Number Obligatorio, con trim y presencia obligatoria del carácter @.   
sala:       String. Restringido mediante enum a las opciones permitidas: [Sala Norte, Sala Sur o Sala Multimedia].   
fecha:      String. Obligatorio y no vacío tras aplicar trim.   
turno:      String. Restringido mediante enum a: [Mañana, Tarde o Noche].   
personas:   String. Obligatorio, validado como un número entero comprendido entre 1 y 6 mediante min, max y validación de enteros.   

7. Matriz de pruebas con resultados y evidencia de persistencia entre procesos.

| Caso | Resultado esperado | Resultado observado | Conteo antes / después |
| :--- | :--- | :--- | :--- |
| **Conexión válida** | Confirmación y proceso terminado | Conexión establecida correctamente y cierre limpio del proceso | N/A |
| **Fallo DNS, si ocurrió** | Registrar código/operación y solución autorizada; repetir conexión | Resolución exitosa aplicando el módulo `node:dns` con servidores autorizados | N/A |
| **Variable vacía** | Fallo de configuración; sin mensaje de éxito | Detección de ausencia de URI, finalización controlada sin éxito | N/A |
| **Contraseña incorrecta temporal** | Fallo de autenticación; sin crear documentos | Rechazo de credenciales por parte del servidor, sin anuncios de éxito | N/A |
| **Colección vacía** | Listado de cantidad 0, sin error | Listado ejecutado con éxito indicando 0 registros encontrados | Cantidad: 0 |
| **Reserva válida** | Se guarda y devuelve `_id` | Documento guardado exitosamente en Atlas, imprimiendo su `_id` | Cantidad: +1 |
| **Consulta desde proceso nuevo** | Recupera ese `_id` | Ejecución de un nuevo proceso de Node.js que recupera exactamente el mismo `_id` | Cantidad constante |
| **Segunda consulta** | No agrega registros | Listado idéntico al anterior, reflejando que no se duplicaron registros | Cantidad constante |
| **Estudiante vacío** | Rechazo, cantidad sin cambios | Validación de esquema rechaza el documento por campo requerido | Sin cambios |
| **Email sin `@`** | Rechazo, cantidad sin cambios | Validación mediante patrón/match rechaza el correo ingresado | Sin cambios |
| **Sala o turno no permitido** | Rechazo, cantidad sin cambios | Restricción por `enum` rechaza valores fuera de las opciones válidas | Sin cambios |
| **Fecha vacía** | Rechazo, cantidad sin cambios | Validación de esquema rechaza la fecha vacía tras aplicar `trim` | Sin cambios |
| **Personas 0, 7 y 2.5** | Rechazo, cantidad sin cambios | Rechazo por límites numéricos (`min`/`max`) y validación de enteros | Sin cambios |
| **Personas con texto no numérico** | Rechazo de conversión, sin escritura | Error de tipo de datos reportado por Mongoose, sin alteración en base | Sin cambios |

Al ejecutar listar-reservas.js, el sistema reporta la cantidad inicial de documentos en la colección.

Al ejecutar de forma independiente crear-reserva.js, el script se conecta, realiza la inserción del documento y arroja el ObjectId confirmado por MongoDB (por ejemplo, ObjectId('...')).

Al cerrar el programa y lanzar un proceso completamente nuevo con listar-reservas.js, se comprueba que el documento anterior sigue allí y la cantidad total aumentó en una unidad, demostrando que los datos residen de forma permanente en la nube y no dependen del ciclo de vida de la ejecución local.

8. Explicación de por qué el sitio continúa en memoria y qué se abordará en la unidad 8.

Actualmente, las rutas web de la aplicación Express y sus controladores siguen operando sobre el servicio en memoria (tal como se solicitó para esta etapa). Esto permite mantener la estabilidad del sitio mientras se construye y consolida el laboratorio de persistencia por consola. La migración de los controladores HTTP para utilizar promesas y conectar directamente las vistas con la base de datos se abordará en la unidad 8


9. Confirmación de que no se publican .env, credenciales ni datos personales.

Se confirma que no se han publicado archivos sensibles como .env, credenciales de acceso a MongoDB ni datos personales de prueba en el repositorio público. El archivo .env.example se encuentra versionado únicamente como plantilla de referencia.