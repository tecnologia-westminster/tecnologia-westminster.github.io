/*
 * digital-hitos.js
 * Hitos 2026 del Departamento de Tecnología, por nivel y año.
 * Fuente: vault S5 — director-educacion-digital/proyectos/proyecto-educativo-digital/hitos-it-2026.md
 * Al actualizar los hitos, editar primero el documento fuente y después este archivo.
 */

const HITOS_2026 = {
  inicial: {
    nombre: 'Inicial',
    intro: [
      'Inteligencia Artificial mediada por el docente: asistente de voz, generación de imágenes para narración y reconocimiento de patrones por medio de juegos.'
    ],
    anios: [
      {
        nombre: 'Maternal',
        descripcion: 'La digitalización se aborda como una herramienta de exploración, registro y comunicación. A través de actividades del mundo mágico, los estudiantes se acercan a representaciones de la tecnología presentes en la vida cotidiana.'
      },
      {
        nombre: 'Sala de 3',
        descripcion: 'La digitalización se aborda como una herramienta de exploración, registro y comunicación, que permite a los niños acercarse progresivamente a dispositivos de la vida cotidiana, como cámaras, celulares o grabadoras. Además realizan visitas de articulación a la sala que usarán el próximo año.'
      },
      {
        nombre: 'Sala de 4',
        periodos: [
          { hitos: ['Exploración libre de dispositivos para reconocerlos como parte del entorno'],
            herramientas: ['Sin herramienta digital fija'] },
          { hitos: ['Desarrollo de motricidad fina mediante juegos', 'Registro fotográfico digital de actividades'],
            herramientas: ['Quick, Draw! (Google)', 'AutoDraw'] },
          { hitos: ['Introducción al pensamiento computacional con actividades desenchufadas', 'Normas y hábitos de uso de dispositivos'],
            herramientas: ['Code.org (pre-lector)', 'Bee-Bot', 'Actividades desenchufadas'] }
        ],
        ia: { hito: 'Exploración sensorial y motriz: juego libre con Quick, Draw! Reconocimiento de que la máquina "adivina" los dibujos.',
              unesco: 'Primera aproximación al concepto de "máquina que aprende": la IA observa y reconoce, pero no piensa. Conversación sobre qué le mostramos y qué no.',
              roamx: 'Derechos' }
      },
      {
        nombre: 'Sala de 5',
        periodos: [
          { hitos: ['Uso del mouse y el teclado para la motricidad', 'Inicio de un álbum de fotos digital con registros del jardín', 'Secretario digital', 'Hábitos posturales saludables y pausas activas para evitar la fatiga visual'],
            herramientas: ['Quick, Draw! (Google)', 'AutoDraw'] },
          { hitos: ['Identificación de teclas numéricas y alfabéticas', 'Libros digitales', 'El estudiante propone el "qué" y el docente media el "cómo" tecnológico', 'Gamificación de los contenidos'],
            herramientas: ['Typing.com Junior', 'Google Docs (guiado)'] },
          { hitos: ['Programación iconográfica en Scratch Junior', 'Cuentos colaborativos con herramientas de dibujo y texto', 'Reflexión: el niño explica por qué cree que la máquina sugirió ese dibujo y no otro. La acción se transforma en un pensamiento crítico incipiente'],
            herramientas: ['Scratch Junior', 'Code.org (pre-lector)', 'Lightbot Jr.'] }
        ],
        ia: { hito: 'Creación dirigida con AutoDraw: el niño dibuja y la IA propone alternativas. Iteración consciente sobre el resultado.',
              unesco: 'Charla sobre el "oído digital" (asistentes de voz): qué escuchan, cómo funcionan y la importancia de no compartir datos personales con las máquinas.',
              roamx: 'Privacidad' }
      }
    ]
  },

  primario: {
    nombre: 'Primario',
    intro: [
      'Este nivel se caracteriza por el ciclo Anticipación – Acción – Reflexión.',
      'El producto digital no es el fin, sino el medio para la construcción conjunta del aprendizaje.'
    ],
    anios: [
      {
        nombre: '1.er año',
        periodos: [
          { hitos: ['Uso del mouse y el teclado', 'Reconocimiento de hardware y periféricos', 'Apoyo a la lectoescritura mediante juegos educativos'],
            herramientas: ['Juegos educativos'] },
          { hitos: ['Creatividad digital', 'Registro multimedia de actividades cotidianas a través del docente', 'Narrar o re-narrar textos con juegos, imágenes o animaciones propias o descargadas: narrativa transmedia'],
            herramientas: ['Paint', 'Tux Paint', 'Kleki', 'Sketchpad'] },
          { hitos: ['Resolución de problemas simples', 'Lógica computacional', 'Programación con lenguaje iconográfico', 'Prompts dictados'],
            herramientas: ['Scratch Junior', 'Pilas Bloques'] }
        ],
        ia: { hito: 'Primeros prompts guiados con lenguaje iconográfico. El docente modela la instrucción; el estudiante elige íconos.',
              unesco: 'Introducción a la idea de que la IA sigue instrucciones creadas por personas: la IA no inventa, obedece.',
              roamx: 'Apertura' }
      },
      {
        nombre: '2.º año',
        periodos: [
          { hitos: ['Conocer los dispositivos de uso escolar cotidiano (partes de la computadora)', 'Encender y apagar el dispositivo; cuidado del material', 'Uso básico de procesadores de texto', 'Apoyo a la lectoescritura y a la resolución de problemas matemáticos'],
            herramientas: ['Juegos educativos', 'Procesadores de texto para niños', 'Writer / Google Docs'] },
          { hitos: ['Pensamiento computacional y programación', 'Prácticas como productores digitales', 'Resolución de problemas', 'Recorridos virtuales combinados con analógicos para construir el espacio próximo'],
            herramientas: ['Pilas Bloques', 'Code.org', 'Scratch Junior'] },
          { hitos: ['Grabación de voz y video', 'Trabajo con imágenes', 'Uso de buscadores'],
            herramientas: ['Grabadora de Google Slides', 'Canva for Education', 'Buscadores'] }
        ],
        ia: { hito: 'Prompts dictados con palabras propias. El estudiante construye su primera instrucción en lenguaje natural.',
              unesco: 'Reflexión sobre transparencia: ¿por qué la IA hace lo que hace? Identificación de la "regla oculta" detrás de cada resultado: responde lo que más se parece a lo que aprendió.',
              roamx: 'Apertura' }
      },
      {
        nombre: '3.er año',
        periodos: [
          { hitos: ['Procesador de textos y corrección ortográfica', 'Búsqueda y selección de información; Google Maps para la construcción del espacio', 'Charlas, invitados especiales, entrevistas e intercambio con otros estudiantes', 'Exposiciones y defensas de trabajos con apoyo digital'],
            herramientas: ['Google Docs'] },
          { hitos: ['Resolución de problemas', 'Manejo de imágenes', 'Prompts de manera autónoma (iteraciones)', 'Acceso a la cuenta institucional', 'Registro de lo escrito con audios, videos e imágenes'],
            herramientas: ['Scratch Junior', 'Google Imágenes'] },
          { hitos: ['Pensamiento computacional y programación', 'Podcast: exploración; expresión oral con efectos de sonido para producir audiotextos y videos', 'Carta, mensaje y mail'],
            herramientas: ['Google Classroom', 'Pilas Bloques (desafíos complejos)', 'Introducción a Scratch'] }
        ],
        ia: { hito: 'Manejo autónomo de imágenes generadas por IA: iteración, selección y edición básica del prompt para mejorar el resultado.',
              unesco: 'Reflexión sobre acceso universal: ¿quiénes pueden usar estas herramientas? Importancia de la alfabetización digital para reducir desigualdades.',
              roamx: 'Apertura' }
      },
      {
        nombre: '4.º año',
        periodos: [
          { hitos: ['Comunicación digital: mail institucional y Drive', 'Crear, contestar y reenviar mensajes; adjuntar archivos', 'Tablones colaborativos'],
            herramientas: ['Mail', 'Padlet', 'Google Docs'] },
          { hitos: ['Documentos colaborativos (Google Docs)', 'Pensamiento computacional', 'Presentaciones (Google Slides)', 'Exposiciones y defensas de trabajos con apoyo digital'],
            herramientas: ['Mail', 'Padlet', 'Google Slides'] },
          { hitos: ['Infografías', 'Creación de imágenes con IA', 'Resolución de problemas con lenguajes de programación'],
            herramientas: ['Canva (IA)', 'Scratch', 'Lightbot'] }
        ],
        ia: { hito: 'Creación de imágenes con IA en Canva. Análisis de coherencia y cohesión visual entre texto e imagen generada.',
              unesco: 'Análisis crítico de las imágenes: ¿representan a todas las personas por igual? Detección inicial de sesgos en los resultados.',
              roamx: 'Diversidad y Género' }
      },
      {
        nombre: '5.º año',
        periodos: [
          { hitos: ['Tablones colaborativos', 'Experiencias iniciales con realidad aumentada', 'Los medios de comunicación escrita como fuente de información, recreados con TIC en la escuela'],
            herramientas: ['Google', 'Padlet'] },
          { hitos: ['Producción multimedia con foco en coherencia y cohesión', 'Generación de imágenes con IA en Canva'],
            herramientas: ['Wordwall', 'Canva (IA)'] },
          { hitos: ['Productos digitales finales (presentaciones o videos)', 'Análisis de precios en hojas de cálculo', 'Ciberbullying y grooming'],
            herramientas: ['Google Drive', 'Canva (IA)'] }
        ],
        ia: { hito: 'Reescritura y mejora de textos con IA: coherencia, cohesión y adecuación al destinatario.',
              unesco: 'Profundización en sesgos de género: comparación de imágenes generadas ante distintos roles sociales. ¿Qué estereotipos reproduce la IA?',
              roamx: 'Diversidad y Género' }
      },
      {
        nombre: '6.º año',
        periodos: [
          { hitos: ['Producción digital: infografías, presentaciones y videos', 'Podcast: producción', 'Realidad aumentada', 'Diseño de afiches digitales'],
            herramientas: ['Google Docs', 'Padlet', 'Canva (IA)', 'Google Slides', 'Buscadores'] },
          { hitos: ['Programación: juegos simples con niveles y puntajes', 'Tablas y gráficos estadísticos, primero guiados y después con autonomía'],
            herramientas: ['Scratch: variables, sensores y condiciones complejas'] },
          { hitos: ['Edición de audio y video', 'Graficación', 'Campaña de concientización sobre ciberbullying', 'Explorar el ciberespacio de forma segura, respetuosa y responsable, preservando la identidad y la integridad de las personas'],
            herramientas: ['Google Sheets', 'Google Sites', 'Canva (IA)', 'Genially', 'Google Drive'] }
        ],
        ia: { hito: 'Producción de podcasts con guion asistido por IA y análisis de datos en hojas de cálculo con IA generativa.',
              unesco: 'Propiedad intelectual de los contenidos creados con IA: autoría, créditos y respeto por la creación humana.',
              roamx: 'Diversidad y Género' }
      }
    ]
  },

  secundario: {
    nombre: 'Secundario',
    intro: [],
    anios: [
      {
        nombre: '1.er año',
        periodos: [
          { hitos: ['Terminología informática y vocabulario tecnológico específico', 'Infografías, presentaciones e imágenes con IA', 'Armado de actividades lúdicas'],
            herramientas: ['Canva (IA)', 'Wordwall'] },
          { hitos: ['Procesador de textos: tablas, imágenes y columnas', 'Crear y editar documentos; cargar datos de archivos existentes', 'Crear y editar video con sonido e imagen'],
            herramientas: ['Word', 'PDF', 'Canva (IA)', 'ElevenLabs (audio con IA)', 'Vidnoz (videos cortos con IA)'] },
          { hitos: ['Presentaciones: texto, imagen, sonido y video; formato, títulos, viñetas e hipervínculos', 'Crear y editar archivos HTML y hojas de estilo CSS'],
            herramientas: ['PowerPoint', 'Canva (IA)', 'ElevenLabs', 'Vidnoz', 'HTML, CSS y JS'] }
        ],
        ia: { hito: 'Producción de audios con IA (ElevenLabs): clonación de voz, síntesis y edición. Reflexión sobre lo que se escucha y lo que es real.',
              unesco: 'Impacto de la IA en la creación de contenidos: deep fake de audio, desinformación y responsabilidad del creador.',
              roamx: 'Gobernanza' }
      },
      {
        nombre: '2.º año',
        periodos: [
          { hitos: ['Situaciones problemáticas con planilla electrónica', 'Fórmulas y funciones'],
            herramientas: ['Excel'] },
          { hitos: ['Funciones lógicas y estadísticas', 'Gráficos para representar datos', 'Imágenes, audios y videos cortos con IA'],
            herramientas: ['Excel', 'Canva (IA)', 'ElevenLabs', 'Vidnoz'] },
          { hitos: ['Programación: HTML y CSS', 'Introducción a JavaScript'],
            herramientas: ['Canva (IA)', 'ElevenLabs', 'Vidnoz'] }
        ],
        ia: { hito: 'Producción de videos cortos con IA (Vidnoz): generación, edición y montaje. Comparación entre video real y generado.',
              unesco: 'Regulación de contenidos sintéticos: ¿quién es responsable de lo que publica una IA? Participación de múltiples actores en la gobernanza.',
              roamx: 'Gobernanza' }
      },
      {
        nombre: '3.er año',
        periodos: [
          { hitos: ['Crear y editar video con sonido e imagen', 'Creación y edición de imágenes'],
            herramientas: ['Canva (IA)', 'ElevenLabs', 'Vidnoz'] },
          { hitos: ['Situaciones problemáticas con planilla electrónica', 'Gráficos para representar datos'],
            herramientas: ['Excel'] },
          { hitos: ['Bases de datos: campos y registros', 'Situaciones problemáticas con bases de datos', 'Formularios, consultas e informes'],
            herramientas: ['Access'] }
        ],
        ia: { hito: 'Programación en HTML, CSS y JS con asistencia de IA: generación de código, depuración y análisis crítico de las soluciones.',
              unesco: 'El rol del programador frente a la IA: ¿qué decidís vos y qué delegás en la máquina? Necesidad de marcos regulatorios.',
              roamx: 'Gobernanza' }
      },
      {
        nombre: '4.º año',
        periodos: [
          { hitos: ['Terminología informática actualizada', 'Arquitectura del computador y sistemas operativos', 'Introducción crítica a la IA: qué es y cómo funciona', 'IA en la vida cotidiana', 'Brecha digital y ciudadanía tecnológica'],
            herramientas: ['Google Workspace', 'Canva (IA)', 'Teachable Machine', 'Gemini (uso guiado)'] },
          { hitos: ['Redes informáticas e internet', 'Búsqueda crítica y evaluación de información', 'Producción multimedia colaborativa', 'Medios digitales e impacto social', 'Comunicación sincrónica y asincrónica'],
            herramientas: ['Google Sites', 'Padlet', 'ElevenLabs', 'Vidnoz', 'Canva (IA)'] },
          { hitos: ['Ciudadanía digital: derechos, responsabilidades y netiqueta', 'Privacidad de datos y protección de la identidad', 'Propiedad intelectual y licencias Creative Commons', 'Ética de la IA: sesgos, transparencia y uso responsable', 'Proyecto integrador: producción multimedia con IA'],
            herramientas: ['ChatGPT, Gemini o Claude (análisis crítico)', 'Canva Pro o Adobe Express', 'ElevenLabs', 'Vidnoz', 'Google Drive'] }
        ],
        ia: { hito: 'Arquitectura del computador y funcionamiento técnico de la IA: entrenamiento de modelos propios con Teachable Machine y análisis con Gemini.',
              unesco: 'Brecha digital, transparencia algorítmica y marcos de protección de datos.',
              roamx: 'Ética Integral' }
      },
      {
        nombre: '5.º año',
        periodos: [
          { hitos: ['Situaciones problemáticas con planilla electrónica', 'Gestión y análisis de datos', 'Gráficos para representar datos'],
            herramientas: ['Excel', 'Canva (IA)', 'ElevenLabs', 'Vidnoz'] },
          { hitos: ['Situaciones problemáticas con bases de datos', 'Formularios, consultas e informes'],
            herramientas: ['Access'] },
          { hitos: ['Programación y pensamiento computacional'],
            herramientas: ['HTML, CSS y JS'] }
        ],
        ia: { hito: 'Gestión y visualización de datos complejos con IA: pensamiento computacional avanzado aplicado a datos reales.',
              unesco: 'Cómo el software libre y los datos abiertos pueden democratizar el acceso a la IA y reducir la concentración de poder tecnológico.',
              roamx: 'Ética Integral' }
      },
      {
        nombre: '6.º año',
        periodos: [
          { hitos: ['Resolución de problemas, análisis y graficación de datos'],
            herramientas: ['Planilla de cálculo', 'IA generativa para análisis de datos'] },
          { hitos: ['Herramientas colaborativas', 'LinkedIn'],
            herramientas: ['Google Drive', 'Trello'] },
          { hitos: ['Diseño y multimedia para el mundo laboral', 'Inteligencia artificial generativa'],
            herramientas: ['Canva Pro, Adobe Express o Inkscape', 'Uso ético de ChatGPT, Gemini o Claude'] }
        ],
        ia: { hito: 'Uso ético y estratégico de ChatGPT, Gemini o Claude en proyectos de diseño multimedia y preparación para el mundo laboral.',
              unesco: 'Proyecto final integrador con marco ROAM-X: producción digital ética, accesible, diversa y respetuosa de los derechos humanos.',
              roamx: 'Transformación' }
      }
    ]
  }
};

const PERIODOS_2026 = ['Abril a junio', 'Julio a septiembre', 'Octubre a diciembre'];
