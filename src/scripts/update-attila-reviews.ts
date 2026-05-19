/**
 * Replace all Attila reviews with real Discord reviews.
 * Run: .\node_modules\.bin\tsx src\scripts\update-attila-reviews.ts
 */
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const sa = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("❌ Missing key"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "update-attila-reviews");
const db = getFirestore(app);

const COACH_ID = "attila";

const reviews = [
  {
    studentName: "CaciqueOFICIAL",
    rating: 5,
    comment: `Acabo de tener una Sesion de Coaching con @Attila y estando en Diamond 3 y en algún momento estuve en master es increíble todo lo que he aprendido me sentí como nuevo en este coaching! Attila realmente tiene talento para enseñar, muy agradable y muy profesional. Lo recomiendo totalmente! Una inversión valiosa. PD: aun teniendo 10 años jugando league of legends es increíble todo lo que he aprendido en 1 sola sesion. Aparte es muy buena onda 😆`,
    createdAt: "2025-08-13T04:42:00.000Z",
  },
  {
    studentName: "xDiugu3",
    rating: 5,
    comment: `Aprendí mucho del coaching para el poco tiempo que llevo jugando y el nivel que tengo, aunque aún me quede muchísimo más por progresar, gran parte de la información que te brinda no solo te sirve para una línea en concreto, sino para el juego en general y aplicable a cualquier línea o estilo de juego que tengas, se nota claramente la notable experiencia que tiene Attila por todos estos años y lo mucho que le gusta, me lo pasé extremadamente bien durante el coaching y se quedó incluso mas tiempo del estipulado hablando conmigo para resolver varias dudas que tenía del juego en general. No solo contento con el coaching en sí, sino con su profesionalidad, todo lo comentado durante el coaching te hará un resumen de todos los puntos a mejorar o importantes para tu progreso. Destacar que cualquier duda que tengas a posteriori te la solventará dentro de la medida de lo posible y estará pendiente (también en la medida de lo posible) de tus actualizaciones y/o progreso. Todo un señor en este aspecto, no cualquiera lo hace. Con los streams y el coaching la impresión es clara (aunque esto es más personal), una persona con valores y con las ideas claras, no te hace perder el tiempo y por supuesto tampoco quiere que tu se lo hagas perder a él, ya que el de todos es valioso. Por lo que sí, probablemente en un tiempo coja otro(s), para poder mejorar mi desempeño en la grieta. Un placer rey. ❤️`,
    createdAt: "2025-08-13T10:55:00.000Z",
  },
  {
    studentName: "goDB3sus",
    rating: 5,
    comment: `Me encantó la sesion de coach con Attila, aprendí bastante y me di cuenta de mis errores, a la vez que Attila me daba consejos para solucionarlos y alcanzar el máximo nivel. Muy cercano, resuelve cualquier duda y sobre todo muy amable. No te hace ver como un mal jugador y te martiriza, sino que explica tus errores, como solucionarlos a la vez que también marca lo bueno que tienes como jugador. Muy recomendable ❤️`,
    createdAt: "2025-08-13T15:52:00.000Z",
  },
  {
    studentName: "pakovera2002",
    rating: 5,
    comment: `Solo he tenido una sesión pero ya he notado mucho la mejora, realmente hace muy fácil entender la sesión y que errores cometes, apunta todo para que tu te puedas focalizar en la sesión y sinceramente es genial es una persona con la que es fácil hablar y que te ayuda a progresar porque se nota mucho que sabe del juego, estipula una hora pero si se tiene que quedar más para ayudarte lo hace así que solo hay palabras buenas para el, al pensar en un jugador de LEC puedes pensar que tiene ego pero nada más lejos de la realidad es muy fácil hablar con el. Yo subí a oro a las dos semanas del coaching y estoy muy agradecido, seguramente pronto tenga otra sesión con el porque me ha ayudado mucho. Se te quiere y se te echa de menos en competitivo Attila❤️`,
    createdAt: "2025-08-13T16:30:00.000Z",
  },
  {
    studentName: "Skotx_",
    rating: 5,
    comment: `Aprendí mucho en la sesión, tanto en tema de runas, como en tema mecánico y toma de decisiones. La verdad no me pensaba aprender tanto en tan poco tiempo. La sesión duró 1h más o menos y a nivel de mejora fue impresionante. Me resumió los conceptos que debía tener en cuenta y aplicar en las partidas, y gracias a eso pasé a stompear todas las líneas y mis partidas se hicieron muchísimo más fáciles. Te transmite el conocimiento y lo que necesitas saber, y le puedes preguntar lo que quieras en cualquier momento, y si te quedas con dudas te lo repite y/o explica de otra forma hasta que lo entiendas. También queda abierto a que le preguntes cualquier cosa después del coach o a futuro. El trato fue cercano y no hay nada malo que pueda decir.`,
    createdAt: "2025-08-13T16:55:00.000Z",
  },
  {
    studentName: "Rox",
    rating: 5,
    comment: `Buenas voy a plasmar aquí mi experiencia con el señor Atila, me cambié a ADC hace aproximadamente unos 8 meses y aunque supiera los conceptos básicos y no se me diera mal había muchísimas cosas que estaba pasando por alto o que tenía malas costumbres por jugar en otro rol, con una sola sesión te da perfectamente para ver muchas cosas que probablemente no verías o tardarías mucho en darte cuenta si no hubiese hablado con Atila, desde entonces he estado practicando e interiorizando y me va bastante mejor las rankeds aunque algunas se pierdan porque el juego es así, revisando mis partidas veo que mi performance individual ha mejorado y bueno tampoco quiero hacer una biblia 😂 100% recomendable flamea mucho en los streams pero de coach es majo ( a veces )`,
    createdAt: "2025-08-13T19:34:00.000Z",
  },
  {
    studentName: "Maisstor",
    rating: 5,
    comment: `Buenas tardes a todos. Podría extenderme en párrafos llenos de elogios. Creo que los mensajes deben ser claros y concisos.\nAttila realiza un trabajo muy profesional, utilizando mensajes claros y fáciles de conseguir para cualquier nivel. Yo venía de bronce y supo poner foco en aquellos aspecto que me harían mejorar notablemente. En un mes llegué a platino III, cosa que no había llegado antes desde hacía 10 años por lo menos.\nComo decía, es puntual, analítico, sabe focalizar, detectar tus principales handicaps para mejorar en ese tu vs tu. Llevo un tiempo que no estoy pudiendo jugar, y prefiero estar en "stand by" porque otra de las cosas que tuve claras de sus mensajes es que tenía que estar concentrado en practicar en aquellos aspectos que tenía que mejorar. Cuando así lo he hecho, he conseguido rachas que me parecían impensables. Sin duda alguna recomiendo las sesiones con él y por supuesto las retomaré a la vuelta de vacaciones cuando pueda dedicarle el tiempo que él también nos dedica a nosotros.\n\nGracias por tu ayuda.`,
    createdAt: "2025-08-14T16:57:00.000Z",
  },
  {
    studentName: "LegionarioAlexis",
    rating: 5,
    comment: `Saludos bros, es un excelente coach y persona la verdad ayudó a comprender los errores que tenía más aparte conciso al tratar los errores vistos en el micro y macro game, una persona con mucha paciencia. Amadeu hace un excelente trabajo profesional en todos los sentidos el performance alcanzado ha sido el deseado y dejenme decirles que el pone toda su sangre en estos coaching así que ustedes también con poner de su parte subirán hasta dónde se lo propongan.`,
    createdAt: "2025-08-14T23:41:00.000Z",
  },
  {
    studentName: "Maaamaa",
    rating: 5,
    comment: `La experiencia de recibir coach con Attila ha sido increíble. Es un gran profesional, muy buen comunicador y además una excelente persona. Explica todo de manera clara, cercana y con un enfoque que realmente ayuda a mejorar. Si tienes en mente que te dé coach, ni lo dudes: es la mejor decisión.`,
    createdAt: "2025-08-16T11:43:00.000Z",
  },
  {
    studentName: "KingsNeverFall",
    rating: 5,
    comment: `Muy buenas a todos, hace unos meses decidí dar el paso y buscar un coaching porque sentí que me había estancado y así conocí a attila, y no pude estar mas contento, simplemente con una sesión me hizo entender y ver cosas que ni se me habían pasado por la cabeza, puedo decir con orgullo que gracias a él pude subir a master por primera vez... así que si estáis con la duda y no sabéis si probarlo o no ni lo dudéis, estoy seguro que os ayudará un montón.`,
    createdAt: "2025-08-16T18:27:00.000Z",
  },
  {
    studentName: "MarpinLL",
    rating: 5,
    comment: `Mi experiencia con Attila ha sido excelente. Desde el primer día ha estado siempre disponible para resolver dudas y dar seguimiento a los consejos que comparte. Gracias a sus tips y a las notas detalladas que deja después de cada sesión —que ayudan mucho a enfocar en los aspectos clave a mejorar— he pasado de Platino a Diamante. Estoy muy contento con el progreso y con la cercanía que mantiene para seguir preguntando lo que surja incluso después de las sesiones.`,
    createdAt: "2025-08-19T17:00:00.000Z",
  },
  {
    studentName: "Pablorlax",
    rating: 5,
    comment: `Hace casi un mes de mi coaching con Attila. En los primeros 2 minutos de sesión, una partida que yo creía que era buena me enseñó los detalles por los que no lo era. Me he enfocado en los puntos que Attila me recomendó y, aunque no se ha traducido en una drástica subida de elo (sólo de oro a platino), sí que se ha traducido en memorizar ciertos fundamentos básicos que en el futuro cercano me harán subir más de elo. Totalmente recomendable, además que el señor tiene mucha paciencia y capacidad de enseñarte lo que realmente necesitas aprender.`,
    createdAt: "2025-09-11T17:38:00.000Z",
  },
  {
    studentName: "ElGordo",
    rating: 5,
    comment: `Hice una sesión con Attila y lo hizo súper ameno. Desde el primer momento se hace muy cercano y explicando es god, además no se toma ningún tipo de prisa en hacerlo. Recomendable a cien por cien, ya no solamente si tu objetivo es subir elo sino también el entender el juego y mirarlo desde otra perspectiva mucho más amplia. Resumiendo, es un tío de 10 y un profe de 10 !!!`,
    createdAt: "2025-11-30T22:18:00.000Z",
  },
  {
    studentName: "trshcan",
    rating: 5,
    comment: `Hace un poco más de un mes hice mi coaching con Attila. Desde el inicio buscó solucionar mi motivo inicial por el cual busqué el coaching, no fue genérico como la gran mayoría de "coaches" que puedes ver en muchas partes, fue directo al grano y a medida que me daba las pautas para llegar a mi meta, miraba micro errores que podía cometer para no solo llegar a mi meta, si no más allá.\nEs recomendable al 100, es una inversión que vale la pena si lo que buscas es aprender del juego realmente con una persona que te dice las cosas de forma respetuosa pero sincera que te ayuda a ver el juego de otra perspectiva más amplia.`,
    createdAt: "2025-12-17T15:40:00.000Z",
  },
  {
    studentName: "Kenshō",
    rating: 5,
    comment: `Ayer tuve coaching con Attila. Llevo años jugador al LOL for fun pero quería mejorar y tomarlo más en serio. Estaba en platino y en un día ya me he puesto en esmeralda. Es increíble lo bien que explica, como te enseña,... Muy cercano desde el minuto 0. Si queréis mejorar y podéis permitiros el coaching yo no dudaría. Es una experiencia increíble ❤️`,
    createdAt: "2026-01-31T11:56:00.000Z",
  },
];

async function run() {
  console.log("🧹 Deleting existing Attila reviews...\n");

  // Delete all existing reviews for attila
  const existingSnap = await db.collection("reviews").where("coachId", "==", COACH_ID).get();
  if (!existingSnap.empty) {
    const batch = db.batch();
    existingSnap.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    console.log(`  🗑️  Deleted ${existingSnap.size} existing reviews`);
  } else {
    console.log("  ⏭️  No existing reviews to delete");
  }

  console.log("\n🌱 Adding new reviews...\n");

  for (const r of reviews) {
    await db.collection("reviews").add({
      coachId: COACH_ID,
      bookingId: "",
      studentId: "",
      studentName: r.studentName,
      studentAvatar: "",
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    });
    const date = new Date(r.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
    console.log(`  ✅ ${r.studentName} ⭐⭐⭐⭐⭐ (${date})`);
  }

  // Update coach stats
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await db.collection("coaches").doc(COACH_ID).update({
    ratingAvg: Math.round(avg * 10) / 10,
    totalSessions: reviews.length,
    totalStudents: reviews.length,
  });

  console.log(`\n🎉 Done! ${reviews.length} reviews added. Rating: ${avg.toFixed(1)}/5`);
}

run().catch(console.error);
