# Ejecutar y probar Metas

## Entorno e IDE

Abre `metas/` en VS Code, Antigravity o un IDE con soporte de Node. Usa Node 24 y una base PostgreSQL de desarrollo nueva. El lockfile fija Express 5, Sequelize 6 y pg 8.

```powershell
Set-Location metas
npm ci --ignore-scripts
Copy-Item .env.example .env
# Editar DATABASE_URL con la conexión de la base de desarrollo
npm run check
npm run db:migrate
npm run db:demo
npm start
```

Abre <http://127.0.0.1:3000>. `HOST` y `PORT` permiten cambiar la interfaz y el puerto; por defecto escucha en 127.0.0.1. `npm run dev` reinicia al editar. El arranque no crea ni migra tablas: `db:migrate` es explícito. El chequeo de sintaxis tampoco abre una conexión.

`.env` contiene la conexión y queda fuera de Git. Los scripts usan la lectura nativa del entorno de Node. Las imágenes se guardan en `metas/var/uploads`, también ignorado; `METAS_UPLOAD_DIR` permite escoger otra carpeta. No se utiliza el nombre recibido como ruta del sistema.

## Esquema y ejemplos

Las ocho migraciones se ejecutan con Sequelize CLI. La última transforma la tabla creada por su predecesora: renombra `um_id` a `usuario_meta_id` y amplía `valor` a DOUBLE. No vuelve a crearla ni borra sus filas. El rollback rechaza valores decimales o fuera de rango para evitar pérdida de datos.

Se comprobaron el avance y la repetición de migraciones; no se ejecutó rollback sobre una base existente. Para una base antigua poblada, conserva un respaldo y revisa su historial antes de migrar. No se hizo reset ni migración de bases personales.

`db:demo` añade las categorías General y Frecuente si faltan, sin eliminar datos. Los seeders históricos se conservan como material, no se ejecutan automáticamente y requieren revisión antes de usarlos.

## Comprobaciones del 18 de noviembre de 2026

Se aprobaron **14 pruebas de integración en PostgreSQL 17 y otras 14 en PostgreSQL 18**, con clústeres temporales y autenticación SCRAM:

- Ocho migraciones, repetición sin volver a aplicarlas y conservación de una fila del esquema anterior.
- CRUD de productos sin foto; espacios y Unicode; campos internos excluidos de la entrada.
- Entradas inválidas e IDs mal formados/inexistentes: 400/404 y ausencia de escrituras parciales.
- PNG con nombre generado, recuperación HTTP, MIME/nosniff y limpieza al eliminar. SVG y cargas excesivas rechazados sin guardar filas/archivos.
- CRUD de clientes, categorías opcionales/válidas, email y renderizado de HTML como texto.
- Categorías vacías con cero y categorías distintas con igual descripción sin mezclarlas.
- Formularios con redirección 303 y valores conservados ante errores de validación.
- Fallos asíncronos controlados, restricciones de relación 409, health y páginas disponibles.
- Categorías de demostración repetibles, sin duplicar ni eliminar categorías existentes.

Chromium con PostgreSQL 18 comprobó CRUD de productos/clientes, búsqueda, edición con espacios, cancelar/confirmar borrado, imagen opcional y validación nativa del email. Sin excepciones JavaScript ni desbordamiento a 320/390/768 píxeles; capturas móvil/escritorio revisadas. Clústeres y servidores propios detenidos al terminar.

## Repetir las pruebas

`npm run check` valida JS y compila plantillas Pug sin ejecutar la aplicación. Las pruebas de integración requieren una base desechable nueva llamada `codex_metas_test_<nombre>` y se niegan a comenzar si ya tiene tablas. Configura solo la terminal de pruebas:

```powershell
$env:NODE_ENV = 'test'
$env:METAS_TEST_DATABASE = '1'
# DATABASE_URL debe señalar la base desechable nueva
$env:METAS_UPLOAD_DIR = Join-Path $env:TEMP ('metas-test-' + [guid]::NewGuid().ToString('N'))
npm test
```

Crea otra base nueva para repetir. Usa otra terminal para el arranque normal y conserva las pruebas fuera de bases de uso diario.

## API y validación

Envía `Accept: application/json` para JSON; el navegador usa las pantallas HTML. Los errores JSON incluyen `error`, sin stack ni detalles internos de la base.

| Método | Ruta | Uso |
| --- | --- | --- |
| GET / POST | `/api/v1/products` | Listar / crear |
| GET / PUT / DELETE | `/api/v1/products/:id` | Consultar / editar / eliminar |
| GET / POST | `/api/v1/clients` | Listar / crear |
| GET / PUT / DELETE | `/api/v1/clients/:id` | Consultar / editar / eliminar |
| GET | `/api/v1/clients/categorias` | Cantidades por categoría |
| GET | `/metas` | Consulta histórica de metas |
| GET | `/health` | Conexión a la base |

Descripción, nombre y email admiten hasta 255 caracteres; teléfono, 50. Los extremos se recortan. La categoría puede quedar vacía; un ID indicado debe existir. Se aceptan imágenes PNG/JPEG/GIF/WebP por firma, hasta 5 MB, sin recodificación completa ni análisis antivirus.

## Dependencias y límites

Se fijó uuid 11.1.1 para Sequelize por [GHSA-w5hq-g745-h8pq](https://github.com/uuidjs/uuid/security/advisories/GHSA-w5hq-g745-h8pq), conservando la API CommonJS utilizada. Se repitieron las pruebas tras el cambio. `npm audit --omit=dev` terminó con cero avisos. La auditoría completa conserva cinco avisos moderados en dependencias de Sequelize CLI (glob/minimatch y sus consumidores); quedan pendientes en la herramienta de desarrollo. No se aplicó una regresión de Sequelize para ocultarlos.

Sigue siendo un prototipo sin autenticación/autorización ni CRUD completo de usuarios/metas/categorías. Las pantallas no enlazadas y los seeders se conservan como material; no se certificaron todos los ejemplos. No se migró una base de uso real ni se desplegó en línea. El bloqueo de doble envío de la interfaz no equivale a idempotencia distribuida.
