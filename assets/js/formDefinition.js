// GNP_Local/assets/js/formDefinition.js

export const formSections = [
    // --- SECCIÓN SOLICITANTES (ya la teníamos, la incluyo para que el archivo esté completo) ---
    {
        id: "seccion-solicitantes",
        title: "Solicitantes",
        subtitle: "Comencemos con tus datos personales.",
        fields: [
            { id: "sol_codigo_cliente", name: "sol_codigo_cliente", label: "Código de cliente:", type: "text", placeholder: "Código de cliente", maxLength: 20, required: false, sequentialReveal: true },
            { id: "sol_primer_apellido", name: "sol_primer_apellido", label: "Primer apellido:", type: "text", placeholder: "Primer apellido", maxLength: 50, required: true, sequentialReveal: true },
            { id: "sol_segundo_apellido", name: "sol_segundo_apellido", label: "Segundo apellido:", type: "text", placeholder: "Segundo apellido", maxLength: 50, required: false, sequentialReveal: true },
            { id: "sol_nombres", name: "sol_nombres", label: "Nombre(s):", type: "text", placeholder: "Nombre(s)", maxLength: 100, required: true, sequentialReveal: true },
            { id: "sol_fecha_nacimiento", name: "sol_fecha_nacimiento", label: "Fecha de nacimiento:", type: "date", required: true, sequentialReveal: true },
            { id: "sol_rfc", name: "sol_rfc", label: "RFC:", type: "text", placeholder: "RFC con homoclave", maxLength: 13, tooltipText: "El Registro Federal de Contribuyentes (RFC) es una clave única de registro utilizada en México para identificar a cada persona física o moral con actividad económica. Formato: XXXX000000XXX", required: false, sequentialReveal: true },
            { id: "sol_curp", name: "sol_curp", label: "CURP:", type: "text", placeholder: "CURP", maxLength: 18, required: false, sequentialReveal: true },
            { id: "sol_pais_nacimiento", name: "sol_pais_nacimiento", label: "País de nacimiento:", type: "text", placeholder: "País de nacimiento", maxLength: 50, required: false, sequentialReveal: true },
            { id: "sol_nacionalidad", name: "sol_nacionalidad", label: "Nacionalidad:", type: "text", placeholder: "Nacionalidad", maxLength: 50, required: false, sequentialReveal: true },
            { id: "sol_ocupacion", name: "sol_ocupacion", label: "Ocupación:", type: "text", placeholder: "Ocupación", maxLength: 100, required: false, sequentialReveal: true },
            { id: "sol_genero", name: "sol_genero", label: "Género:", type: "select", required: false, sequentialReveal: true, options: [{ value: "", text: "Seleccione...", disabled: true, selected: true }, { value: "F", text: "Femenino" }, { value: "M", text: "Masculino" }] },
            { id: "sol_certificado_digital_fiel", name: "sol_certificado_digital_fiel", label: "No. serie certificado digital:", type: "text", placeholder: "No. serie FIEL", maxLength: 50, tooltipText: "Número de serie de tu e.firma (antes Firma Electrónica Avanzada - FIEL). Es un identificador único de tu certificado digital emitido por el SAT.", required: false, sequentialReveal: true },
            { id: "sol_email", name: "sol_email", label: "Correo electrónico:", type: "email", placeholder: "Correo electrónico", maxLength: 100, required: false, sequentialReveal: true },
            { id: "sol_cargo_gobierno", name: "sol_cargo_gobierno", label: "¿Desempeñó cargo en gobierno?", type: "checkbox", value: "true", required: false, sequentialReveal: true },
            { id: "sol_cargo_dependencia", name: "sol_cargo_dependencia", label: "Cargo y dependencia (si aplica):", type: "text", placeholder: "Cargo y dependencia", maxLength: 100, required: false, sequentialReveal: true, conditionalShow: { fieldId: "sol_cargo_gobierno", checked: true } },
            { id: "sol_estatura", name: "sol_estatura", label: "Estatura (metros):", type: "number", placeholder: "Ej: 1.75", step: "0.01", min: "0.5", max: "2.5", required: false, sequentialReveal: true },
            { id: "sol_peso", name: "sol_peso", label: "Peso (kg):", type: "number", placeholder: "Ej: 70.5", step: "0.1", min: "10", max: "300", required: false, sequentialReveal: true }
        ]
    },
    // --- SECCIÓN DOMICILIOS ---
    {
        id: "seccion-domicilios",
        title: "Domicilios",
        subtitle: "Información de tu residencia actual.",
        fields: [
            { id: "dom_calle", name: "dom_calle", label: "Calle:", type: "text", placeholder: "Calle", maxLength: 100, required: false, sequentialReveal: true },
            { id: "dom_no_exterior", name: "dom_no_exterior", label: "No. Exterior:", type: "text", placeholder: "No. Exterior", maxLength: 10, required: false, sequentialReveal: true },
            { id: "dom_no_interior", name: "dom_no_interior", label: "No. Interior:", type: "text", placeholder: "No. Interior (si aplica)", maxLength: 10, required: false, sequentialReveal: true },
            { id: "dom_colonia", name: "dom_colonia", label: "Colonia:", type: "text", placeholder: "Colonia", maxLength: 100, required: false, sequentialReveal: true },
            { id: "dom_cp", name: "dom_cp", label: "Código Postal:", type: "text", placeholder: "Código Postal", maxLength: 10, required: false, sequentialReveal: true },
            { id: "dom_municipio", name: "dom_municipio", label: "Municipio/Alcaldía:", type: "text", placeholder: "Municipio o Alcaldía", maxLength: 100, required: false, sequentialReveal: true },
            { id: "dom_estado", name: "dom_estado", label: "Estado:", type: "text", placeholder: "Estado", maxLength: 100, required: false, sequentialReveal: true },
            { id: "dom_tipo_identificacion", name: "dom_tipo_identificacion", label: "Tipo Identificación (Domicilio):", type: "text", placeholder: "Ej: INE, Pasaporte", maxLength: 50, required: false, sequentialReveal: true },
            { id: "dom_institucion_emisora", name: "dom_institucion_emisora", label: "Institución Emisora (Domicilio):", type: "text", placeholder: "Ej: INE, SRE", maxLength: 50, required: false, sequentialReveal: true },
            { id: "dom_folio_identificacion", name: "dom_folio_identificacion", label: "Folio Identificación (Domicilio):", type: "text", placeholder: "Folio/Número", maxLength: 50, required: false, sequentialReveal: true },
            { id: "dom_telefono", name: "dom_telefono", label: "Teléfono Fijo:", type: "tel", placeholder: "Teléfono Fijo", maxLength: 20, required: false, sequentialReveal: true },
            { id: "dom_celular", name: "dom_celular", label: "Teléfono Celular:", type: "tel", placeholder: "Teléfono Celular (10 dígitos)", maxLength: 20, required: true, sequentialReveal: true },
            { id: "dom_extension", name: "dom_extension", label: "Extensión:", type: "text", placeholder: "Extensión (si aplica)", maxLength: 10, required: false, sequentialReveal: true }
        ]
    },
    // --- SECCIÓN ACTIVIDADES DE RIESGO ---
    {
        id: "seccion-actividades_riesgo",
        title: "Actividades de Riesgo",
        subtitle: "Indica si realizas alguna de estas actividades por tu ocupación o pasatiempo.",
        fields: [
            { id: "act_labores_administrativas", name: "act_labores_administrativas", label: "Labores Administrativas", type: "checkbox", value: "true", required: false, sequentialReveal: false },
            { id: "act_operador_maquinaria_pesada", name: "act_operador_maquinaria_pesada", label: "Operador Maquinaria Pesada", type: "checkbox", value: "true", required: false, sequentialReveal: false },
            { id: "act_trabaja_explosivos", name: "act_trabaja_explosivos", label: "Trabaja con Explosivos", type: "checkbox", value: "true", required: false, sequentialReveal: false },
            { id: "act_visita_obras", name: "act_visita_obras", label: "Visita Obras en Construcción/Campo", type: "checkbox", value: "true", required: false, sequentialReveal: false },
            { id: "act_uso_armas", name: "act_uso_armas", label: "Uso/Portación de Armas", type: "checkbox", value: "true", required: false, sequentialReveal: false },
            { id: "act_actividad_agricola", name: "act_actividad_agricola", label: "Realiza Actividad Agrícola/Ganadera", type: "checkbox", value: "true", required: false, sequentialReveal: false },
            { id: "act_utiliza_motocicleta", name: "act_utiliza_motocicleta", label: "Utiliza Motocicleta Regularmente", type: "checkbox", value: "true", required: false, sequentialReveal: false },
            { id: "act_viaja_aviones_particulares", name: "act_viaja_aviones_particulares", label: "Viaja en Aviones Particulares/No Comerciales", type: "checkbox", value: "true", required: false, sequentialReveal: false },
            { id: "act_otra_actividad_riesgo", name: "act_otra_actividad_riesgo", label: "Otra actividad de riesgo no listada:", type: "text", placeholder: "Describe brevemente (si aplica)", maxLength: 150, required: false, sequentialReveal: false, fullWidth: true } // También false para que aparezca directo
        ]
    },
    // --- SECCIÓN HÁBITOS ---
    {
        id: "seccion-habitos",
        title: "Hábitos",
        subtitle: "Información relevante sobre tu estilo de vida.",
        fields: [
            { id: "hab_fuma_group", name: "hab_fuma", label: "¿Fuma actualmente?", type: "radio", required: true, defaultValue: "no", options: [{ value: "si", text: "Sí" }, { value: "no", text: "No" }], sequentialReveal: true },
            { id: "hab_cigarrillos_dia", name: "hab_cigarrillos_dia", label: "Cigarrillos al día (si fuma):", type: "number", placeholder: "Cantidad", min: 0, required: false, sequentialReveal: true, conditionalShow: { fieldId: "hab_fuma_group", value: "si" } },
            { id: "hab_cuando_dejo_fumar", name: "hab_cuando_dejo_fumar", label: "Si dejó de fumar, ¿hace cuánto tiempo?", type: "text", placeholder: "Ej: 2 años, 6 meses", maxLength: 50, required: false, sequentialReveal: true, conditionalShow: { fieldId: "hab_fuma_group", value: "no" } },
            { id: "hab_consume_alcohol_group", name: "hab_consume_alcohol", label: "¿Consume bebidas alcohólicas?", type: "radio", required: true, defaultValue: "no", options: [{ value: "si", text: "Sí" }, { value: "no", text: "No" }], sequentialReveal: true },
            { id: "hab_frecuencia_alcohol", name: "hab_frecuencia_alcohol", label: "Frecuencia y cantidad (si consume alcohol):", type: "text", placeholder: "Ej: 2 copas fines de semana", maxLength: 100, required: false, sequentialReveal: true, conditionalShow: { fieldId: "hab_consume_alcohol_group", value: "si" } },
            { id: "hab_consume_drogas_group", name: "hab_consume_drogas", label: "¿Consume o ha consumido drogas (no prescritas)?", type: "radio", required: true, defaultValue: "no", options: [{ value: "si", text: "Sí" }, { value: "no", text: "No" }], sequentialReveal: true },
            { id: "hab_tipo_droga_frecuencia", name: "hab_tipo_droга_frecuencia", label: "Tipo de droga y frecuencia (si consume):", type: "text", placeholder: "Describe brevemente", maxLength: 150, required: false, sequentialReveal: true, conditionalShow: { fieldId: "hab_consume_drogas_group", value: "si" } },
            {
                id: "pregunta-embarazo", // Este es el ID del div que envuelve la pregunta de embarazo
                isGroupWrapper: true, // Marcador para que el renderer sepa que es un contenedor de lógica
                label: "", // No necesita label propio si los radios lo tienen
                type: "groupWrapper", // Tipo especial para el renderer
                sequentialReveal: true,
                conditionalShow: { fieldId: "sol_genero", value: "F" }, // Depende del género en seccion-solicitantes
                fields: [ // Campos dentro de este grupo condicional
                    { id: "hab_embarazada_group", name: "hab_embarazada", label: "¿Está actualmente embarazada? (Aplicable a mujeres)", type: "radio", required: true, defaultValue: "no", options: [{ value: "si", text: "Sí" }, { value: "no", text: "No" }, { value: "na", text: "No Aplica" }], sequentialReveal: false } // No secuencial dentro del grupo, el grupo aparece de golpe
                ]
            },
            { id: "hab_semanas_embarazo", name: "hab_semanas_embarazo", label: "Semanas de gestación (si está embarazada):", type: "number", placeholder: "Semanas", min: 0, max: 45, required: false, sequentialReveal: true, conditionalShow: { fieldId: "hab_embarazada_group", value: "si" } }
        ]
    },
    // --- SECCIÓN DEPORTES ---
    {
        id: "seccion-deportes",
        title: "Deportes",
        subtitle: "¿Practicas alguno de estos deportes o actividades con regularidad?",
        fields: [
            { id: "dep_tipo_practica", name: "dep_tipo_practica", label: "Tipo de práctica:", type: "select", required: false, options: [{value: "", text: "Seleccione...", disabled: true, selected: true}, {value: "Profesional", text: "Profesional"}, {value: "Amateur", text: "Amateur / Recreativo"}, {value: "Ninguno", text: "Ninguno / No aplica"}], sequentialReveal: true },
            { id: "dep_nombre_deporte", name: "dep_nombre_deporte", label: "Nombre del Deporte (si aplica):", type: "text", placeholder: "Nombre del Deporte", maxLength: 50, required: false, sequentialReveal: true, conditionalShow: { fieldId: "dep_tipo_practica", values: ["Profesional", "Amateur"] } }, // values: array de valores que disparan
            { id: "dep_frecuencia_deporte", name: "dep_frecuencia_deporte", label: "Frecuencia (si aplica):", type: "select", required: false, options: [{value: "", text: "Seleccione...", disabled: true, selected: true}, {value:"Diario", text:"Diario"}, {value:"Varias veces/semana", text:"Varias veces por semana"}, {value:"1-2 veces/semana", text:"1-2 veces por semana"}, {value:"Ocasional", text:"Ocasional"}, {value:"No aplica", text:"No aplica"}], sequentialReveal: true, conditionalShow: { fieldId: "dep_tipo_practica", values: ["Profesional", "Amateur"] } },
            { type: "divider", text: "Actividades de Riesgo Específicas: Marca si practicas alguna.", fullWidth: true, sequentialReveal: true }, // Para el <hr> y <p>
            { id: "dep_alpinismo", name: "dep_alpinismo", label: "Alpinismo / Montañismo / Escalada", type: "checkbox", value: "true", required: false, sequentialReveal: true },
            { id: "dep_artes_marciales", name: "dep_artes_marciales", label: "Artes marciales (contacto)", type: "checkbox", value: "true", required: false, sequentialReveal: true },
            { id: "dep_automovilismo", name: "dep_automovilismo", label: "Automovilismo / Motociclismo deportivo", type: "checkbox", value: "true", required: false, sequentialReveal: true },
            { id: "dep_boxeo", name: "dep_boxeo", label: "Boxeo", type: "checkbox", value: "true", required: false, sequentialReveal: true },
            { id: "dep_buceo", name: "dep_buceo", label: "Buceo (Scuba)", type: "checkbox", value: "true", required: false, sequentialReveal: true },
            { id: "dep_paracaidismo", name: "dep_paracaidismo", label: "Paracaidismo / Parapente / Ala Delta", type: "checkbox", value: "true", required: false, sequentialReveal: true },
            { id: "dep_tauromaquia", name: "dep_tauromaquia", label: "Tauromaquia", type: "checkbox", value: "true", required: false, sequentialReveal: true },
            { id: "dep_otros_riesgos", name: "dep_otros_riesgos", label: "Otros deportes/actividades de riesgo", type: "checkbox", value: "true", required: false, sequentialReveal: true },
            { id: "dep_descripcion_otros", name: "dep_descripcion_otros", label: "Describe otros (si marcaste la casilla):", type: "text", placeholder: "Describe brevemente", maxLength: 150, required: false, sequentialReveal: true, fullWidth: true, conditionalShow: { fieldId: "dep_otros_riesgos", checked: true } }
        ]
    },
    // --- SECCIÓN INFORMACIÓN MÉDICA ---
    {
        id: "seccion-informacion_medica",
        title: "Información Médica General",
        subtitle: "Responde sí o no a las siguientes preguntas sobre tu salud.",
        fields: [
            { id: "med_padece_enfermedad_group", name: "med_padece_enfermedad", label: "¿Padeces o has padecido alguna enfermedad crónica o relevante? (Ej: diabetes, hipertensión, cáncer, enf. corazón, VIH, hepatitis, enf. neurológicas, etc.)", type: "radio", required: true, defaultValue: "no", options: [{ value: "si", text: "Sí" }, { value: "no", text: "No" }], sequentialReveal: true, fullWidth: true },
            { id: "med_en_tratamiento_group", name: "med_en_tratamiento", label: "¿Te encuentras actualmente bajo tratamiento médico o vigilancia por alguna enfermedad o padecimiento?", type: "radio", required: true, defaultValue: "no", options: [{ value: "si", text: "Sí" }, { value: "no", text: "No" }], sequentialReveal: true, fullWidth: true },
            { id: "med_hospitalizado_cirugia_group", name: "med_hospitalizado_cirugia", label: "¿Has sido hospitalizado, intervenido quirúrgicamente o sufrido algún accidente importante en los últimos 5 años?", type: "radio", required: true, defaultValue: "no", options: [{ value: "si", text: "Sí" }, { value: "no", text: "No" }], sequentialReveal: true, fullWidth: true },
            { id: "med_discapacidad_group", name: "med_discapacidad", label: "¿Tienes alguna discapacidad física o limitación funcional?", type: "radio", required: true, defaultValue: "no", options: [{ value: "si", text: "Sí" }, { value: "no", text: "No" }], sequentialReveal: true, fullWidth: true },
            { id: "med_otro_padecimiento_group", name: "med_otro_padecimiento", label: "¿Tienes algún otro padecimiento, síntoma, estudio pendiente o resultado anormal que no hayas mencionado?", type: "radio", required: true, defaultValue: "no", options: [{ value: "si", text: "Sí" }, { value: "no", text: "No" }], sequentialReveal: true, fullWidth: true },
            { id: "med_detalles_padecimiento", name: "med_detalles_padecimiento", label: "Si respondiste \"Sí\" a alguna pregunta anterior, por favor detalla aquí:", type: "textarea", rows: 4, placeholder: "Describe brevemente el padecimiento, fecha de diagnóstico, tratamiento, estado actual...", required: false, sequentialReveal: true, fullWidth: true }
            // La lógica para requerir 'med_detalles_padecimiento' si alguna de las anteriores es 'si' se manejaría en _formLogic.js
        ]
    },
    // --- SECCIÓN PADECIMIENTOS DETALLE (REPETIBLE) ---
    {
        id: "seccion-padecimientos_detalle",
        title: "Detalle de Padecimientos",
        subtitle: "Proporciona más información si respondiste \"Sí\" en la sección anterior.",
        isRepeatable: true, // Indica que esta sección puede tener múltiples bloques
        repeatableConfig: {
            addButtonLabel: "Añadir Padecimiento",
            blockTitlePrefix: "Padecimiento", // P.ej. "Padecimiento 1", "Padecimiento 2"
            minBlocks: 0, // Mínimo de bloques (0 si es opcional tener alguno)
            maxBlocks: 5  // Máximo de bloques que se pueden añadir
        },
        fields: [ // Campos para UN bloque de padecimiento. El renderer los repetirá con índices.
            { id: "pad_nombre_padecimiento", name: "pad_nombre_padecimiento[]", label: "Nombre del Padecimiento/Diagnóstico:", type: "text", placeholder: "Nombre del Padecimiento", maxLength: 100, required: true, sequentialReveal: true },
            { id: "pad_tipo_evento", name: "pad_tipo_evento[]", label: "Tipo de Evento:", type: "select", required: true, options: [{value:"", text:"Seleccione...", disabled:true, selected:true}, {value:"Enfermedad", text:"Enfermedad"}, {value:"Accidente", text:"Accidente"}, {value:"Congénito", text:"Congénito"}, {value:"Otro", text:"Otro"}], sequentialReveal: true },
            { id: "pad_fecha_inicio", name: "pad_fecha_inicio[]", label: "Fecha de Inicio/Diagnóstico:", type: "date", required: true, sequentialReveal: true },
            { id: "pad_tipo_tratamiento", name: "pad_tipo_tratamiento[]", label: "Tipo de Tratamiento recibido/actual:", type: "select", required: true, options: [{value:"",text:"Seleccione...", disabled:true,selected:true}, {value:"Quirúrgico",text:"Quirúrgico"}, {value:"Médico (fármacos)",text:"Médico (fármacos)"}, {value:"Terapia física/rehabilitación",text:"Terapia física/rehabilitación"}, {value:"Psicológico/Psiquiátrico",text:"Psicológico/Psiquiátrico"}, {value:"Observación/Vigilancia",text:"Observación/Vigilancia"}, {value:"Otro",text:"Otro"}, {value:"Ninguno",text:"Ninguno"}], sequentialReveal: true },
            { id: "pad_hospitalizado_group", name: "pad_hospitalizado[]", label: "¿Requirió hospitalización?", type: "radio", required: true, defaultValue: "no", options: [{value:"si",text:"Sí"},{value:"no",text:"No"}], sequentialReveal: true },
            { id: "pad_duracion_hosp", name: "pad_duracion_hosp[]", label: "Días de hospitalización (si aplica):", type: "number", placeholder: "Días", min:0, required: false, sequentialReveal: true, conditionalShow: {fieldId:"pad_hospitalizado_group", value:"si"} },
            { id: "pad_complicacion", name: "pad_complicacion[]", label: "Complicaciones o secuelas (si hubo):", type: "text", placeholder: "Describe brevemente", maxLength:150, required: false, sequentialReveal: true },
            { id: "pad_toma_medicamento_group", name: "pad_toma_medicamento[]", label: "¿Toma medicamento actualmente para esto?", type: "radio", required: true, defaultValue: "no", options: [{value:"si",text:"Sí"},{value:"no",text:"No"}], sequentialReveal: true },
            { id: "pad_medicamento", name: "pad_medicamento[]", label: "Medicamento, dosis y frecuencia (si aplica):", type: "text", placeholder: "Nombre, dosis, cada cuánto tiempo", maxLength:150, required: false, sequentialReveal: true, conditionalShow: {fieldId:"pad_toma_medicamento_group", value:"si"} },
            { id: "pad_estado_salud", name: "pad_estado_salud[]", label: "Estado de Salud Actual respecto a este padecimiento:", type: "select", required: true, options: [{value:"",text:"Seleccione...",disabled:true,selected:true},{value:"Totalmente recuperado/curado",text:"Totalmente recuperado/curado"},{value:"Estable/Controlado",text:"Estable/Controlado"},{value:"En tratamiento activo",text:"En tratamiento activo"},{value:"Con secuelas leves",text:"Con secuelas leves"},{value:"Con secuelas moderadas/graves",text:"Con secuelas moderadas/graves"}], sequentialReveal: true },
            { id: "pad_medico_tratante", name: "pad_medico_tratante[]", label: "Médico tratante y hospital (si aplica):", type: "text", placeholder: "Nombre del médico y/o clínica/hospital", maxLength:150, required: false, sequentialReveal: true }
        ]
    },
    // --- SECCIÓN PLANES DE SEGURO ---
    {
        id: "seccion-planes_seguro",
        title: "Plan de Seguro Solicitado",
        subtitle: "Detalles de la cobertura que deseas contratar.",
        fields: [
            { id: "plan_nombre_plan", name: "plan_nombre_plan", label: "Nombre del Plan:", type: "text", placeholder: "Ej: Línea Azul Plenitud, GNP Nacional", maxLength: 50, required: true, sequentialReveal: true },
            { id: "plan_tipo_plan", name: "plan_tipo_plan", label: "Tipo de Plan (Cobertura Geográfica):", type: "select", required: true, options: [{value:"",text:"Seleccione...",disabled:true,selected:true},{value:"Nacional",text:"Nacional"},{value:"Internacional",text:"Internacional"},{value:"Regional",text:"Regional (si aplica)"}], sequentialReveal: true },
            { id: "plan_suma_asegurada", name: "plan_suma_asegurada", label: "Suma Asegurada:", type: "number", placeholder: "Monto sin comas ni puntos", step:"1000", min:0, required: true, sequentialReveal: true },
            { id: "plan_tipo_suma_asegurada", name: "plan_tipo_suma_asegurada", label: "Tipo Suma Asegurada:", type: "select", required: false, options: [{value:"",text:"Seleccione...",disabled:true,selected:true},{value:"Por Padecimiento",text:"Por Padecimiento"},{value:"Anual",text:"Anual"},{value:"Vitalicia",text:"Vitalicia"},{value:"Única",text:"Única"}], sequentialReveal: true },
            { id: "plan_deducible", name: "plan_deducible", label: "Deducible:", type: "number", placeholder: "Monto sin comas ni puntos", step:"100", min:0, required: true, sequentialReveal: true },
            { id: "plan_tipo_deducible", name: "plan_tipo_deducible", label: "Tipo Deducible:", type: "select", required: false, defaultValue: "Por evento/padecimiento", options: [{value:"Por evento/padecimiento",text:"Por evento/padecimiento"},{value:"Anual",text:"Anual"},{value:"Otro",text:"Otro (especificar)"}], sequentialReveal: true },
            { id: "plan_coaseguro", name: "plan_coaseguro", label: "Coaseguro (%):", type: "number", placeholder: "Porcentaje Ej: 10", step:"1", min:0, max:100, required: true, sequentialReveal: true },
            { id: "plan_tope_coaseguro", name: "plan_tope_coaseguro", label: "Tope Coaseguro (si aplica):", type: "number", placeholder: "Monto máximo de coaseguro", step:"1000", min:0, required: false, sequentialReveal: true },
            { id: "plan_nivel_hospitalario", name: "plan_nivel_hospitalario", label: "Nivel Hospitalario:", type: "text", placeholder: "Ej: Óptimo, Medio, Básico", maxLength:50, required: false, sequentialReveal: true },
            { id: "plan_folio_riesgo_selecto", name: "plan_folio_riesgo_selecto", label: "Folio Riesgo Selecto (si aplica):", type: "text", placeholder: "Folio asignado", maxLength:50, required: false, sequentialReveal: true }
        ]
    },
    // --- SECCIÓN DETALLES SOLICITUD ---
    {
        id: "seccion-solicitud",
        title: "Detalles de la Solicitud",
        subtitle: "Información adicional sobre esta solicitud específica.",
        fields: [
            { id: "soli_fecha_solicitud", name: "soli_fecha_solicitud", label: "Fecha de Solicitud:", type: "date", required: true, sequentialReveal: true },
            { id: "soli_viaje_extranjero_group", name: "soli_viaje_extranjero", label: "¿Planea viajar o residir fuera de México en los próximos 12 meses?", type: "radio", required: true, defaultValue: "no", options: [{value:"si",text:"Sí"},{value:"no",text:"No"}], sequentialReveal: true },
            { id: "soli_destino_viaje", name: "soli_destino_viaje", label: "Destino(s) y duración del viaje (si aplica):", type: "text", placeholder: "País(es), Ciudad(es) y tiempo estimado", maxLength:200, required: false, sequentialReveal: true, fullWidth: true, conditionalShow: {fieldId:"soli_viaje_extranjero_group", value:"si"} },
            { id: "soli_conversion_individual_group", name: "soli_conversion_individual", label: "¿Esta solicitud es una conversión de una Póliza Colectiva a Individual?", type: "radio", required: true, defaultValue: "no", options: [{value:"si",text:"Sí"},{value:"no",text:"No"}], sequentialReveal: true },
            { id: "soli_poliza_colectiva", name: "soli_poliza_colectiva", label: "Póliza Colectiva Origen (si aplica):", type: "text", placeholder: "No. Póliza Colectiva", maxLength:50, required: false, sequentialReveal: true, conditionalShow: {fieldId:"soli_conversion_individual_group", value:"si"} },
            { id: "soli_certificados", name: "soli_certificados", label: "Certificado(s) Origen (si aplica):", type: "text", placeholder: "No. Certificado(s)", maxLength:100, required: false, sequentialReveal: true, conditionalShow: {fieldId:"soli_conversion_individual_group", value:"si"} },
            { id: "soli_reduccion_periodos_espera_group", name: "soli_reduccion_periodos_espera", label: "¿Solicita Reconocimiento/Reducción de Periodos de Espera por Antigüedad de otra compañía?", type: "radio", required: true, defaultValue: "no", options: [{value:"si",text:"Sí"},{value:"no",text:"No"}], sequentialReveal: true },
            { id: "soli_compania_procedente", name: "soli_compania_procedente", label: "Compañía Procedente (si aplica):", type: "text", placeholder: "Nombre de la Aseguradora anterior", maxLength:100, required: false, sequentialReveal: true, conditionalShow: {fieldId:"soli_reduccion_periodos_espera_group", value:"si"} },
            { id: "soli_poliza_anterior", name: "soli_poliza_anterior", label: "Número de Póliza Anterior (si aplica):", type: "text", placeholder: "No. Póliza Anterior", maxLength:50, required: false, sequentialReveal: true, conditionalShow: {fieldId:"soli_reduccion_periodos_espera_group", value:"si"} },
            { id: "soli_fecha_antiguedad", name: "soli_fecha_antiguedad", label: "Fecha de Antigüedad reconocida (si aplica):", type: "date", required: false, sequentialReveal: true, conditionalShow: {fieldId:"soli_reduccion_periodos_espera_group", value:"si"} },
            { id: "soli_firma_titular", name: "soli_firma_titular", label: "Firma del Titular Solicitante (Adjuntar imagen o PDF):", type: "file", accept:"image/*,.pdf", required: false, sequentialReveal: true },
            { id: "soli_fecha_firma", name: "soli_fecha_firma", label: "Fecha de Firma:", type: "date", required: true, sequentialReveal: true }
        ]
    },
    // --- SECCIÓN CONTRATANTE ---
    {
        id: "seccion-contratante",
        title: "Contratante",
        subtitle: "(Llenar solo si es diferente al Solicitante Titular)",
        fields: [
            { id: "con_igual_titular_group", name: "con_igual_titular", label: "¿El contratante es el mismo que el solicitante titular?", type: "radio", required: true, defaultValue: "si", options: [{value:"si",text:"Sí"},{value:"no",text:"No (Llenar los siguientes campos)"}], sequentialReveal: true, fullWidth: true }
        ],
        // Sub-sección condicional:
        conditionalSubSections: [
            {
                id: "datos-contratante-diferente", // ID del div que contendrá estos campos
                condition: { fieldId: "con_igual_titular_group", value: "no" },
                fields: [ // Los campos que aparecen si la condición se cumple
                    { id: "con_tipo_persona", name: "con_tipo_persona", label: "Tipo Persona:", type: "select", required: true, defaultValue: "Fisica", options: [{value:"Fisica",text:"Física"},{value:"Moral",text:"Moral"}], sequentialReveal: true },
                    { id: "con_codigo_cliente", name: "con_codigo_cliente", label: "Código de cliente (Contratante):", type: "text", placeholder: "Código de cliente (si aplica)", maxLength:20, required: false, sequentialReveal: true },
                    { id: "con_primer_apellido", name: "con_primer_apellido", label: "Primer apellido / Razón Social:", type: "text", placeholder: "Primer apellido o Razón Social", maxLength:100, required: true, sequentialReveal: true },
                    { id: "con_segundo_apellido", name: "con_segundo_apellido", label: "Segundo apellido (si aplica):", type: "text", placeholder: "Segundo apellido", maxLength:50, required: false, sequentialReveal: true },
                    { id: "con_nombres", name: "con_nombres", label: "Nombre(s) (si aplica):", type: "text", placeholder: "Nombre(s)", maxLength:100, required: false, sequentialReveal: true },
                    { id: "con_fecha_nacimiento", name: "con_fecha_nacimiento", label: "Fecha de nacimiento / Constitución:", type: "date", required: true, sequentialReveal: true },
                    { id: "con_rfc", name: "con_rfc", label: "RFC:", type: "text", placeholder: "RFC con homoclave", maxLength:13, required: true, sequentialReveal: true },
                    { id: "con_curp", name: "con_curp", label: "CURP (si aplica):", type: "text", placeholder: "CURP", maxLength:18, required: false, sequentialReveal: true },
                    { id: "con_genero", name: "con_genero", label: "Género (si aplica):", type: "select", required: false, options: [{value:"",text:"Seleccione...",disabled:true,selected:true},{value:"F",text:"Femenino"},{value:"M",text:"Masculino"}], sequentialReveal: true },
                    { id: "con_pais_nacimiento", name: "con_pais_nacimiento", label: "País de nacimiento / Constitución:", type: "text", placeholder: "País", maxLength:50, required: true, sequentialReveal: true },
                    { id: "con_nacionalidad", name: "con_nacionalidad", label: "Nacionalidad:", type: "text", placeholder: "Nacionalidad", maxLength:50, required: true, sequentialReveal: true },
                    { id: "con_ocupacion", name: "con_ocupacion", label: "Ocupación / Giro Mercantil:", type: "text", placeholder: "Ocupación o Giro", maxLength:100, required: true, sequentialReveal: true },
                    { id: "con_actividad_principal", name: "con_actividad_principal", label: "Actividad Económica Principal:", type: "text", placeholder: "Actividad principal", maxLength:150, required: false, sequentialReveal: true },
                    { id: "con_certificado_digital_fiel", name: "con_certificado_digital_fiel", label: "No. serie certificado digital (FIEL):", type: "text", placeholder: "No. serie FIEL (opcional)", maxLength:50, required: false, sequentialReveal: true },
                    { id: "con_email", name: "con_email", label: "Correo electrónico (Contratante):", type: "email", placeholder: "correo@contratante.com", maxLength:100, required: true, sequentialReveal: true },
                    { id: "con_domicilio_fiscal", name: "con_domicilio_fiscal", label: "Domicilio Fiscal Completo:", type: "textarea", rows: 3, placeholder: "Calle, No Ext, No Int, Colonia, CP, Municipio, Estado", required: true, sequentialReveal: true, fullWidth: true },
                    { id: "con_telefono", name: "con_telefono", label: "Teléfono (Contratante):", type: "tel", placeholder: "Teléfono (10 dígitos)", maxLength:20, required: true, sequentialReveal: true },
                    { id: "con_cargo_gobierno_group", name: "con_cargo_gobierno", label: "¿Desempeña o ha desempeñado cargo relevante en gobierno (últimos 12 meses)?", type: "radio", required: true, defaultValue: "no", options: [{value:"si",text:"Sí"},{value:"no",text:"No"}], sequentialReveal: true },
                    { id: "con_cargo_dependencia", name: "con_cargo_dependencia", label: "Cargo y dependencia (si marcó la casilla anterior):", type: "text", placeholder: "Cargo y dependencia", maxLength:100, required: false, sequentialReveal: true, conditionalShow: {fieldId:"con_cargo_gobierno_group", value:"si"} },
                    { id: "con_tipo_identificacion", name: "con_tipo_identificacion", label: "Tipo Identificación Oficial (Contratante):", type: "text", placeholder: "Ej: INE, Pasaporte, Acta Const.", maxLength:50, required: true, sequentialReveal: true },
                    { id: "con_institucion_emisora", name: "con_institucion_emisora", label: "Institución Emisora (Identificación):", type: "text", placeholder: "Ej: INE, SRE, Notario Público", maxLength:50, required: true, sequentialReveal: true },
                    { id: "con_folio_identificacion", name: "con_folio_identificacion", label: "Folio Identificación:", type: "text", placeholder: "Folio/Número de la identificación", maxLength:50, required: true, sequentialReveal: true },
                    { id: "con_relacion_titular", name: "con_relacion_titular", label: "Relación con el Solicitante Titular:", type: "text", placeholder: "Ej: Padre/Madre, Empleador, Otro", maxLength:50, required: true, sequentialReveal: true }
                ]
            }
        ]
    },
    // --- SECCIÓN COBERTURAS ADICIONALES (REPETIBLE) ---
    {
        id: "seccion-coberturas_adicionales",
        title: "Coberturas Adicionales",
        subtitle: "Selecciona las coberturas extra que deseas añadir a tu plan (opcional).",
        isRepeatable: true,
        repeatableConfig: { addButtonLabel: "Añadir Cobertura", blockTitlePrefix: "Cobertura", minBlocks: 0, maxBlocks: 5 },
        fields: [ // Campos para UN bloque
            { id: "cob_nombre", name: "cob_nombre[]", label: "Nombre/Clave Cobertura:", type: "text", placeholder: "Ej: Emergencia en el Extranjero, Ayuda Maternidad", maxLength:100, required: false, sequentialReveal: true },
            { id: "cob_suma_asegurada", name: "cob_suma_asegurada[]", label: "Suma Asegurada (si aplica):", type: "number", placeholder: "Monto", step:"1000", min:0, required: false, sequentialReveal: true },
            { id: "cob_prima", name: "cob_prima[]", label: "Prima Adicional (si se conoce):", type: "number", placeholder: "Prima", step:"0.01", min:0, required: false, sequentialReveal: true }
        ]
    },
    // --- SECCIÓN BENEFICIARIOS (REPETIBLE) ---
    {
        id: "seccion-beneficiarios",
        title: "Beneficiarios",
        subtitle: "Personas designadas para recibir la indemnización por fallecimiento.",
        isRepeatable: true,
        repeatableConfig: { addButtonLabel: "Añadir Beneficiario", blockTitlePrefix: "Beneficiario", minBlocks: 1, maxBlocks: 10, summaryNote: "Nota: La suma de los porcentajes de los beneficiarios principales debe ser 100%." },
        fields: [ // Campos para UN bloque
            { id: "ben_primer_apellido", name: "ben_primer_apellido[]", label: "Primer apellido:", type: "text", placeholder: "Primer apellido", maxLength:50, required: true, sequentialReveal: true },
            { id: "ben_segundo_apellido", name: "ben_segundo_apellido[]", label: "Segundo apellido:", type: "text", placeholder: "Segundo apellido (si aplica)", maxLength:50, required: false, sequentialReveal: true },
            { id: "ben_nombres", name: "ben_nombres[]", label: "Nombre(s):", type: "text", placeholder: "Nombre(s)", maxLength:100, required: true, sequentialReveal: true },
            { id: "ben_fecha_nacimiento", name: "ben_fecha_nacimiento[]", label: "Fecha de nacimiento:", type: "date", required: false, sequentialReveal: true },
            { id: "ben_genero", name: "ben_genero[]", label: "Género:", type: "select", required: false, options: [{value:"",text:"Seleccione...",disabled:true,selected:true},{value:"F",text:"Femenino"},{value:"M",text:"Masculino"}], sequentialReveal: true },
            { id: "ben_telefono", name: "ben_telefono[]", label: "Teléfono (opcional):", type: "tel", placeholder: "Teléfono de contacto", maxLength:20, required: false, sequentialReveal: true },
            { id: "ben_domicilio", name: "ben_domicilio[]", label: "Domicilio:", type: "textarea", rows:2, placeholder: "Domicilio Completo (Calle, No, Colonia, CP, Ciudad, Estado)", required: false, sequentialReveal: true, fullWidth: true },
            { id: "ben_relacion_solicitante", name: "ben_relacion_solicitante[]", label: "Parentesco con Solicitante Titular:", type: "text", placeholder: "Ej: Cónyuge, Hijo(a), Padre/Madre, Hermano(a)", maxLength:50, required: true, sequentialReveal: true },
            { id: "ben_porcentaje_cobertura", name: "ben_porcentaje_cobertura[]", label: "Porcentaje (%):", type: "number", placeholder: "%", step:"1", min:1, max:100, required: true, sequentialReveal: true },
            { id: "ben_es_contingente", name: "ben_es_contingente[]", label: "¿Es beneficiario contingente? (Recibe solo si el/los principal(es) fallecen antes)", type: "checkbox", value:"true", required: false, sequentialReveal: true, fullWidth: true }
        ]
    },
    // --- SECCIÓN FORMA DE PAGO ---
    {
        id: "seccion-forma_pago",
        title: "Forma de Pago",
        subtitle: "Elige cómo deseas pagar tu póliza.",
        fields: [
            { id: "pago_forma_pago", name: "pago_forma_pago", label: "Forma de Pago (Periodicidad):", type: "select", required: true, options: [{value:"",text:"Seleccione...",disabled:true,selected:true},{value:"Anual",text:"Anual"},{value:"Semestral",text:"Semestral"},{value:"Trimestral",text:"Trimestral"},{value:"Mensual",text:"Mensual"}], sequentialReveal: true },
            { id: "pago_via_pago", name: "pago_via_pago", label: "Medio de Pago Inicial y/o Recurrente:", type: "select", required: true, options: [{value:"",text:"Seleccione...",disabled:true,selected:true},{value:"Tarjeta Crédito",text:"Tarjeta de Crédito"},{value:"Tarjeta Débito",text:"Tarjeta de Débito"},{value:"CLABE",text:"Cuenta CLABE (Domiciliación)"},{value:"Referencia Bancaria",text:"Referencia Bancaria (Pago en ventanilla/SPEI)"},{value:"Otro",text:"Otro"}], sequentialReveal: true }
        ],
        // Sub-sección condicional para datos de tarjeta/CLABE:
        conditionalSubSections: [
            {
                id: "datos-pago-tarjeta-clabe", // ID del div contenedor
                condition: { fieldId: "pago_via_pago", values: ["Tarjeta Crédito", "Tarjeta Débito", "CLABE"] }, // Mostrar si es alguna de estas opciones
                fields: [
                    { id: "pago_tipo_cuenta", name: "pago_tipo_cuenta", label: "Tipo (si aplica):", type: "select", required: false, options: [{value:"",text:"Seleccione...",disabled:true,selected:true},{value:"Crédito",text:"Crédito"},{value:"Débito",text:"Débito"},{value:"CLABE",text:"CLABE (Domiciliación)"}], sequentialReveal: true },
                    { id: "pago_numero_tarjeta_cuenta", name: "pago_numero_tarjeta_cuenta", label: "Número Tarjeta (16 dígitos) / Cuenta CLABE (18 dígitos):", type: "text", placeholder: "Número completo", maxLength:18, inputmode:"numeric", required: true, sequentialReveal: true },
                    { id: "pago_fecha_vencimiento", name: "pago_fecha_vencimiento", label: "Fecha Vencimiento (Tarjeta):", type: "text", placeholder: "MM/AA", maxLength:5, required: false, sequentialReveal: true, conditionalShow: { fieldId:"pago_via_pago", values:["Tarjeta Crédito", "Tarjeta Débito"] } },
                    { id: "pago_cvv", name: "pago_cvv", label: "CVV (Tarjeta):", type: "text", placeholder: "3 o 4 dígitos", maxLength:4, inputmode:"numeric", required: false, sequentialReveal: true, conditionalShow: { fieldId:"pago_via_pago", values:["Tarjeta Crédito", "Tarjeta Débito"] } },
                    { id: "pago_banco", name: "pago_banco", label: "Banco Emisor:", type: "text", placeholder: "Nombre del Banco", maxLength:50, required: true, sequentialReveal: true },
                    { id: "pago_titular_igual_contratante", name: "pago_titular_igual_contratante", label: "El titular de la cuenta/tarjeta es el mismo Contratante de la póliza.", type: "checkbox", value:"true", checkedByDefault: true, required: false, sequentialReveal: true, fullWidth: true }
                ]
            },
            {
                id: "datos-tarjetahabiente-diferente",
                condition: { fieldId: "pago_titular_igual_contratante", checked: false }, // Mostrar si el checkbox anterior NO está marcado
                fields: [
                    { id: "pago_nombre_titular_cuenta", name: "pago_nombre_titular_cuenta", label: "Nombre Completo del Titular de la Cuenta/Tarjeta:", type: "text", placeholder: "Nombre Completo", maxLength:150, required: true, sequentialReveal: true },
                    { id: "pago_rfc_titular_cuenta", name: "pago_rfc_titular_cuenta", label: "RFC del Titular de la Cuenta/Tarjeta:", type: "text", placeholder: "RFC con homoclave", maxLength:13, required: true, sequentialReveal: true },
                    { id: "pago_parentesco_titular", name: "pago_parentesco_titular", label: "Parentesco con el Contratante:", type: "text", placeholder: "Ej: Cónyuge, Padre/Madre, Hijo(a)", maxLength:50, required: true, sequentialReveal: true },
                    { id: "pago_autorizacion_cargo", name: "pago_autorizacion_cargo", label: "Autorización de Cargo a Terceros (Adjuntar formato):", type: "file", accept:"image/*,.pdf", required: true, sequentialReveal: true }
                ]
            }
        ]
    },
    // --- SECCIÓN DECLARACIONES LEGALES ---
    {
        id: "seccion-declaraciones_legales",
        title: "Declaraciones y Consentimientos",
        subtitle: "Confirmaciones importantes para continuar.",
        fields: [
            { id: "dec_nexos_delincuencia_group", name: "dec_nexos_delincuencia", label: "¿Usted, el contratante o algún beneficiario tiene o ha tenido relación con actividades consideradas ilícitas o vinculadas a la delincuencia organizada?", type: "radio", required: true, defaultValue:"no", options: [{value:"si",text:"Sí"},{value:"no",text:"No"}], sequentialReveal: true, fullWidth: true },
            { id: "dec_detalles_nexos", name: "dec_detalles_nexos", label: "En caso afirmativo, explique brevemente:", type: "textarea", rows:3, placeholder: "Explique la situación", required: false, sequentialReveal: true, fullWidth: true, conditionalShow: {fieldId:"dec_nexos_delincuencia_group", value:"si"} },
            { type: "divider", fullWidth: true, sequentialReveal: true },
            { type: "staticText", text: "Consentimientos:", style: "font-weight: bold; display: block; margin-bottom: 10px;", fullWidth: true, sequentialReveal: true },
            { id: "dec_consentimiento_datos", name: "dec_consentimiento_datos", labelHtml: "He leído y acepto el <a href=\"/aviso-privacidad\" target=\"_blank\" title=\"Abrir Aviso de Privacidad en nueva pestaña\">Aviso de Privacidad</a> y otorgo mi consentimiento para el tratamiento de mis datos personales, incluyendo los sensibles, para los fines informados.", type: "checkbox", value:"true", required: true, sequentialReveal: true, fullWidth: true },
            { id: "dec_comunicaciones", name: "dec_comunicaciones", label: "Acepto recibir comunicaciones relacionadas con mi póliza, pagos y servicios por medios electrónicos (correo electrónico, SMS, WhatsApp).", type: "checkbox", value:"true", checkedByDefault: true, required: false, sequentialReveal: true, fullWidth: true },
            { id: "dec_email_entrega_documentos", name: "dec_email_entrega_documentos", label: "Confirmo que el correo electrónico para entrega de documentos contractuales (póliza, condiciones) es:", type: "email", placeholder: "Confirma tu correo principal", maxLength:100, required: true, sequentialReveal: true, fullWidth: true },
            { id: "dec_veracidad_informacion", name: "dec_veracidad_informacion", label: "Declaro bajo protesta de decir verdad que toda la información proporcionada en esta solicitud es completa y verídica.", type: "checkbox", value:"true", required: true, sequentialReveal: true, fullWidth: true },
            { id: "dec_firma_electronica", name: "dec_firma_electronica", label: "Acepto el uso de medios electrónicos y/o mi firma electrónica/autógrafa digitalizada para formalizar esta solicitud y la futura póliza.", type: "checkbox", value:"true", required: false, sequentialReveal: true, fullWidth: true }
        ]
    },
    // --- SECCIÓN AGENTE ---
    {
        id: "seccion-agente",
        title: "Información del Agente",
        subtitle: "Datos del intermediario de seguros.",
        fields: [
            { id: "agente_nombre", name: "agente_nombre", label: "Nombre Completo del Agente:", type: "text", placeholder: "Nombre Completo", maxLength:100, required: true, sequentialReveal: true },
            { id: "agente_clave", name: "agente_clave", label: "Clave del Agente:", type: "text", placeholder: "Clave asignada por GNP", maxLength:20, required: true, sequentialReveal: true },
            { id: "agente_nombre_2", name: "agente_nombre_2", label: "Nombre Agente 2 (si aplica):", type: "text", placeholder: "Nombre Completo Agente 2", maxLength:100, required: false, sequentialReveal: true },
            { id: "agente_clave_2", name: "agente_clave_2", label: "Clave Agente 2 (si aplica):", type: "text", placeholder: "Clave Agente 2", maxLength:20, required: false, sequentialReveal: true },
            { id: "agente_distribucion", name: "agente_distribucion", label: "Distribución de Comisión Agente 1 (%):", type: "number", placeholder: "%", step:"0.1", min:0, max:100, defaultValue: "100", required: false, sequentialReveal: true },
            { id: "agente_distribucion_2", name: "agente_distribucion_2", label: "Distribución de Comisión Agente 2 (%):", type: "number", placeholder: "%", step:"0.1", min:0, max:100, defaultValue: "0", required: false, sequentialReveal: true },
            { id: "agente_fecha_conocimiento", name: "agente_fecha_conocimiento", label: "Fecha desde que conoce al Cliente/Contratante:", type: "text", placeholder: "MM/AAAA", maxLength:7, required: false, sequentialReveal: true },
            { id: "agente_recomendacion_group", name: "agente_recomendacion", label: "¿Recomienda al solicitante para ser asegurado por GNP?", type: "radio", required: true, defaultValue: "si", options: [{value:"si",text:"Sí"},{value:"no",text:"No"}], sequentialReveal: true },
            { id: "agente_observaciones", name: "agente_observaciones", label: "Observaciones del Agente:", type: "textarea", rows:3, placeholder: "Comentarios relevantes sobre el cliente o la solicitud", required: false, sequentialReveal: true, fullWidth: true },
            { id: "agente_firma", name: "agente_firma", label: "Firma del Agente (Adjuntar imagen o PDF):", type: "file", accept:"image/*,.pdf", required: false, sequentialReveal: true },
            { id: "agente_fecha_firma", name: "agente_fecha_firma", label: "Fecha Firma Agente:", type: "date", required: true, sequentialReveal: true }
        ]
    },
    // --- SECCIÓN DE REVISIÓN (Especial) ---
    {
        id: "seccion-revision",
        title: "Revisa tu información",
        subtitle: "Por favor, verifica cuidadosamente que todos los datos sean correctos antes de enviar.",
        isReviewSection: true, // Marcador especial
        fields: [] // No tiene campos de entrada directos, el contenido se genera en #resumen-final
    }
];