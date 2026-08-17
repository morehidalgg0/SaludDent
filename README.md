# SaludConnect - Sistema Integral de Gestión Clínica, Turnos y Fichero Online

Sistema Full-Stack para consultorios y clínicas médicas con base de datos persistente en el servidor, sincronización en tiempo real vía Server-Sent Events (SSE) y soporte interactivo de WhatsApp.

---

## 🌟 Características Principales

### 1. 📅 Agenda Inteligente Multivista
- **Vistas**: Diaria (1 día), Semanal (7 días), Quincenal (15 días) y Mensual.
- **Totalizador Diario Unificado**: Muestra en todas las vistas el total del día, confirmados, cancelados, pendientes, tiempo de ocupación y **sobreturnos**.
- **Intervalos de 15 minutos**: Agendamiento preciso cada 15 min (08:00 a 20:00).
- **Duraciones variables**: 15m, 30m, 45m, 60m, 90m, 120m.
- **Sistema de Sobreturnos**: Permite asignar turnos urgentes en paralelo en el mismo horario con señalización visual destacada sin romper la grilla.

### 2. 📁 Fichero Central de Pacientes
- **Número de Fichero Único**: Asignación correlativa automática (`F-10240`, `F-10241`...) para localización física y digital inmediata.
- **Búsqueda predictiva**: Filtro instantáneo por Fichero N°, DNI, Nombre, Teléfono u Obra Social.
- **Ficha Integral**: Datos de contacto, alertas médicas (alergias, factores de riesgo), historial de turnos y acceso directo a la Historia Clínica.

### 3. 📱 WhatsApp & Sincronización Automática
- **Mensaje de Alta y Recordatorio del Día**: Enlaces directos `wa.me` y simulación interactiva.
- **Botones de Acción**: El paciente recibe la notificación con dos opciones claras: **[✅ Aceptar Turno]** y **[❌ Cancelar Turno]**.
- **Impacto Automático en Tiempo Real**: Al presionar cualquiera de los dos botones en el mensaje o portal del paciente, **el estado de la agenda del administrador se actualiza automáticamente al instante** con alerta sonora y visual.

### 4. 🩺 Historias Clínicas Electrónicas Multidisciplinarias (EHR)
- **Odontología**: Odontograma 2D interactivo con 32 piezas y pintura de caras dentales (Caries, Resina, Corona, Endodoncia, Extracción, Implante).
- **Kinesiología / Fisioterapia**: Mapa corporal interactivo con zonas de dolor, escala EVA 1-10 y metas de rehabilitación.
- **Nutrición**: Calculadora antropométrica automática de IMC (OMS), % de grasa, masa muscular, razón cintura/cadera y metas de macronutrientes.
- **Psicología**: Examen del estado mental, escalas de ansiedad GAD-7 y notas confidenciales.
- **Pediatría**: Percentiles OMS de peso/talla y control del Calendario Nacional de Vacunación.
- **Oftalmología**: Agudeza visual Snellen (OD/OI), refracción óptica completa y tonometría.
- **Medicina General**: Signos vitales completos, anamnesis, diagnóstico CIE-10 y **Generador e Impresión de Recetas / Certificados Médicos**.

### 5. 👥 Recepción & Sala de Espera
- Monitor de flujo en vivo (Por Llegar, En Sala de Espera con contador de tiempo, En Consulta, Atendidos).

---

## 🚀 Puesta en Marcha Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor y frontend simultáneamente
npm run dev:all
```
- Frontend: `http://localhost:5173`
- Backend API & Eventos SSE: `http://localhost:3001`

---

## ☁️ Guía para Subir a Internet (Deploy Online)

### Opción 1: Render.com (Recomendado - Gratis)
1. Sube este repositorio a tu cuenta de **GitHub**.
2. Entra en [Render.com](https://render.com) y selecciona **New > Web Service**.
3. Conecta tu repositorio de GitHub.
4. Render detectará automáticamente el archivo `render.yaml` o configura:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. ¡Listo! Tu sistema estará online y accesible desde cualquier dispositivo.

### Opción 2: Railway.app / Fly.io / VPS con Docker
1. Usa el archivo `Dockerfile` incluido en el proyecto.
2. Ejecuta:
   ```bash
   docker build -t clinica-saludconnect .
   docker run -p 3001:3001 clinica-saludconnect
   ```
