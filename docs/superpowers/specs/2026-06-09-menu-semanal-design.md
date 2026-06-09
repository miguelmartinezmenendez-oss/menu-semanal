# Diseño: App de Menú Semanal en Pareja

**Fecha:** 2026-06-09
**Estado:** Aprobado por el usuario

---

## Resumen

Aplicación web mobile-first para que dos personas gestionen conjuntamente sus cenas semanales. Permite mantener un catálogo de platos favoritos, construir el menú de la semana eligiendo cenas para cada día, y generar una lista de la compra semi-automática a partir de los ingredientes de los platos planificados.

---

## Stack técnico

| Capa | Tecnología | Motivo |
|------|-----------|--------|
| Frontend | React + Vite + Tailwind CSS | Rápido, mobile-first, sin overhead de framework |
| Base de datos | Supabase (PostgreSQL + Realtime) | Sincronización en tiempo real, capa gratuita suficiente, open source |
| Despliegue | Vercel | Gratuito, despliegue desde git, URL pública |
| Instalación móvil | PWA (manifest + service worker) | Se instala desde el navegador como app nativa, sin tienda |

---

## Acceso compartido

- La primera vez que se abre la app, se genera un **código de hogar** único de 8 caracteres (ej. `GT-4821-AX`).
- El código se almacena en `localStorage` del navegador.
- Para sincronizar dos dispositivos: uno comparte el código y el otro lo introduce en la pantalla de bienvenida.
- No hay registro, no hay contraseñas. El código actúa como identificador del espacio compartido.
- Todos los datos (platos, menú, lista) están asociados a ese código de hogar en Supabase.

---

## Modelo de datos

### `households`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid | PK |
| code | text | Código único de 8 chars (ej. GT-4821-AX) |
| created_at | timestamp | Fecha de creación |

### `dishes`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid | PK |
| household_id | uuid | FK a households |
| name | text | Nombre del plato |
| ingredients | text[] | Lista de ingredientes en texto libre |
| notes | text | Notas opcionales (nullable) |
| created_at | timestamp | |

### `weekly_menu`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid | PK |
| household_id | uuid | FK a households |
| week_start | date | Fecha del lunes de la semana |
| monday_dish_id | uuid | FK a dishes (nullable) |
| tuesday_dish_id | uuid | FK a dishes (nullable) |
| wednesday_dish_id | uuid | FK a dishes (nullable) |
| thursday_dish_id | uuid | FK a dishes (nullable) |
| friday_dish_id | uuid | FK a dishes (nullable) |
| saturday_dish_id | uuid | FK a dishes (nullable) |
| sunday_dish_id | uuid | FK a dishes (nullable) |

### `shopping_list_items`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid | PK |
| household_id | uuid | FK a households |
| week_start | date | Semana a la que pertenece |
| name | text | Nombre del ítem |
| category | text | Categoría (Verduras, Proteínas, Lácteos, Otros) |
| checked | boolean | Marcado como comprado |
| source | text | "auto" (generado del plato) o "manual" |
| created_at | timestamp | |

---

## Pantallas y componentes

### 1. Pantalla de bienvenida (primer uso)
- Aparece solo la primera vez (sin código en localStorage).
- Dos opciones: "Crear nuevo hogar" (genera código) o "Unirse a un hogar" (introduce código).
- Una vez conectado, no vuelve a aparecer.

### 2. Menú de la semana (pantalla principal)
- Cabecera con semana actual (ej. "Semana del 9 al 15 de junio").
- Flechas para navegar a semana anterior/siguiente.
- 7 tarjetas, una por día (Lun-Dom), con:
  - Nombre del plato si está asignado (con botón de borrar).
  - Botón "+" y texto "Añadir cena" si está vacía.
  - Botón "Sugiéreme algo" (icono dado) en cada tarjeta vacía para asignar plato aleatorio. Si el catálogo está vacío, muestra un mensaje "Primero añade platos en Mis platos".
- Al pulsar "+" o el nombre del plato: abre un selector modal con la lista de platos (con buscador).
- Botón flotante inferior "Generar lista de la compra" (activo cuando hay al menos 1 plato en la semana).

### 3. Mis platos
- Barra de búsqueda en la parte superior.
- Lista scrollable de tarjetas de plato (nombre + ingredientes resumidos en una línea).
- Botón "+" flotante en esquina inferior derecha para añadir plato nuevo.
- Al pulsar una tarjeta: abre vista de detalle con opciones Editar / Eliminar.

### 4. Añadir / Editar plato
- Campo: Nombre del plato (requerido).
- Campo: Ingredientes, lista dinámica (un ítem por línea, botón "+" para añadir, botón "×" para eliminar cada uno).
- Campo: Notas (opcional, texto libre).
- Botón "Guardar" grande y visible.
- Botón "Cancelar" / retroceso.

### 5. Lista de la compra
- Generada desde los ingredientes de los platos del menú de la semana activa.
- Ítems agrupados por categoría: Verduras, Proteínas, Lácteos, Otros.
- La categoría se asigna automáticamente mediante una lógica de palabras clave simple (configurable).
- Cada ítem tiene casilla de verificación; al marcarla, el ítem baja al final con texto tachado.
- Botón "Añadir ítem" para agregar ítems manuales.
- Botón "Limpiar comprados" para eliminar los ítems marcados.
- La lista persiste hasta que se regenera manualmente (pulsando "Generar lista" de nuevo desde el menú). Si se modifica el menú después de haber generado la lista, la app muestra un aviso "El menú ha cambiado. ¿Regenerar lista?" pero no la actualiza sola para no perder ítems marcados o añadidos manualmente.

---

## Navegación

Barra inferior fija con 3 iconos:
1. Icono calendario → Menú de la semana
2. Icono plato/tenedor → Mis platos
3. Icono carrito/lista → Lista de la compra

Sin menús ocultos. Todo accesible a un toque desde cualquier pantalla.

---

## Sincronización en tiempo real

- Supabase Realtime se suscribe a cambios en `dishes`, `weekly_menu` y `shopping_list_items` filtrados por `household_id`.
- Cuando un dispositivo guarda un cambio, el otro lo ve reflejado en menos de 1 segundo sin necesidad de recargar.

---

## Instalación en el móvil

1. El usuario abre la URL de Vercel en Safari (iOS) o Chrome (Android).
2. En iOS: pulsa el botón "Compartir" → "Añadir a pantalla de inicio".
3. En Android: Chrome muestra un banner automático "Instalar app" o está disponible en el menú del navegador.
4. La app queda en el escritorio del móvil con icono y nombre propios.
5. Se abre a pantalla completa, sin barra de navegación del navegador.

---

## Fuera de alcance (v1)

- Notificaciones push
- Historial de menús pasados (más allá de navegación por semanas)
- Valoraciones o favoritos de platos
- Importación automática de recetas desde URLs
- Gestión de múltiples hogares desde una misma sesión
- Versión de escritorio optimizada (la app funciona en desktop pero no se optimiza para ello)
