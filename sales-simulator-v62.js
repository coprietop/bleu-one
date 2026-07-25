// Bleu One v6.2 · Demo Experience · 6 familias, 6 historias y decisiones con consecuencias
window.BLEU_DEMO_FAMILIES = [
{
  name:'Familia Ramírez', city:'Cajicá', level:'Principiante', stars:2,
  profile:'Laura y Andrés · pareja joven con una hija', tag:'Conexión y demo completa',
  hook:'Laura te recibe sola. Andrés viene en camino y normalmente llega cansado del trabajo.',
  goal:'Aprender a esperar al decisor, integrar a la pareja y conducir una demostración completa.',
  opening:{confidence:58,energy:76,participation:52,purchase:34,control:62},
  scenes:[
    {stage:'Llegada',line:'Tocas el timbre. Laura abre la puerta y te cuenta que Andrés todavía no llega, pero que viene en camino.',prompt:'¿Qué haces?',options:[
      {text:'Empiezas toda la demostración sin esperar.',score:1,e:{confidence:-2,energy:2,participation:-8,purchase:-6,control:-4},feedback:'Avanzas, pero dejas por fuera a una persona clave.'},
      {text:'Le preguntas cuánto tarda Andrés y haces un rompehielo corto mientras lo esperan.',score:4,e:{confidence:10,energy:4,participation:7,purchase:5,control:6},feedback:'Proteges la visita y aprovechas el tiempo sin empezar antes de que estén los dos.'},
      {text:'Te vas de inmediato y le dices que agenden otro día.',score:0,e:{confidence:-8,energy:-8,participation:-5,purchase:-12,control:-6},feedback:'Perdiste una visita que todavía podía realizarse.'},
      {text:'Le pides que te solicite un taxi.',score:0,e:{confidence:-18,energy:-12,participation:-12,purchase:-20,control:-15},feedback:'La reacción rompe por completo la confianza.'}
    ]},
    {stage:'Rompehielo',line:'Andrés llega serio, deja las llaves sobre la mesa y dice que tuvo un día muy pesado.',prompt:'¿Cómo lo integras?',options:[
      {text:'Lo ignoras y continúas hablando con Laura.',score:0,e:{confidence:-10,energy:-4,participation:-15,purchase:-10,control:-6},feedback:'El decisor se siente excluido.'},
      {text:'Haces una broma rápida y lo obligas a participar desde el primer minuto.',score:2,e:{confidence:1,energy:5,participation:2,purchase:0,control:-2},feedback:'Puede funcionar, pero forzarlo tan pronto también puede incomodarlo.'},
      {text:'Reconoces su día, conversas un momento y luego lo invitas a participar sin presión.',score:4,e:{confidence:13,energy:4,participation:12,purchase:7,control:7},feedback:'Primero conectas con la persona y luego con la demostración.'},
      {text:'Le dices que se siente porque ya vas tarde.',score:0,e:{confidence:-14,energy:-8,participation:-12,purchase:-14,control:-4},feedback:'Transmitiste prisa y poca empatía.'}
    ]},
    {stage:'Metales',line:'Laura comenta que compraron una batería nueva hace una semana y cree que no vale la pena hacer pruebas.',prompt:'¿Qué haces?',options:[
      {text:'Hablas mal de la batería nueva para defender tu producto.',score:0,e:{confidence:-12,energy:-6,participation:-8,purchase:-8,control:-6},feedback:'Atacar una compra reciente pone al cliente a defenderla.'},
      {text:'Pides únicamente las piezas más antiguas para que la prueba sea más impactante.',score:2,e:{confidence:1,energy:2,participation:4,purchase:3,control:1},feedback:'La prueba puede impactar, pero el cliente puede sentir que escogiste el resultado.'},
      {text:'Pides los utensilios que realmente usan: uno nuevo y algunos antiguos.',score:4,e:{confidence:10,energy:5,participation:10,purchase:9,control:6},feedback:'La comparación se siente honesta, cotidiana y creíble.'},
      {text:'Saltas por completo la prueba de metales.',score:1,e:{confidence:0,energy:2,participation:-4,purchase:-7,control:-2},feedback:'Ahorras tiempo, pero pierdes una parte esencial de la experiencia.'}
    ]},
    {stage:'Cocinado',line:'Los dos se ven entusiasmados cuando empiezas a preparar los ingredientes.',prompt:'¿Cómo aprovechas ese momento?',options:[
      {text:'Cortas y preparas todo tú para que salga perfecto.',score:2,e:{confidence:2,energy:1,participation:-8,purchase:1,control:4},feedback:'Mantienes el control, pero conviertes a la familia en espectadora.'},
      {text:'Invitas a ambos a cortar, usar el cuchillo y participar en la preparación.',score:4,e:{confidence:8,energy:12,participation:18,purchase:10,control:6},feedback:'La familia vive el producto, no solo lo observa.'},
      {text:'Pides un domicilio y continúas con el catálogo.',score:0,e:{confidence:-10,energy:-12,participation:-15,purchase:-12,control:-8},feedback:'Eliminaste el momento más experiencial de la demo.'},
      {text:'Les pides que cocinen como siempre mientras tú miras.',score:2,e:{confidence:3,energy:3,participation:8,purchase:0,control:-5},feedback:'Aprendes de su rutina, pero pierdes la oportunidad de dirigir la experiencia.'}
    ]},
    {stage:'Degustación',line:'Laura mira las verduras y dice: “A mí eso no me gusta”.',prompt:'¿Qué respondes?',options:[
      {text:'Le dices que tiene que comerlas para entender la demostración.',score:0,e:{confidence:-12,energy:-8,participation:-9,purchase:-10,control:-5},feedback:'Presionar genera resistencia.'},
      {text:'Te molestas y guardas la comida.',score:0,e:{confidence:-18,energy:-18,participation:-15,purchase:-20,control:-12},feedback:'La visita queda emocionalmente rota.'},
      {text:'Le reconoces que no le gustan y la invitas a probar solo un poco, sin presión.',score:4,e:{confidence:10,energy:5,participation:9,purchase:8,control:5},feedback:'Conectas con su gusto y reduces la resistencia.'},
      {text:'Botas las verduras y sigues con el pollo.',score:1,e:{confidence:-1,energy:-2,participation:-3,purchase:-2,control:-3},feedback:'Evitas el conflicto, pero también desperdicias una oportunidad de sorpresa.'}
    ]},
    {stage:'Brochure',line:'Andrés dice que ya sabe exactamente qué piezas quiere.',prompt:'¿Cómo usas el brochure?',options:[
      {text:'Le das solo el precio de esas piezas.',score:2,e:{confidence:4,energy:1,participation:2,purchase:3,control:0},feedback:'Respondes a lo pedido, pero no exploras el potencial completo.'},
      {text:'Le dices que realmente necesita menos.',score:1,e:{confidence:0,energy:0,participation:-2,purchase:-4,control:-1},feedback:'Reduciste la oportunidad antes de entender por qué eligió esas piezas.'},
      {text:'Validas su elección y usas el brochure para comparar conjuntos y aumentar valor.',score:4,e:{confidence:7,energy:4,participation:8,purchase:12,control:8},feedback:'No contradices al cliente; amplías su visión y construyes valor.'},
      {text:'Pasas directamente a preguntarle cuánto puede pagar al mes.',score:2,e:{confidence:1,energy:2,participation:3,purchase:4,control:2},feedback:'La cuota importa, pero todavía faltaba consolidar el valor.'}
    ]},
    {stage:'Cierre',line:'Les encanta el producto, pero dicen: “Vuelve mañana” y “déjanos tu tarjeta”.',prompt:'¿Cuál es tu siguiente movimiento?',options:[
      {text:'Agradeces, anotas el número y te vas.',score:1,e:{confidence:3,energy:-2,participation:-4,purchase:-12,control:-10},feedback:'La relación queda bien, pero entregaste por completo el control del cierre.'},
      {text:'Preguntas qué necesitan revisar antes de decidir.',score:3,e:{confidence:7,energy:0,participation:6,purchase:7,control:7},feedback:'Abres la verdadera objeción sin confrontar.'},
      {text:'Haces mala cara y empiezas a guardar todo.',score:0,e:{confidence:-15,energy:-10,participation:-12,purchase:-18,control:-8},feedback:'La presión emocional destruye la confianza ganada.'},
      {text:'Usas un cierre de Benjamin Franklin con pros y contras construidos junto a ellos.',score:4,e:{confidence:8,energy:2,participation:9,purchase:13,control:10},feedback:'Les ayudas a ordenar la decisión y mantienes el cierre consultivo.'}
    ]},
    {stage:'Cuota',line:'Laura puede aportar $80.000 quincenales y Andrés $100.000 quincenales. En Bleu One, la venta aproximada equivale a cuota mensual × 20.',prompt:'¿Qué valor aproximado podrías ofrecerles?',options:[
      {text:'$3.600.000',score:1,e:{confidence:0,energy:0,participation:0,purchase:-3,control:-2},feedback:'Tomaste solo una quincena. La cuota mensual conjunta es de $320.000.'},
      {text:'$6.400.000',score:4,e:{confidence:4,energy:2,participation:3,purchase:10,control:9},feedback:'Correcto: ($80.000 + $100.000) × 2 quincenas × 20 = $6.400.000.'},
      {text:'$7.200.000',score:2,e:{confidence:0,energy:0,participation:0,purchase:1,control:0},feedback:'Está cerca, pero el cálculo correcto da $6.400.000.'}
    ]},
    {stage:'Financiación',line:'El cliente no firma porque no entiende cómo funcionan los intereses.',prompt:'¿Qué haces?',options:[
      {text:'Le dices que lo investigue después en internet.',score:0,e:{confidence:-12,energy:-4,participation:-6,purchase:-14,control:-7},feedback:'Le entregaste una duda crítica sin resolver.'},
      {text:'Explicas de forma técnica aunque tú tampoco estés seguro.',score:0,e:{confidence:-15,energy:-7,participation:-8,purchase:-15,control:-10},feedback:'La confusión daña la credibilidad.'},
      {text:'Lo explicas con un ejemplo sencillo y, si hace falta, te apoyas en tu distribuidor.',score:4,e:{confidence:13,energy:2,participation:6,purchase:11,control:8},feedback:'La claridad y el apoyo correcto generan seguridad.'},
      {text:'Le dices que ese crédito también le crea historial en Estados Unidos.',score:0,e:{confidence:-20,energy:-8,participation:-10,purchase:-20,control:-15},feedback:'Nunca se debe inventar un beneficio financiero.'}
    ]},
    {stage:'4 en 14',line:'La visita va bien, pero todos empiezan a bostezar cuando llega el momento de presentar el programa.',prompt:'¿Qué haces?',options:[
      {text:'Te vas por empatía y omites el programa.',score:1,e:{confidence:3,energy:1,participation:-3,purchase:-2,control:-7},feedback:'Cuidas el cansancio, pero abandonas una parte importante de la visita.'},
      {text:'Dices que mañana llamarás para explicar un programa de premios.',score:2,e:{confidence:2,energy:2,participation:1,purchase:0,control:-3},feedback:'Pospones, pero pierdes la energía y el contexto del momento.'},
      {text:'Explicas que será breve, haces el puente e inicias el 4 en 14 con ritmo.',score:4,e:{confidence:6,energy:7,participation:8,purchase:4,control:10},feedback:'Proteges el proceso y adaptas el ritmo a la hora.'},
      {text:'Llamas a tu sponsor para que lo haga completo.',score:1,e:{confidence:0,energy:-3,participation:-2,purchase:0,control:-8},feedback:'El apoyo puede servir, pero cedes el control de una habilidad que debes dominar.'}
    ]},
    {stage:'Instantánea',line:'Son las 7:00 p. m. y Andrés dice que ya está muy tarde para llamar a alguien.',prompt:'¿Cómo manejas la instantánea?',options:[
      {text:'Le das la razón y te disculpas por haberlo propuesto.',score:1,e:{confidence:2,energy:0,participation:-4,purchase:0,control:-6},feedback:'Validas al cliente, pero abandonas demasiado rápido.'},
      {text:'Le dices que no llame: que solo envíe mensajes y luego te avise.',score:2,e:{confidence:3,energy:1,participation:2,purchase:0,control:-1},feedback:'Mantienes una acción, aunque pierde la fuerza de la llamada inmediata.'},
      {text:'Le dices que regresarás mañana exclusivamente para llamar.',score:1,e:{confidence:1,energy:-2,participation:-2,purchase:0,control:-5},feedback:'Agregas fricción y dependes de una segunda visita.'},
      {text:'Explicas con claridad por qué la llamada inmediata funciona y ofreces un incentivo adicional por hacerlo ahora.',score:4,e:{confidence:7,energy:5,participation:11,purchase:3,control:10},feedback:'Das sentido a la acción y refuerzas el compromiso sin imponer.'}
    ]}
  ]
},
{
  name:'Familia Torres',city:'Sopó',level:'Principiante',stars:2,profile:'Diana, Mauricio y dos hijos',tag:'Tiempo limitado y familia activa',
  hook:'La familia tiene solo una hora y los niños interrumpen con frecuencia.',goal:'Aprender a mantener el ritmo sin hacer una demostración incompleta.',opening:{confidence:55,energy:82,participation:58,purchase:31,control:58},
  scenes:[
    {stage:'Acuerdo de tiempo',line:'Mauricio te recibe diciendo: “Tenemos exactamente una hora”.',prompt:'¿Qué haces?',options:[
      {text:'Reprogramas de inmediato.',score:1,e:{confidence:1,energy:-4,participation:-2,purchase:-8,control:-4},feedback:'Es prudente, pero quizá estás perdiendo una visita viable.'},
      {text:'Aceptas y haces solo la mitad de la demostración.',score:2,e:{confidence:1,energy:2,participation:0,purchase:-2,control:0},feedback:'Cumples el tiempo, pero una demo incompleta puede perder impacto.'},
      {text:'Acordas una demo completa, dinámica y más ágil, validando el tiempo en momentos clave.',score:4,e:{confidence:8,energy:8,participation:7,purchase:7,control:10},feedback:'Respetas el tiempo sin sacrificar el proceso.'},
      {text:'Te vas con ellos y explicas todo en el carro.',score:0,e:{confidence:-10,energy:-8,participation:-8,purchase:-12,control:-10},feedback:'La improvisación elimina la experiencia y la seguridad.'}
    ]},
    {stage:'Interrupción',line:'Uno de los niños interrumpe cada dos minutos para mostrarte sus juguetes.',prompt:'¿Cómo reaccionas?',options:[
      {text:'Le pides a los padres que lo saquen de la sala.',score:0,e:{confidence:-9,energy:-5,participation:-8,purchase:-8,control:1},feedback:'Recuperas silencio, pero rompes la conexión familiar.'},
      {text:'Lo ignoras completamente.',score:1,e:{confidence:-3,energy:-2,participation:-5,purchase:-3,control:1},feedback:'Evitas desviarte, pero el niño seguirá buscando atención.'},
      {text:'Le das una participación corta y luego lo integras en una tarea sencilla.',score:4,e:{confidence:9,energy:10,participation:14,purchase:5,control:8},feedback:'Conviertes la interrupción en participación y recuperas el ritmo.'},
      {text:'Detienes la demo para jugar con él.',score:2,e:{confidence:6,energy:4,participation:6,purchase:-2,control:-8},feedback:'Ganas simpatía, pero pierdes el control del tiempo.'}
    ]},
    {stage:'Descubrimiento',line:'Diana dice que cocina rápido; Mauricio asegura que gastan demasiado en domicilios.',prompt:'¿Qué pregunta abre mejor la necesidad?',options:[
      {text:'“¿Quién de los dos tiene la razón?”',score:1,e:{confidence:-2,energy:0,participation:1,purchase:0,control:0},feedback:'Puede sonar confrontativo.'},
      {text:'“¿Qué pasa normalmente en una semana: cuántos días cocinan y cuántos piden?”',score:4,e:{confidence:7,energy:3,participation:9,purchase:8,control:7},feedback:'Llevas la contradicción a hechos concretos.'},
      {text:'“Entonces necesitan comprar hoy”.',score:0,e:{confidence:-8,energy:-3,participation:-5,purchase:-8,control:-3},feedback:'Concluiste antes de descubrir.'},
      {text:'“¿Cuánto ganan al mes?”',score:1,e:{confidence:-5,energy:-2,participation:-3,purchase:-1,control:0},feedback:'La pregunta financiera llega demasiado pronto.'}
    ]},
    {stage:'Degustación',line:'El hijo mayor dice que el pollo de la casa sabe mejor que el tuyo.',prompt:'¿Qué haces?',options:[
      {text:'Le dices que no sabe de cocina.',score:0,e:{confidence:-12,energy:-7,participation:-10,purchase:-8,control:-6},feedback:'La confrontación te pone en contra de la familia.'},
      {text:'Le preguntas qué le gusta del pollo de su casa y lo invitas a comparar una característica.',score:4,e:{confidence:9,energy:8,participation:12,purchase:6,control:7},feedback:'Conviertes el reto en una conversación útil.'},
      {text:'Lo ignoras y sigues.',score:2,e:{confidence:0,energy:-1,participation:-4,purchase:0,control:3},feedback:'No escalas el conflicto, pero pierdes una oportunidad de integrarlo.'},
      {text:'Pides a sus padres que lo corrijan.',score:1,e:{confidence:-3,energy:-4,participation:-6,purchase:-2,control:0},feedback:'Delegas la tensión a la familia.'}
    ]},
    {stage:'Cierre rápido',line:'Faltan quince minutos y la familia ya reconoce el valor del producto.',prompt:'¿Cómo avanzas?',options:[
      {text:'Aceleras tanto que omites condiciones y financiación.',score:1,e:{confidence:-5,energy:3,participation:-4,purchase:-7,control:2},feedback:'La rapidez no puede reemplazar la claridad.'},
      {text:'Resumes lo que valoraron, confirma paquete y explica solo lo necesario para decidir.',score:4,e:{confidence:8,energy:5,participation:7,purchase:12,control:10},feedback:'Priorizas lo esencial sin dejar vacíos.'},
      {text:'Extiendes la visita dos horas sin pedir permiso.',score:0,e:{confidence:-10,energy:-15,participation:-12,purchase:-10,control:-8},feedback:'Incumples el acuerdo inicial.'},
      {text:'Les dejas el catálogo para que decidan solos.',score:1,e:{confidence:2,energy:-2,participation:-4,purchase:-10,control:-10},feedback:'La decisión pierde acompañamiento.'}
    ]},
    {stage:'Inicial',line:'Mauricio dice que hoy no tiene dinero para la inicial.',prompt:'¿Cuál es tu mejor secuencia?',options:[
      {text:'Le prestas tú la inicial.',score:0,e:{confidence:-8,energy:-4,participation:-4,purchase:-12,control:-12},feedback:'Nunca debes asumir personalmente la obligación del cliente.'},
      {text:'Preguntas cuándo tendrá dinero y agendas volver.',score:2,e:{confidence:2,energy:0,participation:2,purchase:1,control:-2},feedback:'Es una salida posible, pero no explora soluciones actuales.'},
      {text:'Exploras ahorro disponible, anclas valor y usas un incentivo solo si ayuda a concretar.',score:4,e:{confidence:7,energy:4,participation:8,purchase:13,control:10},feedback:'Primero descubres capacidad; luego administras la herramienta de cierre.'},
      {text:'Ofreces alternativas como tarjeta, cheque o combinación de medios.',score:3,e:{confidence:6,energy:3,participation:7,purchase:10,control:8},feedback:'Es una muy buena alternativa. Primero conviene confirmar qué recursos tiene disponibles.'}
    ]},
    {stage:'Beneficios',line:'Diana pide descuento, regalo, menos inicial y meses sin interés, todo al mismo tiempo.',prompt:'¿Cómo negocias?',options:[
      {text:'Le das todo para cerrar rápido.',score:0,e:{confidence:1,energy:2,participation:2,purchase:5,control:-15},feedback:'Puede subir el interés inmediato, pero destruye margen y control.'},
      {text:'Entregas cada beneficio apenas lo pide.',score:1,e:{confidence:2,energy:1,participation:3,purchase:3,control:-9},feedback:'Tus herramientas pierden valor porque no exigen compromiso.'},
      {text:'Guardas las herramientas y las intercambias una por una por decisiones concretas.',score:4,e:{confidence:5,energy:4,participation:8,purchase:12,control:13},feedback:'Cada beneficio tiene un propósito y genera reciprocidad.'},
      {text:'Llamas a tu sponsor para que resuelva todo.',score:2,e:{confidence:1,energy:0,participation:1,purchase:4,control:-6},feedback:'El apoyo sirve, pero tú debes conservar la dirección.'}
    ]},
    {stage:'Decisión',line:'Ya eligieron paquete y cuota. Ambos asienten y preguntan qué sigue.',prompt:'¿Qué haces ahora?',options:[
      {text:'Pides la cédula y avanzas con la documentación.',score:3,e:{confidence:5,energy:3,participation:5,purchase:12,control:10},feedback:'Es una buena respuesta y protege el impulso.'},
      {text:'Sigues explorando otros paquetes para vender más.',score:1,e:{confidence:-2,energy:-5,participation:-3,purchase:-6,control:-4},feedback:'Reabriste una decisión que ya estaba tomada.'},
      {text:'Antes de financiar, preguntas si prefieren aprovechar una compra de contado.',score:4,e:{confidence:5,energy:2,participation:5,purchase:13,control:11},feedback:'Confirmas una alternativa superior antes de formalizar el crédito.'},
      {text:'Reduces el paquete para que paguen menos.',score:1,e:{confidence:0,energy:-2,participation:-2,purchase:-5,control:-4},feedback:'No había una objeción que justificara reducir valor.'}
    ]}
  ]
},
{
  name:'Familia Gómez',city:'Chía',level:'Intermedio',stars:3,profile:'Rosa, Jaime y su vecina habitual',tag:'Salud, costumbres e influencia externa',
  hook:'Rosa quiere cocinar más saludable. Jaime es tradicional y una vecina suele opinar en todo.',goal:'Aprender a manejar terceros sin perder la demostración.',opening:{confidence:50,energy:68,participation:46,purchase:28,control:55},
  scenes:[
    {stage:'Inicio',line:'Rosa habla de salud, pero Jaime dice que a su edad no piensa cambiar la forma de cocinar.',prompt:'¿Cuál es tu mejor respuesta?',options:[
      {text:'Le dices que está equivocado.',score:0,e:{confidence:-12,energy:-5,participation:-8,purchase:-10,control:-4},feedback:'La confrontación endurece su postura.'},
      {text:'Le preguntas qué sabor o costumbre no estaría dispuesto a perder.',score:4,e:{confidence:10,energy:3,participation:9,purchase:7,control:7},feedback:'Descubres la condición emocional detrás de la resistencia.'},
      {text:'Hablas solo con Rosa, que sí está interesada.',score:1,e:{confidence:-4,energy:-1,participation:-10,purchase:-4,control:-3},feedback:'Excluyes al decisor más resistente.'},
      {text:'Prometes que nada cambiará.',score:1,e:{confidence:0,energy:0,participation:1,purchase:1,control:-2},feedback:'Es una promesa demasiado amplia y poco creíble.'}
    ]},
    {stage:'Prueba',line:'Jaime afirma que cocinar sin aceite siempre deja la comida seca.',prompt:'¿Qué haces?',options:[
      {text:'Le das una explicación técnica de diez minutos.',score:1,e:{confidence:0,energy:-10,participation:-5,purchase:-2,control:1},feedback:'La explicación puede ser correcta, pero el exceso de teoría baja la energía.'},
      {text:'Le propones comprobarlo juntos y lo haces responsable de revisar el resultado.',score:4,e:{confidence:8,energy:8,participation:14,purchase:9,control:8},feedback:'Transformas la objeción en una experiencia.'},
      {text:'Evitas cocinar esa receta.',score:1,e:{confidence:-1,energy:-2,participation:-2,purchase:-5,control:-3},feedback:'Evitaste la prueba central.'},
      {text:'Le dices que todos tus clientes ya entendieron eso.',score:0,e:{confidence:-8,energy:-4,participation:-7,purchase:-6,control:-4},feedback:'La comparación con otros clientes invalida su inquietud.'}
    ]},
    {stage:'Tercero',line:'En medio de la negociación llega la vecina y empieza a hacer preguntas.',prompt:'¿Qué haces?',options:[
      {text:'La ignoras para mantener el foco.',score:1,e:{confidence:-2,energy:-2,participation:-4,purchase:-2,control:2},feedback:'Conservas el hilo, pero generas incomodidad social.'},
      {text:'Le das comida para que no hable mucho.',score:1,e:{confidence:1,energy:2,participation:1,purchase:-1,control:-1},feedback:'Es amable, pero no manejas su influencia.'},
      {text:'Repites toda la demostración desde el inicio.',score:0,e:{confidence:-4,energy:-15,participation:-10,purchase:-8,control:-10},feedback:'Agotas a la familia y pierdes el cierre.'},
      {text:'Le tomas los datos para una demostración propia y vuelves al cierre.',score:3,e:{confidence:4,energy:1,participation:4,purchase:5,control:8},feedback:'Capturas la oportunidad sin detener demasiado la visita.'},
      {text:'Invitas a Rosa y Jaime a contarle qué fue lo que más les sorprendió.',score:4,e:{confidence:8,energy:6,participation:13,purchase:11,control:9},feedback:'La retroalimentación del cliente crea compromiso y prueba social.'}
    ]},
    {stage:'Influencia',line:'La vecina dice que vio algo parecido mucho más barato.',prompt:'¿Cómo respondes?',options:[
      {text:'Le preguntas qué comparó exactamente y vuelves a los criterios que Rosa y Jaime valoraron.',score:4,e:{confidence:8,energy:2,participation:8,purchase:8,control:9},feedback:'No discutes precio aislado; reconstruyes valor y contexto.'},
      {text:'Dices que seguramente era una imitación.',score:0,e:{confidence:-8,energy:-4,participation:-5,purchase:-7,control:-4},feedback:'Descalificas sin información.'},
      {text:'Ofreces descuento inmediato.',score:1,e:{confidence:0,energy:1,participation:1,purchase:2,control:-8},feedback:'Cedes antes de saber si existe una comparación real.'},
      {text:'Le dices que no está comprando ella.',score:0,e:{confidence:-12,energy:-8,participation:-10,purchase:-10,control:-5},feedback:'El comentario puede poner a todos en tu contra.'}
    ]},
    {stage:'Cierre',line:'Rosa quiere avanzar. Jaime todavía dice: “Déjeme pensarlo”.',prompt:'¿Qué pregunta ayuda más?',options:[
      {text:'“¿Qué exactamente necesita pensar: el producto, el valor o la forma de pago?”',score:4,e:{confidence:7,energy:2,participation:8,purchase:12,control:10},feedback:'Aíslas la objeción y permites una respuesta concreta.'},
      {text:'“¿Entonces no le gustó?”',score:1,e:{confidence:-2,energy:-2,participation:-2,purchase:-3,control:-1},feedback:'La pregunta empuja a defender una posición negativa.'},
      {text:'“Todos dicen eso y después compran”.',score:0,e:{confidence:-8,energy:-4,participation:-6,purchase:-8,control:-4},feedback:'Generalizas y minimizas su decisión.'},
      {text:'“¿Lo llamo la próxima semana?”',score:2,e:{confidence:2,energy:-1,participation:1,purchase:-2,control:-5},feedback:'Mantienes seguimiento, pero no trabajas la objeción actual.'}
    ]},
    {stage:'4 en 14',line:'La vecina también quiere saber cómo funciona el programa de premios.',prompt:'¿Cómo aprovechas la situación?',options:[
      {text:'Haces el puente con Rosa y Jaime y usas a la vecina como primera instantánea.',score:4,e:{confidence:7,energy:7,participation:12,purchase:4,control:10},feedback:'La situación se convierte en una demostración viva del programa.'},
      {text:'Le explicas todo solo a la vecina.',score:1,e:{confidence:-2,energy:-3,participation:-5,purchase:-2,control:-5},feedback:'Desplazas a tus clientes principales.'},
      {text:'Evitas el tema porque ya hay demasiada gente.',score:1,e:{confidence:0,energy:0,participation:-3,purchase:0,control:-2},feedback:'Pierdes una oportunidad natural.'},
      {text:'Pides los datos de todos sin explicar nada.',score:0,e:{confidence:-6,energy:-2,participation:-5,purchase:-2,control:-5},feedback:'Pedir datos sin contexto genera resistencia.'}
    ]}
  ]
},
{
  name:'Familia Moreno',city:'Bogotá',level:'Intermedio',stars:3,profile:'Paola, Sergio y Mateo de 19 años',tag:'Joven saboteador y decisores divididos',
  hook:'Mateo suele bromear y cuestionar todo. Paola se ríe; Sergio se incomoda.',goal:'Aprender a integrar a quien sabotea sin perder autoridad.',opening:{confidence:47,energy:74,participation:55,purchase:25,control:50},
  scenes:[
    {stage:'Primer reto',line:'Mateo interrumpe tu presentación y dice: “A ver, sorpréndanos pues”.',prompt:'¿Qué haces?',options:[
      {text:'Lo ignoras y continúas como si no estuviera.',score:2,e:{confidence:-1,energy:-1,participation:-5,purchase:0,control:2},feedback:'No escalas, pero él puede seguir buscando atención.'},
      {text:'Lo ridiculizas para recuperar autoridad.',score:0,e:{confidence:-12,energy:-8,participation:-12,purchase:-10,control:-8},feedback:'Ganar una broma puede hacerte perder a toda la familia.'},
      {text:'Lo haces parte de las partes más interactivas y le das una responsabilidad concreta.',score:4,e:{confidence:8,energy:12,participation:15,purchase:6,control:9},feedback:'Canalizas su energía y lo conviertes en aliado.'},
      {text:'Muestras incomodidad para que sus padres lo corrijan.',score:2,e:{confidence:-2,energy:-3,participation:-2,purchase:-1,control:1},feedback:'Puede detenerlo, pero crea tensión familiar.'}
    ]},
    {stage:'Autoridad',line:'Mateo afirma que vio en TikTok que todos los utensilios de acero son iguales.',prompt:'¿Cómo respondes?',options:[
      {text:'Le dices que TikTok no sirve para aprender.',score:0,e:{confidence:-8,energy:-5,participation:-8,purchase:-5,control:-4},feedback:'Atacas su fuente y su identidad.'},
      {text:'Le preguntas qué afirmaba el video y propones comprobar juntos una diferencia observable.',score:4,e:{confidence:8,energy:7,participation:12,purchase:8,control:8},feedback:'Respetas su aporte y lo llevas a evidencia.'},
      {text:'Cambias de tema.',score:1,e:{confidence:-1,energy:-1,participation:-3,purchase:-3,control:-2},feedback:'La duda queda abierta.'},
      {text:'Le muestras diez certificaciones sin explicarlas.',score:2,e:{confidence:1,energy:-6,participation:-4,purchase:1,control:2},feedback:'Aportas evidencia, pero sin conexión puede abrumar.'}
    ]},
    {stage:'Pareja dividida',line:'Paola está entusiasmada. Sergio mira el precio y guarda silencio.',prompt:'¿Qué haces?',options:[
      {text:'Cierras con Paola porque ella ya está convencida.',score:1,e:{confidence:-4,energy:0,participation:-8,purchase:-5,control:-2},feedback:'Ignoras al decisor silencioso.'},
      {text:'Le preguntas a Sergio qué parte le genera más duda sin exponerlo.',score:4,e:{confidence:9,energy:2,participation:10,purchase:9,control:8},feedback:'Traes al decisor a la conversación con respeto.'},
      {text:'Le preguntas a Paola si puede comprar sin él.',score:0,e:{confidence:-14,energy:-6,participation:-10,purchase:-14,control:-7},feedback:'Generas conflicto en la pareja.'},
      {text:'Bajas el precio antes de que Sergio hable.',score:1,e:{confidence:0,energy:1,participation:0,purchase:1,control:-9},feedback:'Negocias contra ti mismo.'}
    ]},
    {stage:'Anclaje de inicial',line:'La familia pregunta cuánto debería dar de inicial.',prompt:'¿Cómo la presentas?',options:[
      {text:'Dices únicamente que el mínimo es 5%.',score:2,e:{confidence:3,energy:1,participation:2,purchase:3,control:1},feedback:'Es correcto, pero anclas en el mínimo.'},
      {text:'Explicas que normalmente una compra así se inicia con $1.000.000 a $2.000.000 y luego ajustas según su realidad.',score:4,e:{confidence:5,energy:2,participation:5,purchase:10,control:11},feedback:'Creas un anclaje alto antes de presentar el mínimo posible.'},
      {text:'Das tú la inicial y confías en que te paguen.',score:0,e:{confidence:-8,energy:-3,participation:-2,purchase:-12,control:-15},feedback:'Asumes un riesgo personal y desordenas la venta.'},
      {text:'Ofreces un regalo antes de que respondan.',score:1,e:{confidence:1,energy:2,participation:1,purchase:2,control:-8},feedback:'Gastaste una herramienta antes de necesitarla.'}
    ]},
    {stage:'Herramientas de cierre',line:'Sergio pide un beneficio adicional después de aceptar la cuota.',prompt:'¿Qué haces?',options:[
      {text:'Entregas el mejor regalo de inmediato.',score:1,e:{confidence:2,energy:2,participation:2,purchase:4,control:-7},feedback:'Puede ayudar, pero no obtuviste un compromiso a cambio.'},
      {text:'Preguntas: “Si logro ese beneficio, ¿avanzamos hoy?”',score:4,e:{confidence:6,energy:3,participation:6,purchase:12,control:12},feedback:'Intercambias concesión por compromiso.'},
      {text:'Dices que no hay ningún beneficio.',score:2,e:{confidence:-1,energy:-1,participation:-1,purchase:-2,control:4},feedback:'Proteges margen, pero cierras una herramienta útil.'},
      {text:'Llamas al sponsor sin explicar por qué.',score:1,e:{confidence:0,energy:-1,participation:0,purchase:1,control:-7},feedback:'La llamada sin contexto reduce tu autoridad.'}
    ]},
    {stage:'Cierre final',line:'Mateo, que al inicio saboteaba, dice: “Pues sí está chévere”.',prompt:'¿Cómo aprovechas esta señal?',options:[
      {text:'Le pides que le diga a sus padres que compren.',score:2,e:{confidence:2,energy:3,participation:5,purchase:4,control:0},feedback:'Usas su influencia, pero puede sentirse manipulado.'},
      {text:'Le preguntas qué fue lo que más le sorprendió y dejas que lo explique.',score:4,e:{confidence:7,energy:6,participation:10,purchase:9,control:7},feedback:'La familia escucha una conclusión auténtica de quien más cuestionó.'},
      {text:'Le recuerdas que al principio no creía.',score:0,e:{confidence:-7,energy:-6,participation:-8,purchase:-5,control:-4},feedback:'Convertiste una victoria en humillación.'},
      {text:'Lo ignoras y vuelves al precio.',score:1,e:{confidence:0,energy:-2,participation:-4,purchase:1,control:1},feedback:'Pierdes una poderosa señal social.'}
    ]}
  ]
},
{
  name:'Familia Cárdenas',city:'Cajicá',level:'Experto',stars:4,profile:'Natalia y Óscar · empresarios',tag:'Negociación, beneficios y margen',
  hook:'Compran rápido cuando ven valor, pero negocian cada condición y siempre piden más.',goal:'Administrar herramientas de cierre sin perder margen ni control.',opening:{confidence:44,energy:64,participation:42,purchase:24,control:48},
  scenes:[
    {stage:'Comparación',line:'Óscar muestra una cotización de otra marca y dice que cuesta menos.',prompt:'¿Cuál es tu primera respuesta?',options:[
      {text:'Igualas el precio sin revisar la cotización.',score:0,e:{confidence:0,energy:1,participation:1,purchase:3,control:-14},feedback:'Negocias antes de saber si la comparación es equivalente.'},
      {text:'Preguntas qué incluye, qué garantía tiene y qué fue lo que más valoró de esa propuesta.',score:4,e:{confidence:7,energy:2,participation:8,purchase:8,control:10},feedback:'Desarmas la comparación sin atacar al competidor.'},
      {text:'Dices que la otra marca es mala.',score:0,e:{confidence:-9,energy:-4,participation:-6,purchase:-6,control:-4},feedback:'La descalificación reduce credibilidad.'},
      {text:'Ignoras la cotización y sigues.',score:1,e:{confidence:-3,energy:-1,participation:-4,purchase:-4,control:-2},feedback:'La objeción seguirá presente.'}
    ]},
    {stage:'Anclaje',line:'Natalia pregunta: “¿Con cuánto podemos iniciar?”.',prompt:'¿Qué opción protege mejor la negociación?',options:[
      {text:'Presentar primero una inicial fuerte y luego ajustar según capacidad real.',score:4,e:{confidence:5,energy:2,participation:5,purchase:10,control:12},feedback:'El anclaje crea espacio para negociar sin empezar en el mínimo.'},
      {text:'Decir de una vez el mínimo permitido.',score:2,e:{confidence:3,energy:1,participation:2,purchase:4,control:0},feedback:'Es claro, pero reduce tu margen de negociación.'},
      {text:'Ofrecer regalo antes de pedir inicial.',score:1,e:{confidence:1,energy:2,participation:1,purchase:2,control:-8},feedback:'Usas un as sin recibir compromiso.'},
      {text:'Pagar una parte por ellos.',score:0,e:{confidence:-6,energy:-2,participation:-2,purchase:-10,control:-15},feedback:'No debes financiar personalmente al cliente.'}
    ]},
    {stage:'Concesiones',line:'Óscar pide descuento. Natalia pide un obsequio. Ambos quieren menos inicial.',prompt:'¿Cómo ordenas tus herramientas?',options:[
      {text:'Presentas todo el paquete de beneficios al mismo tiempo.',score:1,e:{confidence:2,energy:2,participation:2,purchase:5,control:-12},feedback:'Sube el atractivo, pero pierdes todas tus cartas de una vez.'},
      {text:'Aíslas la objeción principal y entregas una herramienta solo a cambio de un compromiso.',score:4,e:{confidence:6,energy:3,participation:7,purchase:13,control:13},feedback:'Concesión y compromiso avanzan juntos.'},
      {text:'Te niegas a negociar cualquier cosa.',score:2,e:{confidence:-2,energy:-2,participation:-2,purchase:-3,control:6},feedback:'Proteges margen, pero puedes perder una venta viable.'},
      {text:'Llamas al sponsor para que ofrezca más.',score:1,e:{confidence:0,energy:0,participation:1,purchase:2,control:-8},feedback:'Cedes autoridad y quizá margen sin estrategia.'}
    ]},
    {stage:'Cierre condicional',line:'Natalia dice: “Si nos das el cuchillo, compramos”. Óscar todavía no confirma.',prompt:'¿Qué haces?',options:[
      {text:'Entregas el cuchillo y das por cerrada la venta.',score:2,e:{confidence:3,energy:3,participation:4,purchase:7,control:-2},feedback:'Hay avance, pero falta confirmar al segundo decisor.'},
      {text:'Confirmas con Óscar: “Si incluimos el cuchillo, ¿los dos avanzan hoy con este paquete?”',score:4,e:{confidence:6,energy:3,participation:8,purchase:14,control:13},feedback:'Conviertes la petición en un compromiso bilateral.'},
      {text:'Dices que Natalia ya decidió y que Óscar no importa.',score:0,e:{confidence:-15,energy:-7,participation:-12,purchase:-15,control:-8},feedback:'Rompes la decisión conjunta.'},
      {text:'Añades además otro regalo para asegurar.',score:1,e:{confidence:2,energy:2,participation:2,purchase:4,control:-10},feedback:'Sobreconcedes sin necesidad.'}
    ]},
    {stage:'Forma de pago',line:'Ya aceptaron paquete y cuota. Tienen liquidez, pero no han hablado de contado.',prompt:'¿Qué haces?',options:[
      {text:'Pides la cédula inmediatamente.',score:3,e:{confidence:4,energy:2,participation:4,purchase:11,control:9},feedback:'Es una buena ejecución y conserva impulso.'},
      {text:'Antes de financiar, preguntas si desean revisar el beneficio de pagar de contado.',score:4,e:{confidence:5,energy:2,participation:5,purchase:13,control:11},feedback:'Exploras una mejor forma de pago sin reabrir el producto.'},
      {text:'Buscas un paquete más grande.',score:1,e:{confidence:-2,energy:-4,participation:-3,purchase:-5,control:-4},feedback:'Reabres una decisión ya tomada.'},
      {text:'Reduces el paquete.',score:0,e:{confidence:-2,energy:-3,participation:-3,purchase:-8,control:-6},feedback:'No existe una objeción que justifique reducir.'}
    ]},
    {stage:'Silencio de cierre',line:'Después de presentar la propuesta, ambos se miran y guardan silencio.',prompt:'¿Qué haces durante los siguientes segundos?',options:[
      {text:'Hablas de inmediato y añades más beneficios.',score:1,e:{confidence:0,energy:-2,participation:-1,purchase:-3,control:-7},feedback:'Rompiste el silencio y negociaste contra ti mismo.'},
      {text:'Mantienes el silencio con calma y les das espacio para decidir.',score:4,e:{confidence:5,energy:1,participation:4,purchase:10,control:12},feedback:'El silencio bien sostenido transmite seguridad.'},
      {text:'Preguntas tres veces si van a comprar.',score:0,e:{confidence:-9,energy:-5,participation:-7,purchase:-9,control:-5},feedback:'La insistencia genera presión.'},
      {text:'Cierras el catálogo y te preparas para irte.',score:2,e:{confidence:1,energy:-2,participation:-2,purchase:0,control:-1},feedback:'Puede activar pérdida, pero también parecer una retirada prematura.'}
    ]}
  ]
},
{
  name:'Familia Herrera',city:'Bogotá',level:'Experto',stars:5,profile:'Camila, Julián y la madre de Camila',tag:'Objeciones ocultas y cierre complejo',
  hook:'Todos parecen interesados, pero cada persona tiene una razón distinta para no decidir.',goal:'Leer decisores, aislar objeciones y cerrar sin presión.',opening:{confidence:38,energy:58,participation:40,purchase:18,control:42},
  scenes:[
    {stage:'Mapa de poder',line:'Camila pregunta mucho, Julián casi no habla y la madre opina sobre cada precio.',prompt:'¿A quién diriges la conversación?',options:[
      {text:'Solo a Camila, porque es quien demuestra interés.',score:1,e:{confidence:-2,energy:0,participation:-8,purchase:-4,control:-2},feedback:'Confundes interés visible con poder de decisión.'},
      {text:'A la madre, porque domina la conversación.',score:1,e:{confidence:-3,energy:-1,participation:-5,purchase:-3,control:-4},feedback:'Le entregas el control al tercero más vocal.'},
      {text:'Incluyes a los tres y haces preguntas para descubrir quién decide qué.',score:4,e:{confidence:8,energy:2,participation:12,purchase:8,control:10},feedback:'Construyes un mapa de decisión antes de cerrar.'},
      {text:'A Julián únicamente, porque está callado.',score:2,e:{confidence:1,energy:0,participation:4,purchase:2,control:2},feedback:'Es importante incluirlo, pero no excluir a las demás.'}
    ]},
    {stage:'Objeción oculta',line:'Camila dice que quiere pensarlo. Julián mira la cuota. La madre pregunta por la garantía.',prompt:'¿Cuál es tu mejor paso?',options:[
      {text:'Responder primero la garantía y asumir que esa es la objeción.',score:2,e:{confidence:3,energy:1,participation:3,purchase:2,control:1},feedback:'Resuelves una duda, pero quizá no la barrera real.'},
      {text:'Preguntar a cada uno qué necesita tener claro para sentirse cómodo avanzando.',score:4,e:{confidence:8,energy:2,participation:10,purchase:10,control:10},feedback:'Separas las tres barreras y evitas responder a ciegas.'},
      {text:'Dar un descuento general.',score:0,e:{confidence:0,energy:1,participation:1,purchase:2,control:-12},feedback:'Una concesión no resuelve tres objeciones distintas.'},
      {text:'Pedirles que lo hablen solos.',score:1,e:{confidence:1,energy:-2,participation:-2,purchase:-5,control:-8},feedback:'Pierdes la oportunidad de facilitar la decisión.'}
    ]},
    {stage:'Presupuesto',line:'Julián dice que la cuota le gusta, pero teme comprometerse por tantos meses.',prompt:'¿Qué respuesta es más consultiva?',options:[
      {text:'“Si le gusta la cuota, firme y después miramos”.',score:0,e:{confidence:-12,energy:-4,participation:-7,purchase:-10,control:-5},feedback:'Minimizas un temor financiero legítimo.'},
      {text:'“Revisemos cuánto pueden aportar con comodidad y qué plazo les da tranquilidad”.',score:4,e:{confidence:10,energy:2,participation:9,purchase:10,control:9},feedback:'Transformas el miedo en variables concretas.'},
      {text:'“Todos se acostumbran a pagar”.',score:0,e:{confidence:-9,energy:-3,participation:-5,purchase:-8,control:-4},feedback:'Generalizas y reduces confianza.'},
      {text:'Reducir el paquete sin preguntar más.',score:2,e:{confidence:1,energy:0,participation:1,purchase:0,control:-3},feedback:'Puede ayudar, pero quizá sacrificas valor innecesariamente.'}
    ]},
    {stage:'Intereses',line:'La madre dice que ningún interés vale la pena y aconseja no firmar.',prompt:'¿Cómo respondes sin confrontarla?',options:[
      {text:'Le dices que la compra no es para ella.',score:0,e:{confidence:-15,energy:-8,participation:-10,purchase:-13,control:-6},feedback:'La conviertes en oposición activa.'},
      {text:'Le das la razón en que deben entender el costo y explicas con un ejemplo cómo cambia al abonar más rápido.',score:4,e:{confidence:10,energy:2,participation:8,purchase:9,control:8},feedback:'Validas la preocupación y la conviertes en educación financiera.'},
      {text:'Prometes que casi no pagarán intereses.',score:0,e:{confidence:-12,energy:-5,participation:-6,purchase:-10,control:-8},feedback:'Una promesa imprecisa daña credibilidad.'},
      {text:'Ignoras el comentario y sigues con Camila.',score:1,e:{confidence:-4,energy:-1,participation:-5,purchase:-4,control:-2},feedback:'La influencia seguirá presente.'}
    ]},
    {stage:'Cierre avanzado',line:'Camila quiere comprar. Julián acepta la cuota. La madre insiste en que esperen una semana.',prompt:'¿Qué cierre protege mejor la relación y la decisión?',options:[
      {text:'Pedirle a Camila que firme a escondidas de su madre.',score:0,e:{confidence:-18,energy:-10,participation:-12,purchase:-18,control:-12},feedback:'La venta no debe construirse sobre conflicto familiar.'},
      {text:'Resumir los acuerdos de Camila y Julián, preguntar qué riesgo concreto ven en decidir hoy y resolver solo ese punto.',score:4,e:{confidence:9,energy:3,participation:10,purchase:15,control:13},feedback:'Aíslas la última barrera sin atacar a la madre.'},
      {text:'Ofrecer todos los regalos disponibles.',score:1,e:{confidence:1,energy:2,participation:2,purchase:5,control:-13},feedback:'La objeción no era falta de regalos.'},
      {text:'Irte y llamar en una semana.',score:2,e:{confidence:3,energy:-2,participation:-2,purchase:-4,control:-8},feedback:'Conservas la relación, pero abandonas una decisión madura.'}
    ]},
    {stage:'Control de visita',line:'La conversación se desvía hacia política y lleva diez minutos fuera del tema.',prompt:'¿Cómo recuperas el hilo?',options:[
      {text:'Interrumpes y dices que eso no importa.',score:0,e:{confidence:-8,energy:-5,participation:-6,purchase:-5,control:1},feedback:'Recuperas tema, pero de forma brusca.'},
      {text:'Te unes a la conversación durante otros veinte minutos.',score:1,e:{confidence:4,energy:-10,participation:2,purchase:-4,control:-15},feedback:'Ganas cercanía, pero pierdes dirección.'},
      {text:'Reconoces el comentario, conectas una frase con la necesidad descubierta y vuelves al cierre.',score:4,e:{confidence:6,energy:3,participation:5,purchase:7,control:14},feedback:'Recuperas el control sin cortar la relación.'},
      {text:'Empiezas a guardar todo para que reaccionen.',score:2,e:{confidence:-1,energy:-2,participation:-2,purchase:1,control:2},feedback:'Puede generar urgencia, pero no es la forma más elegante.'}
    ]}
  ]
}
];

(()=>{
 // v6.1: aislar Demo Experience de los controladores antiguos que quedaron en app.js.
 // Reemplazar el nodo completo elimina todos los listeners heredados sin afectar el resto de Bleu One.
 const root=document.getElementById('gimnasioventas'); if(!root) return;
 // Controlador único: reemplaza solo el escenario para limpiar cualquier listener residual.
 const previousStage=root.querySelector('#salesGymStage'); if(!previousStage) return;
 const stage=previousStage.cloneNode(false);
 previousStage.replaceWith(stage);
 const families=window.BLEU_DEMO_FAMILIES;
 let current=0, scene=0, points=0, maxPoints=0;
 let state={confidence:50,energy:60,participation:50,purchase:25,control:50};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
 function stars(n){return '★'.repeat(n)+'☆'.repeat(5-n)}
 function label(v){return v>=80?'Muy alto':v>=65?'Alto':v>=45?'Medio':v>=25?'Bajo':'Muy bajo'}
 function mood(){
   const avg=(state.confidence+state.energy+state.participation+state.purchase+state.control)/5;
   if(avg>=78)return['Visita muy sólida','La familia está conectada y la decisión avanza.'];
   if(avg>=62)return['Buena conexión','Hay terreno para cerrar, pero aún debes cuidar el equilibrio.'];
   if(avg>=46)return['Visita sensible','Una mala decisión puede cambiar el rumbo.'];
   if(avg>=30)return['Visita en riesgo','La familia está perdiendo conexión o interés.'];
   return['Visita casi perdida','Necesitas recuperar confianza y control.'];
 }
 function meters(){
   const m=mood();
   const rows=[['Confianza','confidence','❤️'],['Energía','energy','⚡'],['Participación','participation','🤝'],['Probabilidad de compra','purchase','🛒'],['Control de la visita','control','🎯']];
   return `<section class="visit-status"><div class="visit-mood"><span>ESTADO DE LA VISITA</span><strong>${m[0]}</strong><small>${m[1]}</small></div><div class="visit-meters">${rows.map(([lab,key,ico])=>`<div class="visit-meter"><div><span>${ico} ${lab}</span><b>${state[key]}%</b></div><i><em style="width:${state[key]}%"></em></i><small>${label(state[key])}</small></div>`).join('')}</div></section>`;
 }
 function apply(opt){Object.entries(opt.e||{}).forEach(([k,v])=>state[k]=clamp(state[k]+v));points+=opt.score||0;maxPoints+=4}
 function updateHeader(){const el=document.getElementById('demoVisitProgress');if(el)el.textContent='6 familias disponibles'}
 function library(){
   updateHeader();
   stage.innerHTML=`<div class="game-head"><div><span class="game-kicker">Demo Experience</span><h3>Elige una familia para visitar</h3></div><span class="badge">6 experiencias</span></div><p class="demo-short-intro">Cada familia tiene una historia distinta. Las estrellas indican el <strong>nivel de dificultad</strong>.</p><div class="family-grid family-grid-six">${families.map((f,i)=>`<button class="family-card" data-i="${i}"><div class="family-card-top"><span class="family-number">${String(i+1).padStart(2,'0')}</span><span class="difficulty-stars" aria-label="Nivel de dificultad ${f.stars} de 5">${stars(f.stars)}</span></div><span class="difficulty-label">Nivel de dificultad · ${esc(f.level)}</span><h4>${esc(f.name)}</h4><p>${esc(f.hook)}</p><div class="family-meta"><span>📍 ${esc(f.city)}</span><span>${esc(f.tag)}</span></div><b>Visitar familia →</b></button>`).join('')}</div>`;
   stage.querySelectorAll('.family-card').forEach(b=>b.onclick=()=>assignment(Number(b.dataset.i)));
 }
 function assignment(i){
   current=i;scene=0;points=0;maxPoints=0;state={...families[i].opening};const f=families[i];
   stage.innerHTML=`<button class="text-back" id="backLibrary">← Elegir otra familia</button><div class="demo-assignment compact"><article class="demo-assignment-card"><span class="eyebrow">VISITA ASIGNADA</span><h3>${esc(f.name)}</h3><p>${esc(f.profile)} · ${esc(f.city)}</p><div class="demo-identity"><span>${esc(f.level)}</span><span>${stars(f.stars)} dificultad</span><span>${esc(f.tag)}</span></div></article></div><div class="how-game"><span>ANTES DE TOCAR LA PUERTA</span><h4>${esc(f.hook)}</h4><p><strong>Tu reto:</strong> ${esc(f.goal)}</p><p class="visit-instruction">Lee cada situación y elige lo que realmente harías. No todas las respuestas son simplemente buenas o malas: algunas son aceptables, otras excelentes y otras pueden poner en riesgo la visita.</p></div>${meters()}<button class="primary-action" id="startVisit">Tocar la puerta <span>→</span></button>`;
   document.getElementById('backLibrary').onclick=library;document.getElementById('startVisit').onclick=renderScene;
 }
 function renderScene(){
   const f=families[current],s=f.scenes[scene];
   stage.innerHTML=`<div class="scene-top"><button class="text-back" id="exitVisit">← Salir</button><span>Situación ${scene+1} de ${f.scenes.length}</span></div>${meters()}<div class="dialogue-card"><small>${esc(s.stage)}</small><span class="scene-label">LO QUE ESTÁ PASANDO</span><h3>${esc(f.name)}</h3><p>${esc(s.line)}</p></div><div class="decision-card"><span class="scene-label">TU DECISIÓN</span><h4>${esc(s.prompt)}</h4><p class="decision-help">Elige la respuesta o acción que usarías en una visita real.</p><div class="choice-list">${s.options.map((o,i)=>`<button data-i="${i}"><span>${String.fromCharCode(65+i)}</span>${esc(o.text)}</button>`).join('')}</div><div class="scene-feedback" hidden></div><button class="primary-action next-scene" hidden>${scene===f.scenes.length-1?'Ver resultado':'Continuar la visita'} <span>→</span></button></div>`;
   document.getElementById('exitVisit').onclick=()=>assignment(current);
   const fb=stage.querySelector('.scene-feedback'),next=stage.querySelector('.next-scene');
   stage.querySelectorAll('.choice-list button').forEach(b=>b.onclick=()=>{
     stage.querySelectorAll('.choice-list button').forEach(x=>x.disabled=true);
     const opt=s.options[Number(b.dataset.i)];apply(opt);
     const best=Math.max(...s.options.map(x=>x.score));const quality=opt.score===best?'excellent':opt.score>=3?'good':opt.score===2?'partial':'bad';
     b.classList.add(quality==='excellent'||quality==='good'?'correct':quality==='partial'?'partial':'wrong');
     const delta=Object.entries(opt.e||{}).filter(([,v])=>v!==0).map(([k,v])=>{const names={confidence:'Confianza',energy:'Energía',participation:'Participación',purchase:'Compra',control:'Control'};return `<span class="delta ${v>0?'up':'down'}">${names[k]} ${v>0?'+':''}${v}</span>`}).join('');
     fb.hidden=false;fb.className='scene-feedback '+quality;
     fb.innerHTML=`<strong>${quality==='excellent'?'Excelente decisión':quality==='good'?'Buena decisión':quality==='partial'?'Decisión aceptable':'Esta decisión pone en riesgo la visita'}</strong><p>${esc(opt.feedback)}</p><div class="decision-deltas">${delta}</div>`;
     const old=stage.querySelector('.visit-status');if(old)old.outerHTML=meters();next.hidden=false;
   });
   next.onclick=()=>{if(scene<f.scenes.length-1){scene++;renderScene()}else finish()};
 }
 function finish(){
   const f=families[current],pct=maxPoints?Math.round(points/maxPoints*100):0,m=mood();
   stage.innerHTML=`<div class="v4-result"><span>VISITA COMPLETADA</span><h3>${esc(f.name)}</h3><div class="v4-score">${pct}%</div><h4>${pct>=85?'Criterio comercial sobresaliente':pct>=68?'Buena conducción de la visita':pct>=50?'Hay buenas bases, pero debes afinar decisiones':'Conviene repetir esta familia'}</h4><p>Tu resultado mide la calidad de tus decisiones, no solo respuestas correctas.</p>${meters()}<div class="result-reading"><strong>Así terminó la visita: ${m[0]}</strong><p>${m[1]}</p></div><div class="v4-result-actions"><button class="primary-action" id="retryFamily">Repetir esta familia</button><button class="small-action" id="otherFamily">Elegir otra familia</button></div></div>`;
   document.getElementById('retryFamily').onclick=()=>assignment(current);document.getElementById('otherFamily').onclick=library;
 }
 library();
})();
