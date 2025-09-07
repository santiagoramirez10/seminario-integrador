# Proyecto Seminario Integrador

**Título:** Diseño e implementación de una interfaz gráfica para un programa computacional de dimensionamiento en microrredes aisladas  
**Estudiante:** Santiago Ramírez Pérez  
**Asesor:** Walter Mauricio Villa Acevedo  
**Semestre:** 10

---
| Archivo                     | Descripción                                                                                         | Unidad / Formato                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `demand_xxxxxx.csv`         | Curva de demanda horaria total de la localidad.                                                     | **Wh** por intervalo (Δt=1h). CSV con columnas: `t, demand`.   |
| `forecast_xxxxxx.csv`       | Pronóstico climático: irradiancia, viento, temperatura, etc.                                        | CSV con columnas: `t, GHI, DNI, DHI, Wt, T_amb, Qt, SF`.       |
| `parameters_xxxxxx.json`    | Parámetros técnicos de los generadores (PV, eólicos, diésel, baterías).                             | JSON estructurado por tecnología.                              |
| `instance_data_xxxxxx.json` | Configuración económica y de diseño: horizonte, costos, NSE, escenarios.                            | JSON con claves como `years`, `fuel_cost`, `n_scenarios`, etc. |
| `auxiliar/fiscal_incentive` | Incentivos fiscales: crédito, depreciación, impuestos.                                              | JSON.                                                          |
| `auxiliar/multiyear`        | Parámetros multi-anuales: degradación de equipos, crecimiento de demanda, variación de combustible. | JSON.                                                          |
| `auxiliar/parameters_cost`  | Costos de operación y mantenimiento (fijos, variables, salvamento).                                 | JSON.                                                          |