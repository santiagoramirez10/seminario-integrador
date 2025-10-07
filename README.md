
# 🧮 **Diseño e implementación de una interfaz gráfica para un programa computacional de dimensionamiento en microrredes aisladas**

**Estudiante:** Santiago Ramírez Pérez  
**Asesor:** Walter Mauricio Villa Acevedo  
**Semestre:** 10  
**Institución:** Universidad de Antioquia, Facultad de Ingeniería

---

# 📘 **Índice general**
1. [Actividad 1 - Revisión del código y estructura](#actividad-1-revisar-el-código-actual-entender-la-estructura-entradas-salidas-y-módulos-clave)
2. [Actividad 2 - Diseño de wireframes y flujo de usuario](#actividad-2-crear-wireframes-definir-el-flujo-de-usuario-y-seleccionar-tecnologías-adecuadas)
3. [Actividad 3 - Implementación del frontend Angular](#actividad-3-crear-wireframes-definir-el-flujo-de-usuario-y-seleccionar-tecnologías-adecuadas)


---
# **Actividad 1. Revisar el código actual, entender la estructura, entradas, salidas y módulos clave.**
---
## 🎯 Propósito de la actividad
El primer paso consiste en revisar el programa computacional para el dimensionamiento de microrredes actualmente disponible, el cual ha sido programado en Python. Esta etapa implica una lectura detallada del código fuente con el fin de entender su estructura, lógica de ejecución, módulos principales y relaciones internas. Se identificarán las funciones responsables de recibir entradas, procesar datos y generar salidas. Igualmente, se documentarán los tipos de datos de entrada requeridos y las salidas generadas. Esta comprensión profunda será esencial para lograr una correcta integración con la futura interfaz gráfica.

---

## 🗺️ Vista rápida de la jerarquía

```plaintext
/
├─ data/
│  ├─ auxiliar/
│  │  ├─ fiscal_incentive.json
│  │  ├─ multiyear.json
│  │  └─ parameters_cost.json
│  ├─ Leticia/
│  │  ├─ demand_Leticia.csv
│  │  ├─ forecast_Leticia.csv
│  │  ├─ instance_data_Leticia.json
│  │  └─ parameters_Leticia.json
│  ├─ Providencia/
│  │  ├─ demand_Providencia.csv
│  │  ├─ forecast_Providencia.csv
│  │  ├─ instance_data_Providencia.json
│  │  └─ parameters_Providencia.json
│  ├─ Puerto_Nar/
│  │  ├─ demand_Puerto_Nar.csv
│  │  ├─ forecast_Puerto_Nar.csv
│  │  ├─ instance_data_Puerto_Nar.json
│  │  └─ parameters_Puerto_Nar.json
│  └─ San_Andres/
│     ├─ demand_San_Andres.csv
│     ├─ forecast_San_Andres.csv
│     ├─ instance_data_San_Andres.json
│     └─ parameters_San_Andres.json
│
└─ sizingmicrogrids/
   ├─ __main__.py
   ├─ classes.py
   ├─ mainfunctions.py
   ├─ operators.py
   ├─ opt.py
   ├─ scriptgenerators.py
   ├─ strategies.py
   ├─ utilities.py
   └─ setup.py
```

---

## 📦 Estructura **DATA** (completa y verificable)

### 1) **Auxiliar** (`/data/auxiliar/`)
Parámetros económicos y multianuales que se aplican a **todas** las localidades.

| Archivo | Propósito | Variables (definición específica) |
|---|---|---|
| `fiscal_incentive.json` | Modelo de **incentivos tributarios**. | `credit`: % de crédito fiscal aplicable al CAPEX; `depreciation`: tasa anual de depreciación (lineal/acelerada); `corporate_tax`: tasa de renta corporativa; `T1`, `T2`: años de inicio/fin de aplicación de incentivos. |
| `multiyear.json` | **Evolución anual** de desempeño y costos. | `sol_deg`, `wind_deg`, `diesel_deg`, `bat_deg`: degradación anual de PV/eólica/diésel/batería (%/año). `demand_tax`: crecimiento anual de la demanda (%); `fuel_tax`: variación anual del precio del combustible (%); `default_data`: bandera para usar valores por defecto. |
| `parameters_cost.json` | **Costos** de O&M, reemplazos y penalizaciones. | `param_r_*`: costo de **reemplazo** (USD) por tecnología; `param_s_*`: valor de **salvamento** al final de vida; `param_f_*`: **O&M fijo** (USD/año); `param_v_*`: **O&M variable** (USD/kWh); `NSE_COST`: penalización por **energía no servida** (USD/kWh); `life_cicle`: **vida útil** (años) por componente. |

> **Nota:** las unidades monetarias deben estar en la misma moneda y año base en todo el proyecto.

---

### 2) **Por localidad** (`/data/<Localidad>/`)
Cada ZNI tiene **los mismos cuatro archivos**, con datos propios.

| Archivo | Función | Formato y campos |
|---|---|---|
| `demand_<loc>.csv` | **Demanda** eléctrica horaria del año. | CSV; 8760 filas (8784 si bisiesto). Columnas: `t` (0–8759), `demand` (kWh/h). Sin nulos ni negativos. |
| `forecast_<loc>.csv` | **Clima** para potencia renovable y condiciones ambientales. | CSV alineado 1:1 con `demand`. Columnas: `t`, `GHI` [W/m²], `DNI` [W/m²], `DHI` [W/m²], `T_amb` [°C], `Wt` [m/s], `SF` [- 0..1], `RH` [%], `P_atm` [kPa], `Rainfall` [mm/h], `CloudCover` [%], `Albedo` [-], `day` [1–365], `Qt` [aux]. Regla: irradiancias ≥ 0, `0 ≤ SF ≤ 1`, `Wt ≥ 0`. |
| `parameters_<loc>.json` | **Tecnologías** y costos por equipo. | JSON con secciones: `"generators"` y `"batteries"`. Ver tablas técnicas abajo. |
| `instance_data_<loc>.json` | **Escenario** y restricciones globales. | JSON: `years` (años), `i_f` (tasa de descuento), `inf` (inflación), `fuel_cost` (USD/L), `nse` (fracción máx.), `n-scenarios`, `percent_robustness` (0..1), `latitude`, `longitude`, `time_zone`, `amax` (m²), `tilted_angle`, `shading_factor`, `alpha_albedo` (si existe). Validar rangos físicos. |

#### 📘 Esquema **parameters_*.json**
Tabla exhaustiva de campos (aplican por equipo; algunos son específicos por tecnología):

| Campo | Unidad | Aplica a | Descripción |
|---|---|---|---|
| `id_gen` | — | Gen. | Identificador único del equipo (p.ej., `PV_5kW`). |
| `tec` | — | Gen. | Tecnología: `"S"` (solar), `"W"` (eólica), `"D"` (diésel). |
| `Ppv_stc` | kW | Solar | Potencia nominal a STC. |
| `fpv` | — | Solar | **Performance Ratio** global de la planta FV. |
| `kt` | 1/°C | Solar | Coeficiente térmico del módulo (negativo). |
| `area` | m² | Todas | Área requerida por unidad. |
| `s_in` / `s_rate` / `s_out` | m/s | Eólica | Velocidad de arranque / nominal / corte. Regla: `s_in < s_rate < s_out`. |
| `p_y` | kW | Eólica | Potencia nominal del aerogenerador. |
| `h` | m | Eólica | Altura del buje. |
| `DG_min` / `DG_max` | kW | Diésel | Potencias mín./máx. operativas. |
| `f0`, `f1` | L/kWh | Diésel | Curva específica de consumo. `f0,f1 ≥ 0`. |
| `cost_up` | USD | Todas | CAPEX por unidad. |
| `cost_fopm` | USD/año | Todas | O&M **fijo**. |
| `cost_vopm` | USD/kWh | Todas | O&M **variable**. |
| `cost_r` / `cost_s` | USD | Todas | Reemplazo / Salvamento. |
| `n_eq` / `n` | — | Gen. | Multiplicador o # de unidades por bloque (si aplica). |
| `soc_max` | kWh | Batería | Capacidad nominal. |
| `efc` / `efd` | — | Batería | Eficiencia de carga / descarga (0–1]. |
| `dod_max` | — | Batería | Profundidad máx. de descarga (0–1]. |
| `alpha` | — | Batería | Autodescarga por hora (≥ 0). |

> **Validaciones**: costos y áreas no negativos; eficiencias (0,1]; parámetros eólicos en orden; `DG_max > DG_min ≥ 0`.

---

## 🧠 Motor de cálculo **Python** (`/sizingmicrogrids`)

### Rol de cada archivo (específico y accionable)

#### `__main__.py` — *Orquestador*
- Punto de entrada (`python -m sizingmicrogrids` o `python __main__.py`).  
- Lee **inputs** por localidad; crea tecnologías; arma instancia.  
- Llama a `opt.make_model(...)`; ejecuta despacho/estrategia; guarda **salidas** (dimensionamiento, series, KPIs).

#### `classes.py` — *Modelos de equipos*
- Clases típicas: `SolarPV`, `Eolic`, `DieselGen`, `Battery`, y algún contenedor de **Sistema**.  
- Implementan: potencia generada vs. clima, consumo de combustible, degradación, reglas de operación y cálculo de costos.  
- Encapsulan los parámetros de `parameters_*.json` y exponen métodos tipo `power_output(hour)`, `fuel_curve(p)`, `apply_degradation(year)`.

#### `mainfunctions.py` — *Preparación de datos y objetos*
- `read_data(path_localidad)`: abre `demand_*.csv`, `forecast_*.csv`, `parameters_*.json`, `instance_data_*.json`; valida tamaños y unidades.  
- `create_objects(params_json)`: instancia clases de `classes.py` según `"generators"`/`"batteries"`.  
- `create_technologies(...)`: lista activa de tecnologías en el escenario.  
- `compute_costs(...)`: anualiza CAPEX (CRF), agrega OPEX, aplica incentivos (`/auxiliar`).  
- `create_instance(...)`: mezcla todo en un único diccionario listo para **Pyomo**.

#### `operators.py` — *Utilitarios algebraicos*
- Funciones auxiliares/operadores para construir restricciones y lógicas (especialmente sobre series horarias, límites y relaciones no lineales aproximadas).

#### `opt.py` — *Optimización (Pyomo)*
- `make_model(data, techs, params, instance)`:  
  - **Conjuntos**: horas, años, tecnologías.  
  - **Parámetros**: demanda, GHI/DNI/DHI, viento, costos, límites.  
  - **Variables**: capacidad instalada por tecnología, `P_gen[t,tec]`, `SOC[t]`, `NSE[t]`.  
  - **Restricciones**: balance de potencia, límites de operación (DG_min/max, SoC, DoD), `NSE` máx., `área ≤ amax`.  
  - **Objetivo**: minimizar costo total anualizado (o LCOE/NPV equivalente).  
- Ejecuta solver (GLPK/CBC/GUROBI si disponible) y retorna resultados estructurados.

#### `scriptgenerators.py` — *Fabricación de escenarios*
- Genera **familias** de equipos (p.ej., PV 5/10/20 kW; cambios de costos) para estudios de sensibilidad y barridos paramétricos. Exporta JSONs listos en `/data`.

#### `strategies.py` — *Despacho horario*
- Políticas de operación (`ds_diesel`, `ds_diesel_renewable`, `select_strategy`): priorización renovables → baterías → diésel; gestión de `SOC` y rampas; control de `NSE`.

#### `utilities.py` — *Postproceso y reportes*
- Métricas: `LCOE`, `ENS/NSE`, `coverage`, costos anuales equivalentes.  
- Gráficas: **mix** de generación, curvas demanda vs. generación, `SOC`.  
- Exportación a CSV/JSON/Excel; helpers numéricos.

#### `setup.py` — *Empaquetado*
- Metadatos y dependencias (`pyomo`, `pandas`, `numpy`, `plotly`, `scipy`, `xlsxwriter`, …).  
- Permite `pip install .` para usar el paquete en otros proyectos/servidores.

---

## 🔁 Flujo de ejecución (datos → optimización → resultados)

```plaintext
1) Selección de localidad y lectura de data
   └─ mainfunctions.read_data()

2) Construcción de objetos tecnológicos
   └─ mainfunctions.create_objects()  → classes.py

3) Preparación de instancia/escenario
   └─ mainfunctions.create_instance() + auxiliar/*

4) Optimización del tamaño y operación
   └─ opt.make_model()  → Pyomo + solver

5) Despacho y simulación temporal
   └─ strategies.select_strategy()

6) Reportes y salidas
   └─ utilities (tablas, gráficos, CSV/JSON/Excel)
```

---

## ✅ Validaciones mínimas (antes de simular)
- `len(demand) == len(forecast) == 8760` (o 8784).  
- **Unidades**: kWh/h, W/m², m/s, °C, kPa; eficiencias (0,1]; `SF` ∈ [0,1].  
- `parameters_*`: `DG_max > DG_min ≥ 0`, `s_in < s_rate < s_out`, costos/áreas ≥ 0.  
- `instance_data_*`: `-90≤lat≤90`, `-180≤lon≤180`, `percent_robustness ∈ [0,1]`, `amax ≥ 0`.  
- Moneda y **año base** consistentes en todo el ecosistema (incl. `auxiliar/*`).

---

## ▶️ Cómo ejecutar el motor (modo local)
```bash
# (1) Crear y activar entorno
python -m venv .venv
# Windows: .venv\Scripts\activate
# Linux/Mac: source .venv/bin/activate

# (2) Instalar dependencias (si se usa setup.py)
pip install -e .

# (3) Lanzar el cálculo
python -m sizingmicrogrids
# o
python sizingmicrogrids/__main__.py
```
---
---
# **Actividad 2. Crear wireframes, definir el flujo de usuario y seleccionar tecnologías adecuadas.**
---
## 🎯 Propósito de la actividad
Una vez comprendido el funcionamiento del programa existente, se iniciará el diseño de la interfaz gráfica orientada a mejorar la experiencia del usuario. Esta etapa incluye la elaboración de wireframes o bocetos que representan visualmente las pantallas de la aplicación, la definición del flujo de navegación entre las diferentes vistas y la organización de los elementos de entrada y salida. Además, se seleccionarán las tecnologías a utilizar para el frontend, siendo AngularJS la principal propuesta, junto con HTML5, CSS3 y herramientas de diseño responsive.

---

## 🧱 1. Diseño de wireframes

Se elaboraron **cuatro propuestas de diseño** para el *dashboard principal* de la aplicación web.  
Cada wireframe representa una versión distinta de la interfaz, con variaciones en **tipografía, disposición y color**, tomando como base los lineamientos institucionales de la **Universidad de Antioquia** y los principios de accesibilidad y legibilidad.

| Wireframe | Estilo | Descripción visual | Tipografía | Paleta principal |
|------------|---------|--------------------|-------------|------------------|
| `wf1-udea-classic` | **Clásico institucional** | Barra superior fija, distribución limpia con tarjetas de indicadores (KPIs) y gráficos. | *Inter* | Verde UdeA `#065F37` con fondo claro `#F5F8F5`. |
| `wf2-dark-contrast` | **Oscuro técnico** | Estilo de alto contraste con fondo negro, panel lateral de filtros y acentos verdes brillantes. | *Poppins* | Verde brillante `#3FB950` sobre gris carbón `#0D1117`. |
| `wf3-card-grid` | **Moderno con tarjetas** | Diseño basado en tarjetas con sombras suaves, tipografía geométrica y disposición 2x1. | *Montserrat* | Verde natural `#2E7D32` y blanco humo. |
| `wf4-minimal-sidebar` | **Minimalista con barra lateral** | Navegación lateral permanente y espacio amplio para resultados y gráficos. | *Source Sans 3* | Verde esmeralda `#0B7A4C` sobre fondo claro `#F7FAF7`. |

📦 **Estructura de los wireframes:**
Cada diseño contiene su propio `index.html`, `styles.css` y tres imágenes de prueba (`mix.png`, `potencias.png`, `series.png`), alojadas en la carpeta `assets/wireframes/`.

```
frontend/
 └─ src/
    └─ assets/
       └─ wireframes/
          ├─ wf1-udea-classic/
          │   ├─ index.html
          │   ├─ styles.css
          │   ├─ mix.png
          │   ├─ potencias.png
          │   └─ series.png
          ├─ wf2-dark-contrast/
          ├─ wf3-card-grid/
          └─ wf4-minimal-sidebar/
```

---

## 🔁 2. Flujo de usuario propuesto

El **flujo de usuario** se diseñó con enfoque de usabilidad y jerarquía funcional.  
Cada pantalla representa una etapa natural dentro del proceso de dimensionamiento, permitiendo al usuario avanzar paso a paso hasta la obtención de los resultados finales.

| Etapa | Descripción | Elementos de interacción | Datos manejados |
|--------|--------------|--------------------------|-----------------|
| **Inicio** | Muestra la introducción y propósito de la herramienta. | Botones de navegación, texto descriptivo. | Ninguno. |
| **Cargar datos** | Permite subir archivos de demanda, clima y parámetros técnicos. | Entradas de tipo `file`, validación y previsualización. | Archivos `.csv` y `.json`. |
| **Configuración** | Ajustes de simulación: horizonte, tasas, tecnologías y condiciones del sistema. | Formularios, `sliders`, `checkboxes`. | Parámetros globales. |
| **Resultados** | Visualización de indicadores energéticos y económicos, con gráficos y reportes exportables. | Gráficos (Plotly/Chart.js), tablas dinámicas. | Salidas del modelo Python. |
| **Ayuda** | Instrucciones, referencias y datos de contacto. | Enlaces y secciones informativas. | Ninguno. |

🔸 **Flujo resumido:**
```
Inicio → Cargar datos → Configuración → Resultados → (Exportar / Guardar)
```

Cada etapa está enlazada mediante el **enrutador Angular** (`RouterModule`) para garantizar transiciones fluidas.

---

## ⚙️ 3. Tecnologías seleccionadas

| Capa | Tecnología | Justificación |
|------|-------------|----------------|
| **Frontend** | **Angular 18+** | Framework robusto y modular con soporte TypeScript y arquitectura SPA. |
| **Lenguaje de marcado** | **HTML5** | Estructura semántica y compatibilidad universal. |
| **Estilos** | **CSS3 / TailwindCSS (opcional)** | Permite diseño responsive y componentes reutilizables. |
| **Visualización** | **Plotly.js / Chart.js** | Librerías de gráficos interactivos integrables en Angular. |
| **Backend** | **Python (FastAPI)** | Framework rápido y moderno para integrar el modelo de optimización. |
| **Comunicación** | **REST API** (JSON) | Facilita la conexión Angular ↔ Python mediante endpoints claros. |
| **Almacenamiento** | **JSON y CSV** | Formato ligero para datos de entrada/salida. |
| **Despliegue** | **Docker + Nginx** | Simplifica la ejecución en entornos locales o en nube. |

---

## 🧩 4. Estructura del frontend

```
frontend/
 ├─ src/
 │   ├─ app/
 │   │   ├─ components/
 │   │   │   ├─ navbar/
 │   │   │   ├─ footer/
 │   │   │   └─ cards/
 │   │   ├─ pages/
 │   │   │   ├─ home/
 │   │   │   ├─ cargar-datos/
 │   │   │   ├─ configuracion/
 │   │   │   ├─ resultados/
 │   │   │   └─ ayuda/
 │   │   ├─ services/
 │   │   │   └─ api.service.ts
 │   │   ├─ app.component.ts
 │   │   ├─ app.routes.ts
 │   │   └─ app.module.ts
 │   ├─ assets/
 │   │   └─ wireframes/
 │   └─ styles.css
 └─ package.json
```

---

## 🎨 5. Principios de diseño adoptados

- **Accesibilidad universal:** compatibilidad con teclado y lectores de pantalla.  
- **Paleta institucional:** verdes UdeA y tonos neutros para fondo y texto.  
- **Jerarquía visual clara:** priorización de KPIs y resultados sobre controles secundarios.  
- **Responsive design:** ajuste automático a pantallas de escritorio, tablet y móvil.  
- **Modularidad:** componentes Angular reutilizables y desacoplados.  
- **Simplicidad:** enfoque minimalista con énfasis en legibilidad.

---

## 🧭 6. Flujo técnico entre frontend y backend

1. El usuario carga los archivos de entrada (CSV/JSON).  
2. Angular valida y envía los datos al servidor vía **POST /upload**.  
3. El backend **FastAPI** ejecuta el modelo de dimensionamiento (Python).  
4. Los resultados se retornan como JSON al frontend.  
5. Angular renderiza los gráficos y tablas dinámicas.  
6. El usuario puede **exportar** resultados en PDF o CSV.

---

# **Actividad 3. Crear wireframes, definir el flujo de usuario y seleccionar tecnologías adecuadas.**
---
## 🎯 Propósito de la actividad

Con el diseño aprobado, se iniciará la implementación del frontend utilizando AngularJS y tecnologías web modernas. Se desarrollarán los distintos componentes visuales, como formularios de carga de datos, botones de acción, secciones de visualización de resultados y mensajes de error. Se aplicarán principios de usabilidad y accesibilidad para garantizar que la herramienta sea clara, rápida y fácil de usar.

---

## 🧩 Arquitectura general del frontend

El proyecto está desarrollado con **Angular 18 (standalone)**, estructurado de forma modular para facilitar su mantenimiento, escalabilidad y futura integración con el backend en Python (Flask o FastAPI).

```
frontend/microgrid-ui/
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── navbar/          # Barra superior de navegación
│   │   │   └── footer/          # Pie de página institucional
│   │   │
│   │   ├── pages/
│   │   │   ├── inicio/          # Página de bienvenida y resumen del sistema
│   │   │   ├── cargar-datos/    # Formulario de carga de archivos CSV y JSON
│   │   │   ├── configuracion/   # Parámetros técnicos y económicos
│   │   │   ├── resultados/      # Visualización de resultados y gráficos
│   │   │   └── ayuda/           # Documentación e instrucciones de uso
│   │   │
│   │   ├── services/
│   │   │   ├── data.service.ts  # Manejo del estado de archivos cargados
│   │   │   └── api.service.ts   # Comunicación HTTP con el backend
│   │   │
│   │   ├── app.config.ts        # Configuración general del proyecto
│   │   ├── app.routes.ts        # Definición de rutas y navegación
│   │   ├── app.component.ts     # Componente raíz
│   │   └── app.html / app.css   # Estructura y estilos principales
│   │
│   ├── assets/                  # Imágenes, íconos, wireframes y logos
│   ├── styles.css               # Paleta de colores institucional (verde UdeA)
│   ├── index.html               # Archivo raíz del proyecto Angular
│   └── main.ts                  # Punto de arranque del frontend
│
└── package.json / angular.json  # Configuración de dependencias y compilación
```

---

## 🎨 Diseño visual y componentes implementados

### 🔹 Navbar (Barra superior)
- Color principal: `#005C3C` (verde institucional UdeA).  
- Ícono ⚡ y texto: **Microgrid UI**.  
- Enlaces de navegación:  
  `Inicio`, `Cargar Datos`, `Configuración`, `Resultados`, `Ayuda`.

### 🔹 Footer (Pie de página)
- Fondo verde oscuro con texto blanco.  
- Texto institucional:  
  `© 2025 Universidad de Antioquia — Dimensionador de Microrredes`.

### 🔹 Página “Cargar Datos”
- Cuatro campos de carga de archivo:
  1. `demand_XXXXXX.csv`
  2. `forecast_XXXXXX.csv`
  3. `parameters_XXXXXX.json`
  4. `instance_data_XXXXXX.json`
- Muestra el estado de cada archivo (`pending` / `loaded`).
- Botón “**Continuar → Configuración**” habilitado solo cuando todos los archivos han sido cargados.
- Estilo limpio y centrado, compatible con pantallas medianas.

### 🔹 Página “Configuración”
- Formulario dinámico con validaciones:
  - Horizonte de simulación (años)
  - Número de escenarios
  - Porcentaje de robustez
  - Tasa de interés (`i_f`)
  - Costo del combustible (`fuel_cost`)
- Campos obligatorios y mensajes de validación.  
- Botón verde: “**Ejecutar simulación**”.  
- Secciones separadas por tarjetas (`cards`) con bordes suaves.

### 🔹 Página “Resultados”
- Sección principal para visualización de gráficos:
  - **Gráfico de línea:** demanda vs generación total.
  - **Gráfico circular:** participación porcentual por tecnología.
  - **Gráfico de barras:** potencias instaladas.
- Indicadores clave:
  - Energía total generada (MWh)
  - Costo total del sistema (USD)
  - Porcentaje de demanda satisfecha (%)
- Botones para exportar resultados (`CSV`, `Excel`, `PDF`).

### 🔹 Página “Ayuda”
- Instrucciones detalladas para preparar los archivos CSV y JSON.  
- Ejemplo de estructura de columnas esperadas.  
- Enlaces al repositorio GitHub y documentos del curso.  
- Sección de contacto y créditos institucionales.

---

## ⚙️ Servicios principales del sistema

### 🧠 `DataService`
Gestiona los archivos cargados por el usuario.

```typescript
files = {
  demand: null,
  forecast: null,
  parameters: null,
  instance: null
};
```

**Funciones:**
- `setFile(type: string, file: File)` → Guarda el archivo seleccionado.  
- `getFile(type: string)` → Retorna el archivo correspondiente.  
- `isAllLoaded()` → Verifica si los cuatro archivos requeridos están listos.

---

### 🌐 `ApiService`
Gestiona la comunicación HTTP con el backend Python (a desarrollar en Actividad 4).

**Funciones:**
```typescript
uploadFiles(formData: FormData)     // POST /api/v1/upload
runSimulation(params: any)          // POST /api/v1/simulate
getResults(runId: string)           // GET /api/v1/results/:id
```

**Descripción:**
- Se usa `HttpClientModule` para manejar solicitudes HTTP.  
- Permite la integración directa con un backend Flask o FastAPI.

---

## 🧭 Flujo de usuario implementado

| Etapa | Descripción |
|--------|--------------|
| **1. Inicio** | Vista general y presentación del proyecto. |
| **2. Cargar Datos** | Se suben los archivos de entrada requeridos. |
| **3. Configuración** | El usuario ajusta parámetros técnicos y financieros. |
| **4. Resultados** | Se ejecuta la simulación y se muestran gráficos. |
| **5. Ayuda** | Guías y documentación para el uso de la herramienta. |

---

## 💡 Principios de diseño aplicados

| Principio | Descripción |
|------------|--------------|
| **Usabilidad** | Interfaz simple, etiquetas claras y botones intuitivos. |
| **Accesibilidad** | Compatibilidad con teclado y lectores de pantalla. |
| **Consistencia** | Tipografía uniforme y colores institucionales. |
| **Responsividad** | Compatible con laptops y pantallas medianas. |
| **Retroalimentación** | Indicadores visuales ante errores o cargas correctas. |

---

## 🎨 Paleta de colores y tipografía

| Elemento | Color | Descripción |
|-----------|--------|-------------|
| Fondo principal | `#F7FAF8` | Blanco con tono verdoso. |
| Encabezado / Navbar | `#005C3C` | Verde UdeA. |
| Botones activos | `#007D4B` | Verde brillante para acciones primarias. |
| Texto | `#222222` | Gris oscuro (alta legibilidad). |
| Tipografía | *Roboto / Open Sans* | Moderna y clara. |

---

## 🔧 Dependencias principales

| Paquete | Versión | Descripción |
|----------|----------|--------------|
| `@angular/core` | 18.x | Framework principal Angular. |
| `@angular/router` | 18.x | Manejo de rutas y navegación. |
| `chart.js` | 4.x | Visualización de resultados energéticos. |
| `ngx-charts` | 20.x | Gráficos interactivos y responsivos. |
| `bootstrap` | 5.x | Sistema de estilos base y responsive. |