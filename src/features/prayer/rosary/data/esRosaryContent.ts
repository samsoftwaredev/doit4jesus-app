import { englishRosaryContent, type RosaryContent, type RosaryContentPrayerId } from "./rosaryContent";

const spanishPrayerLibrary: RosaryContent["prayer_library"] = {
  sign_of_cross: {
    title: "Señal de la Cruz",
    text: "En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.",
  },
  apostles_creed: {
    title: "Credo de los Apóstoles",
    text: "Creo en Dios, Padre todopoderoso, Creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios, Padre todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos. Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén.",
  },
  our_father: {
    title: "Padre Nuestro",
    text: "Padre nuestro, que estás en el cielo, santificado sea tu nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación y líbranos del mal. Amén.",
  },
  hail_mary: {
    title: "Ave María",
    text: "Dios te salve, María; llena eres de gracia; el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.",
  },
  glory_be: {
    title: "Gloria",
    text: "Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.",
  },
  fatima_prayer: {
    title: "Oración de Fátima",
    text: "Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia. Amén.",
  },
  hail_holy_queen: {
    title: "La Salve",
    text: "Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra; Dios te salve. A ti llamamos los desterrados hijos de Eva; a ti suspiramos, gimiendo y llorando en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh clemente, oh piadosa, oh dulce Virgen María! Ruega por nosotros, santa Madre de Dios, para que seamos dignos de alcanzar las promesas de nuestro Señor Jesucristo. Amén.",
  },
  saint_michael: {
    title: "Oración a san Miguel Arcángel",
    text: "San Miguel Arcángel, defiéndenos en la batalla. Sé nuestro amparo contra la perversidad y las asechanzas del demonio. Reprímale Dios, pedimos suplicantes, y tú, Príncipe de la milicia celestial, arroja al infierno con el divino poder a Satanás y a los otros espíritus malignos que andan dispersos por el mundo para la perdición de las almas. Amén.",
  },
  litany_of_loreto: {
    title: "Letanías Lauretanas",
    text: `Señor, ten piedad.
Cristo, ten piedad.
Señor, ten piedad.
Cristo, óyenos.
Cristo, escúchanos.

Dios, Padre celestial, ten misericordia de nosotros.
Dios Hijo, Redentor del mundo, ten misericordia de nosotros.
Dios Espíritu Santo, ten misericordia de nosotros.
Santísima Trinidad, un solo Dios, ten misericordia de nosotros.

Santa María, ruega por nosotros.
Santa Madre de Dios, ruega por nosotros.
Santa Virgen de las vírgenes, ruega por nosotros.
Madre de Cristo, ruega por nosotros.
Madre de la Iglesia, ruega por nosotros.
Madre de misericordia, ruega por nosotros.
Madre de la divina gracia, ruega por nosotros.
Madre de la esperanza, ruega por nosotros.
Madre purísima, ruega por nosotros.
Madre castísima, ruega por nosotros.
Madre siempre virgen, ruega por nosotros.
Madre inmaculada, ruega por nosotros.
Madre amable, ruega por nosotros.
Madre admirable, ruega por nosotros.
Madre del buen consejo, ruega por nosotros.
Madre del Creador, ruega por nosotros.
Madre del Salvador, ruega por nosotros.
Virgen prudentísima, ruega por nosotros.
Virgen digna de veneración, ruega por nosotros.
Virgen digna de alabanza, ruega por nosotros.
Virgen poderosa, ruega por nosotros.
Virgen clemente, ruega por nosotros.
Virgen fiel, ruega por nosotros.
Espejo de justicia, ruega por nosotros.
Trono de la sabiduría, ruega por nosotros.
Causa de nuestra alegría, ruega por nosotros.
Vaso espiritual, ruega por nosotros.
Vaso digno de honor, ruega por nosotros.
Vaso insigne de devoción, ruega por nosotros.
Rosa mística, ruega por nosotros.
Torre de David, ruega por nosotros.
Torre de marfil, ruega por nosotros.
Casa de oro, ruega por nosotros.
Arca de la Alianza, ruega por nosotros.
Puerta del cielo, ruega por nosotros.
Estrella de la mañana, ruega por nosotros.
Salud de los enfermos, ruega por nosotros.
Refugio de los pecadores, ruega por nosotros.
Consuelo de los migrantes, ruega por nosotros.
Consoladora de los afligidos, ruega por nosotros.
Auxilio de los cristianos, ruega por nosotros.
Reina de los ángeles, ruega por nosotros.
Reina de los patriarcas, ruega por nosotros.
Reina de los profetas, ruega por nosotros.
Reina de los apóstoles, ruega por nosotros.
Reina de los mártires, ruega por nosotros.
Reina de los confesores, ruega por nosotros.
Reina de las vírgenes, ruega por nosotros.
Reina de todos los santos, ruega por nosotros.
Reina concebida sin pecado original, ruega por nosotros.
Reina asunta a los cielos, ruega por nosotros.
Reina del santísimo Rosario, ruega por nosotros.
Reina de la familia, ruega por nosotros.
Reina de la paz, ruega por nosotros.

Cordero de Dios, que quitas el pecado del mundo, perdónanos, Señor.
Cordero de Dios, que quitas el pecado del mundo, escúchanos, Señor.
Cordero de Dios, que quitas el pecado del mundo, ten misericordia de nosotros.

Ruega por nosotros, santa Madre de Dios, para que seamos dignos de alcanzar las promesas de Cristo.

Oremos. Te rogamos, Señor Dios, que concedas a tus siervos gozar de perpetua salud de alma y cuerpo; y, por la gloriosa intercesión de la bienaventurada siempre Virgen María, seamos librados de la tristeza presente y alcancemos la alegría eterna. Por Cristo nuestro Señor. Amén.`,
  },
};

type MysteryTranslation = {
  description: string;
  fruit: string;
  imageAlt: string;
  scriptureText: string;
  title: string;
};

const mysteryTranslations: Record<string, MysteryTranslation> = {
  the_annunciation: {
    title: "La Anunciación",
    fruit: "Humildad",
    description:
      "María recibe con confianza el mensaje de Dios y se llama a sí misma su sierva. Pide la gracia de dejar el orgullo y acoger la voluntad de Dios con un corazón humilde.",
    scriptureText: "El ángel Gabriel fue enviado por Dios a una ciudad de Galilea llamada Nazaret.",
    imageAlt: "Ilustración del misterio del Rosario: la Anunciación.",
  },
  the_visitation: {
    title: "La Visitación",
    fruit: "Amor al prójimo",
    description:
      "María lleva a Cristo hasta Isabel y la sirve con generosa prontitud. Pide la gracia de reconocer las necesidades de los demás y llevar el amor de Cristo con obras concretas de caridad.",
    scriptureText: "María se levantó en aquellos días y fue de prisa a la región montañosa.",
    imageAlt: "Ilustración del misterio del Rosario: la Visitación.",
  },
  the_nativity: {
    title: "El Nacimiento de Jesús",
    fruit: "Pobreza de espíritu",
    description:
      "Jesús nace en un pesebre humilde y revela que la verdadera riqueza se encuentra en Dios. Pide la gracia de soltar el apego a lo material y atesorar lo que acerca el corazón a él.",
    scriptureText: "Salió un decreto de César Augusto para que todo el mundo fuera empadronado.",
    imageAlt: "Ilustración del misterio del Rosario: el Nacimiento de Jesús.",
  },
  the_presentation: {
    title: "La Presentación",
    fruit: "Obediencia",
    description:
      "María y José presentan a Jesús según la ley de Dios, incluso con sacrificio personal. Pide la gracia de obedecer fielmente a Dios y ofrecerle cada aspecto de tu vida.",
    scriptureText: "Llevaron a Jesús a Jerusalén para presentarlo al Señor.",
    imageAlt: "Ilustración del misterio del Rosario: la Presentación.",
  },
  finding_jesus_in_the_temple: {
    title: "El Niño Jesús hallado en el Templo",
    fruit: "Alegría al encontrar a Jesús",
    description:
      "Después de buscarlo con dolor, María y José encuentran a Jesús en la casa de su Padre. Pide la gracia de buscar a Cristo con perseverancia y alegrarte cada vez que lo encuentres de nuevo.",
    scriptureText: "El niño crecía y se fortalecía, lleno de sabiduría.",
    imageAlt: "Ilustración del misterio del Rosario: Jesús hallado en el Templo.",
  },
  baptism_of_jesus: {
    title: "El Bautismo de Jesús en el Jordán",
    fruit: "Apertura al Espíritu Santo",
    description:
      "En el bautismo de Jesús, el Padre habla y el Espíritu Santo desciende sobre el Hijo. Pide la gracia de escuchar la voz de Dios y seguir la guía del Espíritu con un corazón abierto.",
    scriptureText: "Jesús fue de Galilea al Jordán, donde estaba Juan, para ser bautizado por él.",
    imageAlt: "Ilustración del misterio del Rosario: el Bautismo de Jesús en el Jordán.",
  },
  wedding_at_cana: {
    title: "Las Bodas de Caná",
    fruit: "Confianza en la intercesión de María",
    description:
      "María percibe la necesidad en Caná, se la presenta a Jesús y pide a los sirvientes que lo sigan. Pide la gracia de confiar en su intercesión y hacer lo que Cristo te diga.",
    scriptureText: "Se celebraron unas bodas en Caná de Galilea, y la madre de Jesús estaba allí.",
    imageAlt: "Ilustración del misterio del Rosario: las Bodas de Caná.",
  },
  proclamation_of_the_kingdom: {
    title: "El Anuncio del Reino de Dios",
    fruit: "Conversión",
    description:
      "Jesús anuncia el Reino de Dios y llama a todos a convertirse y creer en el Evangelio. Pide la gracia de apartarte del pecado y permitir que Cristo transforme tu vida diaria.",
    scriptureText: "Jesús fue a Galilea proclamando el Evangelio del Reino de Dios.",
    imageAlt: "Ilustración del misterio del Rosario: el Anuncio del Reino de Dios.",
  },
  the_transfiguration: {
    title: "La Transfiguración",
    fruit: "Deseo de santidad",
    description:
      "Jesús revela su gloria para fortalecer a los discípulos en el camino. Pide la gracia de desear la transformación y reflejar la luz de Cristo en la vida cotidiana.",
    scriptureText: "Jesús tomó consigo a Pedro, Santiago y Juan, y los llevó aparte a un monte alto.",
    imageAlt: "Ilustración del misterio del Rosario: la Transfiguración.",
  },
  institution_of_the_eucharist: {
    title: "La Institución de la Eucaristía",
    fruit: "Amor eucarístico",
    description:
      "Jesús entrega su Cuerpo y su Sangre como alimento y permanece con su pueblo en la Eucaristía. Pide la gracia de amar su presencia y convertirte en un don generoso para los demás.",
    scriptureText: "Cuando llegó la hora, Jesús se sentó a la mesa con los doce apóstoles.",
    imageAlt: "Ilustración del misterio del Rosario: la Institución de la Eucaristía.",
  },
  agony_in_the_garden: {
    title: "La Oración de Jesús en el Huerto",
    fruit: "Contrición",
    description:
      "En Getsemaní, Jesús siente una profunda tristeza y se confía a la voluntad del Padre. Pide verdadero dolor por el pecado y la gracia de volver a la misericordia de Dios con un corazón renovado.",
    scriptureText: "Jesús salió y fue, como de costumbre, al monte de los Olivos.",
    imageAlt: "Ilustración del misterio del Rosario: la Oración de Jesús en el Huerto.",
  },
  scourging_at_the_pillar: {
    title: "La Flagelación del Señor",
    fruit: "Pureza",
    description:
      "Jesús inocente soporta las heridas causadas por el pecado humano. Pide pureza de corazón y de cuerpo, y decisiones que honren la dignidad que Dios dio a cada persona.",
    scriptureText: "Pilato tomó entonces a Jesús y mandó azotarlo.",
    imageAlt: "Ilustración del misterio del Rosario: la Flagelación del Señor.",
  },
  crowning_with_thorns: {
    title: "La Coronación de Espinas",
    fruit: "Fortaleza moral",
    description:
      "Jesús soporta burlas y crueldad sin abandonar la verdad ni el amor. Pide valor para permanecer fiel a lo correcto, especialmente ante la presión o el desprecio.",
    scriptureText: "Los soldados del gobernador llevaron a Jesús al pretorio.",
    imageAlt: "Ilustración del misterio del Rosario: la Coronación de Espinas.",
  },
  carrying_of_the_cross: {
    title: "Jesús con la Cruz a Cuestas",
    fruit: "Paciencia",
    description:
      "Jesús carga la cruz paso a paso y acepta la ayuda de Simón. Pide paciencia en la dificultad y humildad tanto para recibir ayuda como para ofrecerla.",
    scriptureText: "Detuvieron a Simón de Cirene y le pusieron la cruz para que la llevara detrás de Jesús.",
    imageAlt: "Ilustración del misterio del Rosario: Jesús con la Cruz a Cuestas.",
  },
  the_crucifixion: {
    title: "La Crucifixión y Muerte de Jesús",
    fruit: "Amor sacrificado",
    description:
      "Jesús entrega su vida, perdona a quienes lo persiguen y confía todo al Padre. Pide un amor que perdone, sirva con generosidad y acepte el costo de buscar el bien de los demás.",
    scriptureText: "Junto a la cruz de Jesús estaba su madre.",
    imageAlt: "Ilustración del misterio del Rosario: la Crucifixión y Muerte de Jesús.",
  },
  the_resurrection: {
    title: "La Resurrección del Señor",
    fruit: "Fe",
    description:
      "Cristo resucitado vence el pecado y la muerte, y confirma cada una de sus promesas. Pide una fe firme en Jesús, especialmente cuando el miedo o la incertidumbre dificultan la esperanza.",
    scriptureText: "Pasado el sábado, María Magdalena y la otra María fueron a visitar el sepulcro.",
    imageAlt: "Ilustración del misterio del Rosario: la Resurrección del Señor.",
  },
  the_ascension: {
    title: "La Ascensión del Señor",
    fruit: "Esperanza",
    description:
      "Jesús vuelve al Padre, prepara un lugar para su pueblo y lo envía en misión. Pide una esperanza en el cielo que dé valor y propósito a tu vida de hoy.",
    scriptureText: "Señor, ¿es ahora cuando vas a restaurar el reino de Israel?",
    imageAlt: "Ilustración del misterio del Rosario: la Ascensión del Señor.",
  },
  descent_of_the_holy_spirit: {
    title: "La Venida del Espíritu Santo",
    fruit: "Amor a Dios",
    description:
      "El Espíritu Santo llena a los discípulos y enciende sus corazones por el Evangelio. Pide un amor más profundo a Dios que transforme cada palabra, decisión y obra de servicio.",
    scriptureText: "Al llegar el día de Pentecostés, todos estaban reunidos en un mismo lugar.",
    imageAlt: "Ilustración del misterio del Rosario: la Venida del Espíritu Santo.",
  },
  the_assumption: {
    title: "La Asunción de María",
    fruit: "Gracia de una buena muerte",
    description:
      "María es llevada en cuerpo y alma a la gloria celestial y participa plenamente de la victoria de su Hijo. Pide la gracia de vivir cerca de Dios y afrontar la muerte confiando en la resurrección prometida.",
    scriptureText: "Pondré enemistad entre ti y la mujer, entre tu descendencia y la suya.",
    imageAlt: "Ilustración del misterio del Rosario: la Asunción de María.",
  },
  the_coronation: {
    title: "La Coronación de María",
    fruit: "Confianza en la intercesión de María",
    description:
      "María es coronada Reina del Cielo y continúa guiando a los hijos de Dios hacia su Hijo. Pide la gracia de confiar cada necesidad a su oración mientras sigues a Cristo con mayor fidelidad.",
    scriptureText: "Apareció una gran señal en el cielo: una mujer coronada de estrellas.",
    imageAlt: "Ilustración del misterio del Rosario: la Coronación de María.",
  },
};

const setTitles = {
  joyful: "Misterios Gozosos",
  luminous: "Misterios Luminosos",
  sorrowful: "Misterios Dolorosos",
  glorious: "Misterios Gloriosos",
} as const;

const dayNames: Record<string, string> = {
  Monday: "Lunes",
  Tuesday: "Martes",
  Wednesday: "Miércoles",
  Thursday: "Jueves",
  Friday: "Viernes",
  Saturday: "Sábado",
  Sunday: "Domingo",
};

/** Builds the Spanish devotional bundle while preserving every stable content and sequence identifier. */
export function createSpanishRosaryContent(): RosaryContent {
  return {
    ...englishRosaryContent,
    language: "es",
    prayer_library: spanishPrayerLibrary,
    mystery_sets: englishRosaryContent.mystery_sets.map((set) => ({
      ...set,
      title: setTitles[set.id],
      traditional_days: set.traditional_days.map((day) => dayNames[day] ?? day),
      mysteries: set.mysteries.map((mystery) => {
        const translation = mysteryTranslations[mystery.id];
        return {
          ...mystery,
          title: translation.title,
          fruit: translation.fruit,
          fruit_description: translation.description,
          scripture_text: translation.scriptureText,
          image_alt: translation.imageAlt,
        };
      }),
      prayer_sequence: set.prayer_sequence.map((step) => {
        const prayer = spanishPrayerLibrary[step.prayer_type as RosaryContentPrayerId];
        const mystery = step.mystery_id ? mysteryTranslations[step.mystery_id] : undefined;
        return {
          ...step,
          title: prayer.title,
          text: prayer.text,
          scripture_text: step.scripture_text ? (mystery?.scriptureText ?? null) : null,
        };
      }),
    })),
  };
}

export const spanishRosaryContent = createSpanishRosaryContent();
