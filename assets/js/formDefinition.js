// GNP_Local/assets/js/formDefinition.js

export const formSections = [
    // --- 1. SECCIÓN SOLICITANTES ---
    {
        id: "seccion-solicitantes",
        title: "Solicitantes",
        subtitle: "Comencemos con tus datos personales.",
        // CAMBIO: Habilitar la funcionalidad para añadir más de un asegurado.
        // NOTA: Esto requiere lógica adicional en _formRenderer.js para funcionar completamente.
        isRepeatable: true,
        repeatableConfig: {
            addButtonLabel: "Añadir Otro Asegurado",
            blockTitlePrefix: "Asegurado",
            minBlocks: 1,
            maxBlocks: 10
        },
        fields: [
            // CAMBIO: Se ajustan los 'name' para que funcionen como arrays en el backend.
            { id: "sol_primer_apellido", name: "sol_primer_apellido[]", label: "Primer apellido:", type: "text", placeholder: "Primer apellido", maxLength: 50, required: true, sequentialReveal: true },
            { id: "sol_segundo_apellido", name: "sol_segundo_apellido[]", label: "Segundo apellido:", type: "text", placeholder: "Segundo apellido", maxLength: 50, required: true, sequentialReveal: true },
            { id: "sol_nombres", name: "sol_nombres[]", label: "Nombre(s):", type: "text", placeholder: "Nombre(s)", maxLength: 100, required: true, sequentialReveal: true },
            { id: "sol_fecha_nacimiento", name: "sol_fecha_nacimiento[]", label: "Fecha de nacimiento:", type: "date", required: true, sequentialReveal: true },
            { id: "sol_rfc", name: "sol_rfc[]", label: "RFC:", type: "text", placeholder: "RFC con homoclave", maxLength: 13, tooltipText: "El Registro Federal de Contribuyentes (RFC) es una clave única de registro utilizada en México para identificar a cada persona física o moral con actividad económica. Formato: XXXX000000XXX", required: true, sequentialReveal: true },
            { id: "sol_curp", name: "sol_curp[]", label: "CURP:", type: "text", placeholder: "CURP", maxLength: 18, required: true, sequentialReveal: true },
            { id: "sol_pais_nacimiento", name: "sol_pais_nacimiento[]", label: "País de nacimiento:", type: "text", placeholder: "País de nacimiento", maxLength: 50, required: true, sequentialReveal: true },
            { id: "sol_nacionalidad", name: "sol_nacionalidad[]", label: "Nacionalidad:", type: "text", placeholder: "Nacionalidad", maxLength: 50, required: true, sequentialReveal: true },
            { id: "sol_ocupacion", name: "sol_ocupacion[]", label: "Ocupación:", type: "text", placeholder: "Ocupación", maxLength: 100, required: true, sequentialReveal: true },
            { id: "sol_genero", name: "sol_genero[]", label: "Género:", type: "select", required: true, sequentialReveal: true, options: [{ value: "", text: "Seleccione...", disabled: true, selected: true }, { value: "F", text: "Femenino" }, { value: "M", text: "Masculino" }] },
            { id: "sol_email", name: "sol_email[]", label: "Correo electrónico:", type: "email", placeholder: "Correo electrónico", maxLength: 100, required: true, sequentialReveal: true },
            { id: "sol_estatura", name: "sol_estatura[]", label: "Estatura (metros):", type: "number", placeholder: "Ej: 1.75", step: "0.01", min: "0.5", max: "2.5", required: true, sequentialReveal: true },
            { id: "sol_peso", name: "sol_peso[]", label: "Peso (kg):", type: "number", placeholder: "Ej: 70.5", step: "0.1", min: "10", max: "300", required: true, sequentialReveal: true },
            { id: "sol_tipo_identificacion", name: "sol_tipo_identificacion[]", label: "Tipo Identificación Oficial:", type: "text", placeholder: "Ej: INE, Pasaporte", maxLength: 50, required: true, sequentialReveal: true },
            { id: "sol_institucion_emisora", name: "sol_institucion_emisora[]", label: "Institución Emisora:", type: "text", placeholder: "Ej: INE, SRE", maxLength: 50, required: true, sequentialReveal: true },
            { id: "sol_folio_identificacion", name: "sol_folio_identificacion[]", label: "Folio de la Identificación:", type: "text", placeholder: "Folio/Número", maxLength: 50, required: true, sequentialReveal: true },
            { id: "sol_cargo_gobierno", name: "sol_cargo_gobierno[]", label: "¿Desempeñó cargo en gobierno?", type: "checkbox", value: "true", required: false, sequentialReveal: true },
            { id: "sol_cargo_dependencia", name: "sol_cargo_dependencia[]", label: "Cargo y dependencia (si aplica):", type: "text", placeholder: "Cargo y dependencia", maxLength: 100, required: false, sequentialReveal: true, conditionalShow: { fieldId: "sol_cargo_gobierno", checked: true } }
        ]
    },
    // --- 2. SECCIÓN CONTRATANTE (Reordenada y con lógica Física/Moral) ---
    {
        id: "seccion-contratante",
        title: "Contratante",
        subtitle: "(Llenar solo si es diferente al Solicitante Titular)",
        fields: [
            { id: "con_igual_titular_group", name: "con_igual_titular", label: "¿El contratante es el mismo que el solicitante titular?", type: "radio", required: true, defaultValue: "si", options: [{value:"si",text:"Sí"},{value:"no",text:"No (Llenar los siguientes campos)"}], sequentialReveal: true, fullWidth: true }
        ],
        conditionalSubSections: [
            {
                id: "datos-contratante-diferente",
                condition: { fieldId: "con_igual_titular", value: "no" },
                fields: [
                    { id: "con_tipo_persona", name: "con_tipo_persona", label: "Tipo Persona:", type: "select", required: true, defaultValue: "Fisica", options: [{value:"Fisica",text:"Física"},{value:"Moral",text:"Moral"}], sequentialReveal: true },
                    { id: "con_codigo_cliente", name: "con_codigo_cliente", label: "Código de cliente (Contratante):", type: "text", placeholder: "Código de cliente (si aplica)", maxLength:20, required: false, sequentialReveal: true },
                    
                    // CAMBIO: Lógica para Persona Física / Moral
                    { id: "con_razon_social", name: "con_razon_social", label: "Razón Social:", type: "text", placeholder: "Razón Social completa", maxLength: 150, required: true, sequentialReveal: true, conditionalShow: { fieldId: "con_tipo_persona", value: "Moral" } },
                    { id: "con_primer_apellido", name: "con_primer_apellido", label: "Primer apellido:", type: "text", placeholder: "Primer apellido", maxLength:100, required: true, sequentialReveal: true, conditionalShow: { fieldId: "con_tipo_persona", value: "Fisica" } },
                    { id: "con_segundo_apellido", name: "con_segundo_apellido", label: "Segundo apellido:", type: "text", placeholder: "Segundo apellido", maxLength:50, required: false, sequentialReveal: true, conditionalShow: { fieldId: "con_tipo_persona", value: "Fisica" } },
                    { id: "con_nombres", name: "con_nombres", label: "Nombre(s):", type: "text", placeholder: "Nombre(s)", maxLength:100, required: false, sequentialReveal: true, conditionalShow: { fieldId: "con_tipo_persona", value: "Fisica" } },
                    
                    { id: "con_fecha_nacimiento", name: "con_fecha_nacimiento", label: "Fecha de nacimiento / Constitución:", type: "date", required: true, sequentialReveal: true },
                    { id: "con_rfc", name: "con_rfc", label: "RFC:", type: "text", placeholder: "RFC con homoclave", maxLength:13, required: true, sequentialReveal: true },
                    { id: "con_curp", name: "con_curp", label: "CURP (si aplica):", type: "text", placeholder: "CURP", maxLength:18, required: false, sequentialReveal: true, conditionalShow: { fieldId: "con_tipo_persona", value: "Fisica" } },
                    { id: "con_genero", name: "con_genero", label: "Género (si aplica):", type: "select", required: false, options: [{value:"",text:"Seleccione...",disabled:true,selected:true},{value:"F",text:"Femenino"},{value:"M",text:"Masculino"}], sequentialReveal: true, conditionalShow: { fieldId: "con_tipo_persona", value: "Fisica" } },
                    
                    { id: "con_pais_nacimiento", name: "con_pais_nacimiento", label: "País de nacimiento / Constitución:", type: "text", placeholder: "País", maxLength:50, required: true, sequentialReveal: true },
                    { id: "con_nacionalidad", name: "con_nacionalidad", label: "Nacionalidad:", type: "text", placeholder: "Nacionalidad", maxLength:50, required: true, sequentialReveal: true },
                    { id: "con_ocupacion", name: "con_ocupacion", label: "Ocupación / Giro Mercantil:", type: "text", placeholder: "Ocupación o Giro", maxLength:100, required: true, sequentialReveal: true },
                    { id: "con_actividad_principal", name: "con_actividad_principal", label: "Actividad Económica Principal:", type: "text", placeholder: "Actividad principal", maxLength:150, required: false, sequentialReveal: true },
                    { id: "con_email", name: "con_email", label: "Correo electrónico (Contratante):", type: "email", placeholder: "correo@contratante.com", maxLength:100, required: true, sequentialReveal: true },
                    { id: "con_domicilio_fiscal", name: "con_domicilio_fiscal", label: "Domicilio Fiscal Completo:", type: "textarea", rows: 3, placeholder: "Calle, No Ext, No Int, Colonia, CP, Municipio, Estado", required: true, sequentialReveal: true, fullWidth: true },
                    { id: "con_telefono", name: "con_telefono", label: "Teléfono (Contratante):", type: "tel", placeholder: "Teléfono (10 dígitos)", maxLength:20, required: true, sequentialReveal: true },
                    { id: "con_cargo_gobierno_group", name: "con_cargo_gobierno", label: "¿Representante legal desempeña o ha desempeñado cargo en gobierno?", type: "radio", required: true, defaultValue: "no", options: [{value:"si",text:"Sí"},{value:"no",text:"No"}], sequentialReveal: true },
                    { id: "con_cargo_dependencia", name: "con_cargo_dependencia", label: "Cargo y dependencia (si marcó Sí):", type: "text", placeholder: "Cargo y dependencia", maxLength:100, required: false, sequentialReveal: true, conditionalShow: {fieldId:"con_cargo_gobierno_group", value:"si"} },
                    { id: "con_tipo_identificacion", name: "con_tipo_identificacion", label: "Tipo Identificación Oficial (Representante Legal):", type: "text", placeholder: "Ej: INE, Pasaporte, Acta Const.", maxLength:50, required: true, sequentialReveal: true },
                    { id: "con_institucion_emisora", name: "con_institucion_emisora", label: "Institución Emisora:", type: "text", placeholder: "Ej: INE, SRE, Notario Público", maxLength:50, required: true, sequentialReveal: true },
                    { id: "con_folio_identificacion", name: "con_folio_identificacion", label: "Folio Identificación:", type: "text", placeholder: "Folio/Número", maxLength:50, required: true, sequentialReveal: true },
                    { id: "con_relacion_titular", name: "con_relacion_titular", label: "Relación con el Solicitante Titular:", type: "text", placeholder: "Ej: Padre/Madre, Empleador, Otro", maxLength:50, required: true, sequentialReveal: true }
                ]
            }
        ]
    },
    // --- 3. SECCIÓN DOMICILIOS ---
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
            { id: "dom_telefono", name: "dom_telefono", label: "Teléfono Fijo:", type: "tel", placeholder: "Teléfono Fijo", maxLength: 20, required: false, sequentialReveal: true },
            { id: "dom_celular", name: "dom_celular", label: "Teléfono Celular:", type: "tel", placeholder: "Teléfono Celular (10 dígitos)", maxLength: 20, required: true, sequentialReveal: true },
            { id: "dom_extension", name: "dom_extension", label: "Extensión:", type: "text", placeholder: "Extensión (si aplica)", maxLength: 10, required: false, sequentialReveal: true }
        ]
    },
    // --- 4. SECCIÓN ACTIVIDADES DE RIESGO ---
    {
        id: "seccion-actividades_riesgo",
        title: "Actividades de Riesgo",
        subtitle: "Indica si realizas alguna de estas actividades por tu ocupación o pasatiempo.",
        fields: [
            { id: "act_labores_administrativas", name: "act_labores_administrativas", label: "Labores Administrativas", type: "checkbox", value: "true", required: false, sequentialReveal: false },
            { id: "act_operador_maquinaria_pesada", name: "act_operador_maquinaria_pesada", label: "Operador Maquinaria Pesada", type: "checkbox", value: "true", required: false, sequentialReveal: false },
            { id: "act_trabaja_explosivos", name: "act_trabaja_explosivos", label: "Trabaja con Explosivos", type: "checkbox", value: "true", required: false, sequentialReveal: false },
            { id: "act_visita_obras", name: "act_visita_obras", label: "Visita Obras en Construcción/Campo", type: "checkbox", value: "true", required: false, sequentialReveal: false },
            // CAMBIO: Mensaje de alerta actualizado
            { id: "act_uso_armas", name: "act_uso_armas", label: "Uso/Portación de Armas", type: "checkbox", value: "true", required: false, sequentialReveal: false, 
              alertOnCheck: { 
                  type: 'error', 
                  title: 'Aviso de Riesgo Agravado', 
                  message: 'La portación de armas puede ser motivo para que la aseguradora revoque el contrato o decline la solicitud. El caso será turnado a un análisis especial.'
              } 
            },
            { id: "act_actividad_agricola", name: "act_actividad_agricola", label: "Realiza Actividad Agrícola/Ganadera", type: "checkbox", value: "true", required: false, sequentialReveal: false },
            { id: "act_utiliza_motocicleta", name: "act_utiliza_motocicleta", label: "Utiliza Motocicleta Regularmente", type: "checkbox", value: "true", required: false, sequentialReveal: false },
            { id: "act_moto_tipo_uso", name: "act_moto_tipo_uso", label: "Tipo de Uso de Motocicleta:", type: "select", required: true, options: [{value:"", text:"Seleccione..."}, {value:"Personal", text:"Personal/Transporte"}, {value:"Trabajo", text:"Trabajo/Reparto"}, {value:"Deportivo", text:"Deportivo/Recreativo"}], fullWidth: true, conditionalShow: { fieldId: "act_utiliza_motocicleta", checked: true } },
            { id: "act_moto_cilindrada", name: "act_moto_cilindrada", label: "Cilindrada (cc):", type: "text", placeholder: "Ej: 250", required: true, fullWidth: true, conditionalShow: { fieldId: "act_utiliza_motocicleta", checked: true } },
            { id: "act_viaja_aviones_particulares", name: "act_viaja_aviones_particulares", label: "Viaja en Aviones Particulares/No Comerciales", type: "checkbox", value: "true", required: false, sequentialReveal: false },
            { id: "act_avion_tipo_vuelo", name: "act_avion_tipo_vuelo", label: "Rol en Vuelo:", type: "select", required: true, options: [{value:"", text:"Seleccione..."}, {value:"Piloto", text:"Piloto"}, {value:"Copiloto", text:"Copiloto/Tripulación"}, {value:"Pasajero", text:"Pasajero"}], fullWidth: true, conditionalShow: { fieldId: "act_viaja_aviones_particulares", checked: true } },
            { id: "act_avion_horas_anuales", name: "act_avion_horas_anuales", label: "Horas de Vuelo Anuales (aprox.):", type: "number", placeholder: "Ej: 50", required: true, fullWidth: true, conditionalShow: { fieldId: "act_viaja_aviones_particulares", checked: true } },
            { id: "act_otra_actividad_riesgo", name: "act_otra_actividad_riesgo", label: "Otra actividad de riesgo no listada:", type: "text", placeholder: "Describe brevemente (si aplica)", maxLength: 150, required: false, sequentialReveal: false, fullWidth: true }
        ]
    },
    // --- 5. SECCIÓN HÁBITOS ---
    {
        id: "seccion-habitos",
        title: "Hábitos",
        subtitle: "Información relevante sobre tu estilo de vida.",
        fields: [
            { id: "hab_fuma_group", name: "hab_fuma", label: "¿Fuma actualmente?", type: "radio", required: true, defaultValue: "no", options: [{ value: "si", text: "Sí" }, { value: "no", text: "No" }], sequentialReveal: false },
            { id: "hab_cigarrillos_dia", name: "hab_cigarrillos_dia", label: "Cigarrillos al día (si fuma):", type: "number", placeholder: "Cantidad", min: 0, required: false, sequentialReveal: false, conditionalShow: { fieldId: "hab_fuma", value: "si" } },
            { id: "hab_cuando_dejo_fumar", name: "hab_cuando_dejo_fumar", label: "Si dejó de fumar, ¿hace cuánto tiempo?", type: "text", placeholder: "Ej: 2 años, 6 meses", maxLength: 50, required: false, sequentialReveal: false, conditionalShow: { fieldId: "hab_fuma", value: "no" } },
            { id: "hab_consume_alcohol_group", name: "hab_consume_alcohol", label: "¿Consume bebidas alcohólicas?", type: "radio", required: true, defaultValue: "no", options: [{ value: "si", text: "Sí" }, { value: "no", text: "No" }], sequentialReveal: true },
            { id: "hab_frecuencia_alcohol", name: "hab_frecuencia_alcohol", label: "Frecuencia y cantidad (si consume alcohol):", type: "text", placeholder: "Ej: 2 copas fines de semana", maxLength: 100, required: false, sequentialReveal: false, conditionalShow: { fieldId: "hab_consume_alcohol", value: "si" } },
            { id: "hab_consume_drogas_group", name: "hab_consume_drogas", label: "¿Consume o ha consumido drogas (no prescritas)?", type: "radio", required: true, defaultValue: "no", options: [{ value: "si", text: "Sí" }, { value: "no", text: "No" }], sequentialReveal: false },
            { id: "hab_tipo_droga_frecuencia", name: "hab_tipo_droga_frecuencia", label: "Tipo de droga y frecuencia (si consume):", type: "text", placeholder: "Describe brevemente", maxLength: 150, required: false, sequentialReveal: false, conditionalShow: { fieldId: "hab_consume_drogas", value: "si" } },{ id: "pregunta-embarazo", isGroupWrapper: true, label: "", type: "groupWrapper", sequentialReveal: false, conditionalShow: { fieldId: "sol_genero", value: "F" }, fields: [ { id: "hab_embarazada_group", name: "hab_embarazada", label: "¿Está actualmente embarazada? (Aplicable a mujeres)", type: "radio", required: true, defaultValue: "no", options: [{ value: "si", text: "Sí" }, { value: "no", text: "No" }, { value: "na", text: "No Aplica" }], sequentialReveal: false } ] },
            { id: "hab_semanas_embarazo", name: "hab_semanas_embarazo", label: "Semanas de gestación (si está embarazada):", type: "number", placeholder: "Semanas", min: 0, max: 45, required: false, sequentialReveal: false, conditionalShow: { fieldId: "hab_embarazada_group", value: "si" } }
        ]
    },
    // --- 6. SECCIÓN DEPORTES ---
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
            { id: "dep_otros_riesgos", name: "dep_otros_riesgos", label: "Otros deportes/actividades de riesgo", type: "checkbox", value: "true", required: false, sequentialReveal: true },{ id: "dep_descripcion_otros", name: "dep_descripcion_otros", label: "Describe otros (si marcaste la casilla):", type: "text", placeholder: "Describe brevemente", maxLength: 150, required: false, sequentialReveal: true, fullWidth: true, conditionalShow: { fieldId: "dep_otros_riesgos", checked: true } }
        ]
    },
    // --- 7. SECCIÓN INFORMACIÓN MÉDICA (Ahora incluye padecimientos) ---
    {
        id: "seccion-informacion_medica",
        title: "Información Médica y Padecimientos",
        subtitle: "Responde sobre tu salud y detalla cualquier padecimiento relevante.",
        fields: [
            { id: "med_padece_enfermedad_group", name: "med_padece_enfermedad", label: "¿Padeces o has padecido alguna enfermedad crónica o relevante? (Ej: diabetes, hipertensión, cáncer, enf. corazón, VIH, hepatitis, enf. neurológicas, etc.)", type: "radio", required: true, defaultValue: "no", options: [{ value: "si", text: "Sí" }, { value: "no", text: "No" }], sequentialReveal: true, fullWidth: true },
            { id: "med_en_tratamiento_group", name: "med_en_tratamiento", label: "¿Te encuentras actualmente bajo tratamiento médico o vigilancia por alguna enfermedad o padecimiento?", type: "radio", required: true, defaultValue: "no", options: [{ value: "si", text: "Sí" }, { value: "no", text: "No" }], sequentialReveal: true, fullWidth: true },
            { id: "med_hospitalizado_cirugia_group", name: "med_hospitalizado_cirugia", label: "¿Has sido hospitalizado, intervenido quirúrgicamente o sufrido algún accidente importante en los últimos 5 años?", type: "radio", required: true, defaultValue: "no", options: [{ value: "si", text: "Sí" }, { value: "no", text: "No" }], sequentialReveal: true, fullWidth: true },
            { id: "med_discapacidad_group", name: "med_discapacidad", label: "¿Tienes alguna discapacidad física o limitación funcional?", type: "radio", required: true, defaultValue: "no", options: [{ value: "si", text: "Sí" }, { value: "no", text: "No" }], sequentialReveal: true, fullWidth: true },
            { id: "med_otro_padecimiento_group", name: "med_otro_padecimiento", label: "¿Tienes algún otro padecimiento, síntoma, estudio pendiente o resultado anormal que no hayas mencionado?", type: "radio", required: true, defaultValue: "no", options: [{ value: "si", text: "Sí" }, { value: "no", text: "No" }], sequentialReveal: true, fullWidth: true },
            { id: "med_detalles_padecimiento", name: "med_detalles_padecimiento", label: "Si respondiste \"Sí\" a alguna pregunta anterior, por favor detalla aquí:", type: "textarea", rows: 4, placeholder: "Describe brevemente el padecimiento, fecha de diagnóstico, tratamiento, estado actual...", required: false, sequentialReveal: true, fullWidth: true }
        ],
        // CAMBIO: Se anida la sección de padecimientos aquí.
        // NOTA: Requiere que la lógica de renderizado soporte sub-secciones condicionales y repetibles.
        conditionalSubSections: [{
            id: "detalle_padecimientos_integrado",
            isRepeatable: true,
            repeatableConfig: { addButtonLabel: "Añadir Detalle de Padecimiento", blockTitlePrefix: "Padecimiento", minBlocks: 0, maxBlocks: 5 },
            // La condición para mostrar esta sub-sección es compleja (si cualquier radio es 'si').
            // Se manejará en _formLogic.js en lugar de una condición simple aquí.
            fields: [
                { id: "pad_nombre_padecimiento", name: "pad_nombre_padecimiento[]", label: "Nombre del Padecimiento/Diagnóstico:", type: "text", placeholder: "Nombre del Padecimiento", maxLength: 100, required: true, sequentialReveal: true },
                { id: "pad_tipo_evento", name: "pad_tipo_evento[]", label: "Tipo de Evento:", type: "select", required: true, options: [{value:"", text:"Seleccione..."}, {value:"Enfermedad", text:"Enfermedad"}, {value:"Accidente", text:"Accidente"}, {value:"Congénito", text:"Congénito"}, {value:"Otro", text:"Otro"}], sequentialReveal: true },
                { id: "pad_fecha_inicio", name: "pad_fecha_inicio[]", label: "Fecha de Inicio/Diagnóstico:", type: "date", required: true, sequentialReveal: true },
                { id: "pad_toma_medicamento_group", name: "pad_toma_medicamento[]", label: "¿Toma medicamento actualmente para esto?", type: "radio", required: true, defaultValue: "no", options: [{value:"si",text:"Sí"},{value:"no",text:"No"}], sequentialReveal: true },
                { id: "pad_medicamento", name: "pad_medicamento[]", label: "Medicamento, dosis y frecuencia (si aplica):", type: "text", placeholder: "Nombre, dosis, cada cuánto tiempo", maxLength:150, required: false, sequentialReveal: true, conditionalShow: {fieldId:"pad_toma_medicamento_group", value:"si"} },
                { id: "pad_estado_salud", name: "pad_estado_salud[]", label: "Estado de Salud Actual:", type: "select", required: true, options: [{value:"",text:"Seleccione..."},{value:"Totalmente recuperado/curado",text:"Recuperado"},{value:"Estable/Controlado",text:"Controlado"},{value:"En tratamiento",text:"En tratamiento"}], sequentialReveal: true }
            ]
        }]
    },
    // --- SECCIÓN PADECIMIENTOS DETALLE (Comentada) ---
    /*
    {
        id: "seccion-padecimientos_detalle",
        // ... (contenido anterior de la sección)
    },
    */
    // --- SECCIÓN PLANES DE SEGURO (Comentada) ---
    /*
    {
        id: "seccion-planes_seguro",
        // ... (contenido anterior de la sección)
    },
    */
    // --- SECCIÓN DETALLES SOLICITUD (Con campos eliminados/comentados) ---
    {
        id: "seccion-solicitud",
        title: "Detalles de la Solicitud",
        subtitle: "Información adicional sobre esta solicitud específica.",
        fields: [
            { id: "soli_fecha_solicitud", name: "soli_fecha_solicitud", label: "Fecha de Solicitud:", type: "date", required: true, sequentialReveal: true },
            { id: "soli_viaje_extranjero_group", name: "soli_viaje_extranjero", label: "¿Planea viajar o residir fuera de México en los próximos 12 meses?", type: "radio", required: true, defaultValue: "no", options: [{value:"si",text:"Sí"},{value:"no",text:"No"}], sequentialReveal: true },
            { id: "soli_destino_viaje", name: "soli_destino_viaje", label: "Destino(s) y duración del viaje (si aplica):", type: "text", placeholder: "País(es), Ciudad(es) y tiempo estimado", maxLength:200, required: false, sequentialReveal: true, fullWidth: true, conditionalShow: {fieldId:"soli_viaje_extranjero_group", value:"si"} },
            
            // --- CAMPOS ELIMINADOS/COMENTADOS ---
            /*
            { id: "soli_conversion_individual_group", name: "soli_conversion_individual", ... },
            { id: "soli_poliza_colectiva", name: "soli_poliza_colectiva", ... },
            { id: "soli_certificados", name: "soli_certificados", ... },
            */
            
            { id: "soli_reduccion_periodos_espera_group", name: "soli_reduccion_periodos_espera", label: "¿Solicita Reconocimiento/Reducción de Periodos de Espera por Antigüedad de otra compañía?", type: "radio", required: true, defaultValue: "no", options: [{value:"si",text:"Sí"},{value:"no",text:"No"}], sequentialReveal: true },
            { id: "soli_compania_procedente", name: "soli_compania_procedente", label: "Compañía Procedente (si aplica):", type: "text", placeholder: "Nombre de la Aseguradora anterior", maxLength:100, required: false, sequentialReveal: true, conditionalShow: {fieldId:"soli_reduccion_periodos_espera_group", value:"si"} },
            { id: "soli_poliza_anterior", name: "soli_poliza_anterior", label: "Número de Póliza Anterior (si aplica):", type: "text", placeholder: "No. Póliza Anterior", maxLength:50, required: false, sequentialReveal: true, conditionalShow: {fieldId:"soli_reduccion_periodos_espera_group", value:"si"} },

            // --- CAMPOS ELIMINADOS/COMENTADOS ---
            /*
            { id: "soli_fecha_antiguedad", name: "soli_fecha_antiguedad", ... },
            */
            
            { id: "soli_firma_titular", name: "soli_firma_titular", label: "Firma del Titular Solicitante (Adjuntar imagen o PDF):", type: "file", accept:"image/*,.pdf", required: false, sequentialReveal: true }
            
            // --- CAMPOS ELIMINADOS/COMENTADOS ---
            /*
            { id: "soli_fecha_firma", name: "soli_fecha_firma", ... }
            */
        ]
    },
    // --- SECCIÓN COBERTURAS ADICIONALES (Comentada) ---
    /*
    {
        id: "seccion-coberturas_adicionales",
        // ... (contenido anterior de la sección)
    },
    */
    // --- SECCIÓN BENEFICIARIOS (Comentada) ---
    /*
    {
        id: "seccion-beneficiarios",
        // ... (contenido anterior de la sección)
    },
    */
    // --- SECCIÓN FORMA DE PAGO ---
    {
        id: "seccion-forma_pago",
        title: "Forma de Pago",
        subtitle: "Elige cómo deseas pagar tu póliza.",
        fields: [
            { id: "pago_forma_pago", name: "pago_forma_pago", label: "Forma de Pago (Periodicidad):", type: "select", required: true, options: [{value:"",text:"Seleccione..."},{value:"Anual",text:"Anual"},{value:"Semestral",text:"Semestral"},{value:"Trimestral",text:"Trimestral"},{value:"Mensual",text:"Mensual"}], sequentialReveal: true },
            { id: "pago_via_pago", name: "pago_via_pago", label: "Medio de Pago:", type: "select", required: true, options: [{value:"",text:"Seleccione..."},{value:"Tarjeta Crédito",text:"Tarjeta de Crédito"},{value:"Tarjeta Débito",text:"Tarjeta de Débito"},{value:"CLABE",text:"Cuenta CLABE"}], sequentialReveal: true }
        ],
        conditionalSubSections: [
            {
                id: "datos-pago-tarjeta-clabe",
                condition: { fieldId: "pago_via_pago", values: ["Tarjeta Crédito", "Tarjeta Débito", "CLABE"] },
                fields: [
                    { id: "pago_numero_tarjeta_cuenta", name: "pago_numero_tarjeta_cuenta", label: "Número Tarjeta (16) / CLABE (18):", type: "text", placeholder: "Número completo", maxLength:18, required: true, sequentialReveal: true },
                    { id: "pago_fecha_vencimiento", name: "pago_fecha_vencimiento", label: "Fecha Vencimiento (Tarjeta):", type: "text", placeholder: "MM/AA", maxLength:5, required: false, sequentialReveal: true, conditionalShow: { fieldId:"pago_via_pago", values:["Tarjeta Crédito", "Tarjeta Débito"] } },
                    { id: "pago_banco", name: "pago_banco", label: "Banco Emisor:", type: "text", placeholder: "Nombre del Banco", maxLength:50, required: true, sequentialReveal: true },
                    { id: "pago_titular_igual_contratante", name: "pago_titular_igual_contratante", label: "El titular es el mismo Contratante.", type: "checkbox", value:"true", checkedByDefault: true, required: false, sequentialReveal: true, fullWidth: true }
                ]
            },
            {
                id: "datos-tarjetahabiente-diferente",
                condition: { fieldId: "pago_titular_igual_contratante", checked: false },
                fields: [
                    { id: "pago_nombre_titular_cuenta", name: "pago_nombre_titular_cuenta", label: "Nombre Completo del Titular:", type: "text", placeholder: "Nombre Completo", maxLength:150, required: true, sequentialReveal: true },
                    { id: "pago_rfc_titular_cuenta", name: "pago_rfc_titular_cuenta", label: "RFC del Titular:", type: "text", placeholder: "RFC con homoclave", maxLength:13, required: true, sequentialReveal: true },
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
            { id: "dec_nexos_delincuencia_group", name: "dec_nexos_delincuencia", label: "¿Usted, el contratante o algún beneficiario tiene relación con actividades ilícitas o delincuencia organizada?", type: "radio", required: true, defaultValue:"no", options: [{value:"si",text:"Sí"},{value:"no",text:"No"}], sequentialReveal: true, fullWidth: true },
            { id: "dec_detalles_nexos", name: "dec_detalles_nexos", label: "En caso afirmativo, explique brevemente:", type: "textarea", rows:3, placeholder: "Explique la situación", required: false, sequentialReveal: true, fullWidth: true, conditionalShow: {fieldId:"dec_nexos_delincuencia_group", value:"si"} },
            { type: "divider", fullWidth: true, sequentialReveal: true },
            { id: "dec_consentimiento_datos", name: "dec_consentimiento_datos", labelHtml: "He leído y acepto el <a href=\"#\">Aviso de Privacidad</a> y consiento el tratamiento de mis datos personales.", type: "checkbox", value:"true", required: true, sequentialReveal: true, fullWidth: true },
            { id: "dec_veracidad_informacion", name: "dec_veracidad_informacion", label: "Declaro que toda la información proporcionada es completa y verídica.", type: "checkbox", value:"true", required: true, sequentialReveal: true, fullWidth: true },
        ]
    },
    // --- SECCIÓN AGENTE (Comentada) ---
    /*
    {
        id: "seccion-agente",
        // ... (contenido anterior de la sección)
    },
    */
    // --- SECCIÓN DE REVISIÓN ---
    {
        id: "seccion-revision",
        title: "Revisa tu información",
        subtitle: "Por favor, verifica cuidadosamente que todos los datos sean correctos antes de enviar.",
        isReviewSection: true, 
        fields: [] 
    }
];
