# Metas: productos y clientes

Ejercicio de Node.js con Express, Sequelize y PostgreSQL. La aplicación mantenida está en [`metas/`](metas/); conserva el esquema y los materiales originales del curso.

- CRUD de productos y clientes, con JSON y formularios HTML.
- Imágenes opcionales, nombres generados y límite de 5 MB.
- Búsqueda, edición sin recargar la página y confirmación de borrado.
- Interfaz en español adaptable a móvil y accesible mediante teclado.
- Cantidades de clientes por categoría, incluidas las categorías vacías.

## Ejecutar

Usa Node 24 y crea una base PostgreSQL de desarrollo nueva. Desde `metas`:

```powershell
npm ci --ignore-scripts
Copy-Item .env.example .env
# Editar DATABASE_URL en .env
npm run check
npm run db:migrate
npm run db:demo
npm start
```

Abre <http://127.0.0.1:3000>. Las categorías de demostración se añaden sin borrar datos existentes; no se crean usuarios ni contraseñas de ejemplo.

Consulta [RUNNING.md](RUNNING.md) para configurar el IDE, las pruebas con PostgreSQL 17/18 y los límites. Es un prototipo local sin sesiones ni autorización; no se ha desplegado como servicio público.
