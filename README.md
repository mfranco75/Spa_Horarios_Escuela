# 🏫 Gestión de Escuela

Una aplicación web completa para la administración escolar, construida con **React con Vite**, **Supabase** y **Docker**. Pensada para gestionar múltiples escuelas, usuarios con roles y control de acceso granular.

---

## 🚀 Demo en vivo

Visita la demostración desplegada aquí:  
[https://gestion-de-escuela.vercel.app/](https://gestion-de-escuela.vercel.app/)

---

## 🎯 Características principales

- 🏢 **Multi-escuelas**: soporta múltiples instituciones escolares, aislando datos por escuela.
- 👤 **Propietario (owner)**: usuario con control total que asigna administradores a cada escuela mediante su ID única.
- 🔐 **Panel de administración avanzado**:
  - Administradores pueden gestionar usuarios de su escuela mediante invitaciones por email.
  - Gestión de roles: admin, docente, equipo directivo, etc.
- 🔒 **Control de acceso y seguridad**:
  - Cada usuario sólo ve y administra los datos asociados a su escuela.
  - Autenticación y gestión de credenciales 100% manejada por Supabase.
- 🚧 **Rutas y funcionalidades protegidas según rol**, asegurando el acceso correcto a cada función.
- 📅 **Vista de calendario avanzada**:  
  Integración con **FullCalendar** para mostrar horarios de docentes y carreras.  
  Los horarios se almacenan en la base de datos con día de la semana y hora, y la app renderiza dinámicamente el calendario semanal para facilitar la visualización clara y ordenada.
- 🧩 Interfaz intuitiva y fácil de usar en pantallas grandes (desktop).

---

## 🛠 Tecnologías utilizadas

- **Frontend**: React 18 + Vite con manejo avanzado de rutas protegidas y roles de usuario.
- **Backend / BDD / Auth**: Supabase con Row Level Security (RLS) para aislar datos por escuela y roles.
- **Containerización**: Docker + Docker Compose.
- **Despliegue**: Vercel (frontend).

---

## ⚙️ Instalación y ejecución local

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/gestion-de-escuela.git
   cd gestion-de-escuela
