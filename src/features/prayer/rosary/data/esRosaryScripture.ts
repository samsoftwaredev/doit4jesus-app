import type { RosaryContent, RosaryContentPrayerStep } from "./rosaryContent";

interface SpanishScriptureTranslation {
  reference: string;
  text: string;
}

const spanishHailMaryTextsByMystery: Record<string, readonly string[]> = {
  the_annunciation: [
    "...el ángel Gabriel fue enviado por Dios a una ciudad de Galilea llamada Nazaret,",
    "a una virgen desposada con un hombre llamado José,...",
    "...la virgen se llamaba María.",
    "Y entrando donde ella estaba, le dijo: “¡Salve, favorecida! El Señor está contigo.”",
    "..., “No temas, María, porque has hallado favor ante Dios.”",
    "“Concebirás en tu seno y darás a luz un hijo, y le pondrás por nombre Jesús.”",
    "Pero María dijo al ángel: “¿Cómo puede ser esto, si no tengo relaciones con ningún hombre?”",
    "...“El Espíritu Santo vendrá sobre ti y el poder del Altísimo te cubrirá con su sombra.”",
    "“Por eso el niño que nacerá será llamado santo, Hijo de Dios.”",
    "María dijo: “He aquí la sierva del Señor. Hágase en mí según tu palabra.”...",
  ],
  the_visitation: [
    "...María partió y viajó apresuradamente a la región montañosa, a una ciudad de Judá,",
    "donde entró en la casa de Zacarías y saludó a Isabel.",
    "Cuando Isabel oyó el saludo de María, el niño saltó en su seno,",
    "...Isabel, llena del Espíritu Santo, exclamó con gran voz...: “Bendita tú entre las mujeres,",
    "y bendito el fruto de tu vientre.",
    "Dichosa tú que creíste que se cumpliría lo que te fue dicho de parte del Señor.”",
    "Y María dijo: “Mi alma proclama la grandeza del Señor; mi espíritu se alegra en Dios, mi salvador.",
    "Porque ha mirado la humildad de su sierva;...",
    "El Poderoso ha hecho grandes cosas por mí, y santo es su nombre.”",
    "María permaneció con ella unos tres meses y luego regresó a su casa.",
  ],
  the_nativity: [
    "En aquellos días salió un decreto de César Augusto ordenando que todo el mundo fuera empadronado.",
    "También José subió desde Galilea, desde la ciudad de Nazaret, a Judea, a la ciudad de David llamada Belén,",
    "para empadronarse con María, su prometida, que estaba encinta.",
    "Mientras estaban allí, le llegó el tiempo de dar a luz,",
    "Y la Palabra se hizo carne y habitó entre nosotros,...",
    "...Ella lo envolvió en pañales y lo acostó en un pesebre, porque no había lugar para ellos en la posada.",
    "Había en aquella región unos pastores... que velaban por la noche cuidando su rebaño.",
    "El ángel les dijo: “No teman;...",
    "Porque hoy les ha nacido en la ciudad de David un salvador, que es el Mesías y Señor.”",
    "diciendo: “¿Dónde está el rey de los judíos que acaba de nacer? Vimos su estrella al salir y hemos venido a rendirle homenaje.”",
  ],
  the_presentation: [
    "...lo llevaron a Jerusalén para presentarlo al Señor,",
    "..., “Todo varón que abra el seno materno será consagrado al Señor,”",
    "Había entonces en Jerusalén un hombre llamado Simeón.",
    "...y el Espíritu Santo estaba sobre él.",
    "El Espíritu Santo le había revelado que no vería la muerte antes de haber visto al Mesías del Señor.",
    "Movido por el Espíritu, fue al templo;...",
    "lo tomó en sus brazos y bendijo a Dios, diciendo:",
    "“Ahora, Señor, puedes dejar que tu siervo se vaya en paz, según tu palabra,",
    "porque mis ojos han visto tu salvación, que preparaste a la vista de todos los pueblos,",
    "luz para revelación a los gentiles y gloria de tu pueblo Israel.”",
  ],
  finding_jesus_in_the_temple: [
    "Cada año sus padres iban a Jerusalén para la fiesta de la Pascua,",
    "y cuando cumplió doce años, subieron según la costumbre de la fiesta.",
    "..., cuando regresaban, el niño Jesús se quedó en Jerusalén,...",
    "Pensando que estaba en la caravana, caminaron un día y lo buscaron,...",
    "pero al no encontrarlo, regresaron a Jerusalén para buscarlo.",
    "Después de tres días lo encontraron en el templo, sentado en medio de los maestros, escuchándolos y haciéndoles preguntas,",
    "y todos los que lo oían quedaban asombrados de su inteligencia y de sus respuestas.",
    "...“Hijo, ¿por qué nos has hecho esto? Tu padre y yo te hemos estado buscando con gran angustia.”",
    "Y él les dijo: “¿Por qué me buscaban?",
    "¿No sabían que debo estar en la casa de mi Padre?”",
  ],
  baptism_of_jesus: [
    "En aquellos días apareció Juan el Bautista, predicando en el desierto de Judea.",
    "La gente... era bautizada por él en el río Jordán mientras reconocía sus pecados.",
    "...“Detrás de mí viene uno más poderoso que yo. No soy digno de inclinarme y desatar las correas de sus sandalias.”",
    "Entonces Jesús fue desde Galilea hasta Juan, en el Jordán, para ser bautizado por él.",
    "...“Este es el Cordero de Dios, que quita el pecado del mundo.",
    "...“Soy yo quien necesita ser bautizado por ti, ¿y tú vienes a mí?”",
    "Jesús le respondió: “Permítelo ahora, porque conviene que así cumplamos toda justicia.”",
    "...“Vi al Espíritu bajar del cielo como una paloma y permanecer sobre él.",
    "...‘Él es quien bautizará con el Espíritu Santo.’”",
    "...“Este es mi Hijo amado, en quien me complazco.”",
  ],
  wedding_at_cana: [
    "Al tercer día hubo una boda en Caná de Galilea, y la madre de Jesús estaba allí.",
    "...la madre de Jesús le dijo: “No tienen vino.”",
    "...“Mujer, ¿qué tiene que ver conmigo tu preocupación? Mi hora aún no ha llegado.”",
    "Su madre dijo a los servidores: “Hagan lo que él les diga.”",
    "Jesús les dijo: “Llenen de agua las tinajas.” Y las llenaron hasta el borde.",
    "Luego les dijo: “Saquen ahora un poco y llévenselo al encargado del banquete.” Y se lo llevaron.",
    "Y cuando el encargado probó el agua convertida en vino, sin saber de dónde venía,...",
    "...el encargado llamó al novio y le dijo: “Todos sirven primero el vino bueno",
    "Pero tú has guardado el vino bueno hasta ahora.”",
    "Jesús hizo esto como el comienzo de sus signos en Caná de Galilea y así reveló su gloria,",
  ],
  proclamation_of_the_kingdom: [
    "Después de que Juan fue arrestado, Jesús fue a Galilea proclamando el evangelio de Dios:",
    "“Este es el tiempo del cumplimiento. El reino de Dios está cerca.",
    "Conviértanse y crean en el evangelio.”",
    "“Busquen primero el reino [de Dios] y su justicia,...”",
    "“Dichosos los perseguidos por causa de la justicia, porque de ellos es el reino de los cielos.”",
    "...“El reino de los cielos es semejante a la levadura que una mujer mezcló con tres medidas de harina hasta que toda la masa fermentó.”",
    "“El reino de los cielos es semejante a un tesoro escondido en un campo, que una persona encuentra...",
    "...y llena de alegría va, vende todo lo que tiene y compra aquel campo.”",
    "“...si no cambian y se hacen como niños, no entrarán en el reino de los cielos.”",
    "Jesús respondió: “Mi reino no pertenece a este mundo.”...",
  ],
  the_transfiguration: [
    "...tomó a Pedro, Juan y Santiago y subió a la montaña para orar.",
    "Mientras oraba, el aspecto de su rostro cambió y su ropa se volvió de una blancura resplandeciente.",
    "...Y se transfiguró delante de ellos;",
    "Y de pronto, dos hombres conversaban con él: Moisés y Elías,",
    "Entonces Pedro dijo a Jesús: “Rabí, ¡qué bueno es que estemos aquí! Hagamos tres tiendas:”...",
    "Mientras todavía hablaba, una nube luminosa los cubrió con su sombra,",
    "“Este es mi Hijo amado. Escúchenlo.”",
    "Al oír esto, los discípulos cayeron rostro en tierra y tuvieron mucho miedo.",
    "Pero Jesús se acercó, los tocó y dijo: “Levántense y no tengan miedo.”",
    "Y cuando los discípulos alzaron los ojos, no vieron a nadie más que a Jesús solo.",
  ],
  institution_of_the_eucharist: [
    "Cuando llegó la hora, ocupó su lugar a la mesa con los apóstoles.",
    "Les dijo: “He deseado ardientemente comer esta Pascua con ustedes antes de padecer,",
    "porque les digo que no volveré a comerla hasta que se cumpla en el reino de Dios.”",
    "Mientras comían, tomó pan, pronunció la bendición, lo partió y se lo dio,...",
    "...“Este es mi cuerpo, que será entregado por ustedes; hagan esto en memoria mía.”",
    "Luego tomó una copa, dio gracias y se la dio, diciendo: “Beban de ella todos ustedes,",
    "porque esta es mi sangre de la alianza,",
    "que será derramada por muchos para el perdón de los pecados.”",
    "“El que come mi carne y bebe mi sangre permanece en mí y yo en él.”",
    "Después de cantar un himno, salieron hacia el monte de los Olivos.",
  ],
  agony_in_the_garden: [
    "...Jesús salió con sus discípulos y cruzó el valle del Cedrón hasta donde había un huerto...",
    "Cuando llegó al lugar, les dijo: “Oren para no caer en la prueba.”",
    "...“Mi alma está triste hasta la muerte. Quédense aquí y velen.”",
    "Avanzó un poco y cayó rostro en tierra para orar,...",
    "dijo: “Abbá, Padre, todo es posible para ti.",
    "Aparta de mí esta copa, pero no se haga lo que yo quiero, sino lo que tú quieres.”",
    "...oró con tanta intensidad que su sudor se volvió como gotas de sangre.",
    "...Dijo a Pedro: “¿Así que no pudieron velar conmigo ni una hora?",
    "...El espíritu está dispuesto, pero la carne es débil.”",
    "“Levántense, vámonos. Miren, el que me entrega está cerca.”",
  ],
  scourging_at_the_pillar: [
    "Los sumos sacerdotes y todo el Sanedrín seguían buscando un testimonio falso contra Jesús...",
    "...“¿Eres tú el Mesías, el Hijo del Bendito?”",
    "Entonces Jesús respondió: “Yo soy;...”",
    "...Todos lo condenaron como merecedor de muerte.",
    "Pilato volvió a dirigirse a ellos, pues todavía deseaba soltar a Jesús,",
    "...“¿Qué mal ha hecho este hombre? No he encontrado en él ningún delito que merezca la muerte.",
    "Por eso mandaré que lo azoten y después lo soltaré.”",
    "Entonces Pilato tomó a Jesús y mandó azotarlo.",
    "Sin embargo, ellos insistían a grandes gritos pidiendo que fuera crucificado, y sus voces prevalecieron.",
    "...“¡Que su sangre caiga sobre nosotros y sobre nuestros hijos!”",
  ],
  crowning_with_thorns: [
    "Los soldados lo llevaron dentro del palacio, es decir, al pretorio,...",
    "...y reunieron a toda la cohorte a su alrededor.",
    "Lo vistieron de púrpura...",
    "Y los soldados tejieron una corona de espinas y se la pusieron en la cabeza,...",
    "...se burlaban de él, diciendo: “¡Salve, rey de los judíos!”",
    "Lo escupían, tomaban la caña y le golpeaban la cabeza una y otra vez.",
    "...Se arrodillaban ante él para rendirle homenaje.",
    "Entonces Jesús salió llevando la corona de espinas y el manto de púrpura. Y les dijo: “¡Aquí tienen al hombre!”",
    "Y después de burlarse de él, le quitaron el manto de púrpura,",
    "lo vistieron con su propia ropa y lo llevaron para crucificarlo.",
  ],
  carrying_of_the_cross: [
    "...entregó a Jesús a la voluntad de ellos.",
    "y, cargando él mismo la cruz, salió hacia el lugar llamado de la Calavera...",
    "Mientras se lo llevaban, detuvieron a un tal Simón de Cirene, que venía del campo;",
    "después de cargarle la cruz, le hicieron llevarla detrás de Jesús.",
    "Una gran multitud del pueblo seguía a Jesús, incluidas muchas mujeres que se lamentaban y lloraban por él.",
    "Jesús se volvió hacia ellas y dijo: “Hijas de Jerusalén, no lloren por mí;",
    "lloren más bien por ustedes mismas y por sus hijos,",
    "porque vienen días en que la gente dirá: ‘Dichosas las estériles,...",
    "porque si esto hacen cuando la madera está verde, ¿qué ocurrirá cuando esté seca?”",
    "Lo llevaron al lugar del Gólgota (que traducido significa Lugar de la Calavera).",
  ],
  the_crucifixion: [
    "...lo crucificaron allí junto con los criminales, uno a su derecha y otro a su izquierda.",
    "La inscripción con el cargo contra él decía: “El rey de los judíos.”",
    "[Entonces Jesús dijo: “Padre, perdónalos, porque no saben lo que hacen.”]",
    "Se repartieron sus vestiduras echándolas a suertes.",
    "Entonces dijo: “Jesús, acuérdate de mí cuando vengas en tu reino.”",
    "Él le respondió: “En verdad te digo: hoy estarás conmigo en el Paraíso.”",
    "Los que pasaban lo insultaban,... “sálvate a ti mismo bajando de la cruz.”",
    "...para que se cumpliera la Escritura, Jesús dijo: “Tengo sed.”",
    "...“Padre, en tus manos encomiendo mi espíritu”; y dicho esto, exhaló el último aliento.",
    "pero un soldado le atravesó el costado con una lanza, y al instante salió sangre y agua.",
  ],
  the_resurrection: [
    "Pero al amanecer del primer día de la semana llevaron los aromas que habían preparado y fueron al sepulcro.",
    "Se decían unas a otras: “¿Quién nos quitará la piedra...?”",
    "...un ángel del Señor... se acercó, hizo rodar la piedra y se sentó sobre ella.",
    "Los guardias temblaron de miedo ante él y quedaron como muertos.",
    "pero al entrar no encontraron el cuerpo del Señor Jesús.",
    "Entonces el ángel dijo...: “¡No teman! Sé que buscan a Jesús, el crucificado.",
    "No está aquí, porque ha resucitado tal como dijo....",
    "...‘Él va delante de ustedes a Galilea; allí lo verán, como les dijo.’”",
    "Entonces se alejaron..., temerosas pero llenas de alegría, y corrieron a anunciarlo a sus discípulos.",
    "Y de pronto Jesús les salió al encuentro y las saludó. Ellas se acercaron, abrazaron sus pies y le rindieron homenaje.",
  ],
  the_ascension: [
    "“Salí del Padre y vine al mundo.”",
    "“Ahora dejo el mundo y vuelvo al Padre.”",
    "...“‘Subo a mi Padre y Padre de ustedes, a mi Dios y Dios de ustedes.’”",
    "“No se turbe su corazón.... En la casa de mi Padre hay muchas moradas.”...",
    "Mientras los bendecía, se separó de ellos y fue llevado al cielo.",
    "Así pues, el Señor Jesús... se sentó a la derecha de Dios.",
    "...de pronto, dos hombres vestidos de blanco se pusieron junto a ellos.",
    "Ellos dijeron: “Hombres de Galilea, ¿por qué están ahí mirando al cielo?",
    "Este Jesús... volverá de la misma manera en que lo han visto irse al cielo.”",
    "Ellos le rindieron homenaje y luego regresaron a Jerusalén con gran alegría, y permanecían continuamente en el templo alabando a Dios.",
  ],
  descent_of_the_holy_spirit: [
    "“Y [miren], voy a enviar sobre ustedes la promesa de mi Padre;...”",
    "“el Espíritu de la verdad, a quien el mundo no puede recibir, porque no lo ve ni lo conoce.",
    "Ustedes lo conocen, porque permanece con ustedes y estará en ustedes.”",
    "Cuando se cumplió el tiempo de Pentecostés, estaban todos reunidos en un mismo lugar.",
    "De repente vino del cielo un ruido como el de un viento fuerte que soplaba, y llenó toda la casa donde estaban.",
    "Entonces se les aparecieron lenguas como de fuego, que se dividieron y se posaron sobre cada uno de ellos.",
    "Y todos quedaron llenos del Espíritu Santo y comenzaron a hablar en diferentes lenguas,...",
    "...“¿No son galileos todos estos que están hablando?",
    "...y sin embargo los oímos hablar en nuestras propias lenguas de las maravillas de Dios.”",
    "Todos estaban asombrados y desconcertados, y se decían unos a otros: “¿Qué significa esto?”",
  ],
  the_assumption: [
    "Cada uno de ustedes respete a su madre y a su padre, y guarde mis sábados. Yo, el SEÑOR, soy su Dios.",
    "“Porque así como el Padre resucita a los muertos y les da vida, así también el Hijo da vida a quien él quiere.”",
    "“Yo les doy vida eterna, y nunca perecerán....”",
    "...“Levántate, amiga mía, hermosa mía, ¡y ven!”",
    "...“La muerte ha sido devorada por la victoria.”",
    "“Padre, ellos son tu regalo para mí. Deseo que donde yo esté también ellos estén conmigo,”...",
    "...el que resucitó a Cristo de entre los muertos dará vida también a sus cuerpos mortales por medio de su Espíritu que habita en ustedes.",
    "...“volveré y los llevaré conmigo, para que donde yo esté también estén ustedes.”",
    "...“desde ahora todas las generaciones me llamarán bienaventurada.”",
    "Entonces se abrió el templo de Dios en el cielo, y el arca de su alianza pudo verse en el templo....",
  ],
  the_coronation: [
    "Apareció en el cielo una gran señal: una mujer vestida del sol, con la luna bajo sus pies y una corona de doce estrellas sobre su cabeza.",
    "Por eso recibirán la corona espléndida, la hermosa diadema, de la mano del SEÑOR,...",
    "si perseveramos, también reinaremos con él....",
    "...y se dispuso un trono para la madre del rey, que se sentó a su derecha.",
    "...El rey le dijo: “Pídemelo, madre mía, porque no te lo negaré.”",
    "...una princesa adornada con oro de Ofir viene a colocarse a tu derecha.",
    "“Muchas son las mujeres de probado valor, pero tú las superas a todas.”",
    "Pero los sienta en tronos junto a reyes, exaltados para siempre.",
    "Y cuando se manifieste el Pastor supremo, recibirán la corona imperecedera de gloria.",
    "...y me envolvió en un manto de justicia, como un novio adornado con una diadema, como una novia que se adorna con sus joyas.",
  ],
};

const spanishRetainedScriptureTextByStepId: Record<string, string> = {
  joyful_bead_07: "El ángel Gabriel fue enviado por Dios a una ciudad de Galilea llamada Nazaret.",
  joyful_bead_18: "Porque para Dios nada será imposible.",
  joyful_bead_19: "He aquí la sierva del Señor; hágase en mí según tu palabra.",
  joyful_bead_20: "En aquellos días, María se levantó y fue de prisa a la región montañosa.",
  joyful_bead_31: "Su misericordia alcanza a quienes le temen de generación en generación.",
  joyful_bead_32: "Ha mostrado la fuerza de su brazo.",
  joyful_bead_33: "Salió un decreto de César Augusto para que todo el mundo fuera empadronado.",
  joyful_bead_44: "Encontrarán al niño envuelto en pañales y acostado en un pesebre.",
  joyful_bead_45: "De repente apareció junto al ángel una multitud del ejército celestial que alababa a Dios.",
  joyful_bead_46: "Lo llevaron a Jerusalén para presentarlo al Señor.",
  joyful_bead_57: "José y su madre se maravillaban de lo que se decía de él.",
  joyful_bead_58: "Este niño está destinado para caída y resurgimiento de muchos en Israel.",
  joyful_bead_59: "El niño crecía y se fortalecía en espíritu, lleno de sabiduría.",
  joyful_bead_70: "Su madre guardaba todas estas cosas en su corazón.",
  joyful_bead_71: "Jesús crecía en sabiduría, estatura y favor ante Dios y los hombres.",
  luminous_bead_07: "Entonces Jesús llegó desde Galilea al Jordán, donde estaba Juan, para ser bautizado por él.",
  luminous_bead_18: "Vi al Espíritu descender del cielo como una paloma y permanecer sobre él.",
  luminous_bead_19: "Este es el Hijo de Dios.",
  luminous_bead_20: "Hubo una boda en Caná de Galilea, y la madre de Jesús estaba allí.",
  luminous_bead_31: "Después de esto bajó a Cafarnaúm con su madre, sus hermanos y sus discípulos.",
  luminous_bead_32: "El SEÑOR de los ejércitos preparará para todos los pueblos un banquete de manjares y de vinos.",
  luminous_bead_33: "Jesús fue a Galilea proclamando el evangelio del reino de Dios.",
  luminous_bead_44: "Dichosos los que trabajan por la paz, porque serán llamados hijos de Dios.",
  luminous_bead_45: "Dichosos los perseguidos por causa de la justicia, porque de ellos es el reino de los cielos.",
  luminous_bead_46: "Jesús tomó a Pedro, Santiago y Juan, su hermano, y los llevó aparte a una montaña alta.",
  luminous_bead_57: "Maestro, qué bueno es que estemos aquí.",
  luminous_bead_58: "No sabía qué decir, porque estaban aterrados.",
  luminous_bead_59: "Cuando llegó la hora, se sentó a la mesa con los doce apóstoles.",
  luminous_bead_70: "Yo soy el pan vivo que bajó del cielo.",
  luminous_bead_71: "Si no comen la carne del Hijo del hombre y no beben su sangre, no tienen vida en ustedes.",
  sorrowful_bead_07: "Salió y fue, como de costumbre, al monte de los Olivos.",
  sorrowful_bead_18:
    "Padre mío, si es posible, que pase de mí esta copa; pero no se haga como yo quiero, sino como tú quieres.",
  sorrowful_bead_19: "¿No pudieron velar conmigo ni una hora?",
  sorrowful_bead_20: "Entonces Pilato tomó a Jesús y mandó azotarlo.",
  sorrowful_bead_31: "Él mismo llevó nuestros pecados en su cuerpo sobre el madero.",
  sorrowful_bead_32: "Entregó a Jesús a la voluntad de ellos.",
  sorrowful_bead_33: "Los soldados del gobernador llevaron a Jesús al pretorio.",
  sorrowful_bead_44: "¡Salve, rey de los judíos! Y le daban bofetadas.",
  sorrowful_bead_45: "Todos los que me ven se burlan de mí: hacen muecas y menean la cabeza.",
  sorrowful_bead_46:
    "Detuvieron a un tal Simón de Cirene... y le cargaron la cruz para que la llevara detrás de Jesús.",
  sorrowful_bead_57: "Si alguno quiere venir detrás de mí, que se niegue a sí mismo, tome su cruz cada día y me siga.",
  sorrowful_bead_58: "También Jesús, para santificar al pueblo con su propia sangre, padeció fuera de la puerta.",
  sorrowful_bead_59: "Junto a la cruz de Jesús estaba su madre.",
  sorrowful_bead_70: "Hoy estarás conmigo en el paraíso.",
  sorrowful_bead_71: "Padre, en tus manos encomiendo mi espíritu.",
  glorious_bead_07: "Al terminar el sábado... María Magdalena y la otra María fueron a ver el sepulcro.",
  glorious_bead_18: "Muy de madrugada, el primer día de la semana, fueron al sepulcro.",
  glorious_bead_19: "¿Quién nos hará rodar la piedra de la entrada del sepulcro?",
  glorious_bead_20: "Señor, ¿es ahora cuando vas a restaurar el reino de Israel?",
  glorious_bead_31: "Ellos salieron y predicaron por todas partes, mientras el Señor actuaba con ellos.",
  glorious_bead_32: "El que descendió es el mismo que también ascendió por encima de todos los cielos.",
  glorious_bead_33: "Cuando se cumplió el día de Pentecostés, estaban todos reunidos en un mismo lugar.",
  glorious_bead_44: "Todos estaban asombrados y perplejos, y se preguntaban unos a otros: ¿Qué significa esto?",
  glorious_bead_45: "Otros se burlaban y decían: Estos hombres están llenos de vino nuevo.",
  glorious_bead_46: "Pondré enemistad entre ti y la mujer, entre tu descendencia y la suya.",
  glorious_bead_57: "Apareció una gran señal en el cielo: una mujer vestida del sol.",
  glorious_bead_58: "Su hijo fue arrebatado hasta Dios y hasta su trono.",
  glorious_bead_59: "A la mujer se le dieron las dos alas de una gran águila para que volara al desierto.",
  glorious_bead_70:
    "Los veinticuatro ancianos se postran ante el que está sentado en el trono... y arrojan sus coronas delante del trono.",
  glorious_bead_71: "La bendición, el honor, la gloria y el poder sean para el que está sentado en el trono.",
};

const spanishBookNames: readonly (readonly [string, string])[] = [
  ["Song of Songs", "Cantar de los Cantares"],
  ["Revelation", "Apocalipsis"],
  ["Leviticus", "Levítico"],
  ["Matthew", "Mateo"],
  ["Proverbs", "Proverbios"],
  ["Ephesians", "Efesios"],
  ["Hebrews", "Hebreos"],
  ["Genesis", "Génesis"],
  ["Romans", "Romanos"],
  ["Wisdom", "Sabiduría"],
  ["Isaiah", "Isaías"],
  ["1 Peter", "1 Pedro"],
  ["2 Timothy", "2 Timoteo"],
  ["1 Kings", "1 Reyes"],
  ["1 Cor", "1 Corintios"],
  ["Psalm", "Salmo"],
  ["Acts", "Hechos"],
  ["Luke", "Lucas"],
  ["Mark", "Marcos"],
  ["John", "Juan"],
  ["Job", "Job"],
  ["Rev", "Apocalipsis"],
];

/** Localizes the Bible book in an English Scripture reference without altering its chapter and verse notation. */
export function localizeSpanishScriptureReference(reference: string): string {
  const match = spanishBookNames.find(([englishName]) => reference.startsWith(`${englishName} `));
  return match ? reference.replace(match[0], match[1]) : reference;
}

/** Builds a complete Spanish Scripture lookup keyed by stable prayer-step ID. */
export function buildSpanishScriptureByStepId(
  content: RosaryContent,
): ReadonlyMap<string, SpanishScriptureTranslation> {
  const translations = new Map<string, SpanishScriptureTranslation>();

  for (const set of content.mystery_sets) {
    for (const mystery of set.mysteries) {
      const hailMaryTexts = spanishHailMaryTextsByMystery[mystery.id];
      const hailMarySteps = set.prayer_sequence.filter(
        (step) => step.mystery_id === mystery.id && step.prayer_type === "hail_mary",
      );

      if (!hailMaryTexts || hailMaryTexts.length !== hailMarySteps.length) {
        throw new Error(`Spanish Hail Mary Scripture is incomplete for ${mystery.id}.`);
      }

      hailMarySteps.forEach((step, index) => {
        translations.set(step.id, createTranslation(step, hailMaryTexts[index]));
      });

      for (const step of set.prayer_sequence.filter(
        (candidate) =>
          candidate.mystery_id === mystery.id && candidate.prayer_type !== "hail_mary" && candidate.scripture_text,
      )) {
        const text = spanishRetainedScriptureTextByStepId[step.id];
        if (!text) {
          throw new Error(`Spanish retained Scripture is missing for ${step.id}.`);
        }
        translations.set(step.id, createTranslation(step, text));
      }
    }
  }

  return translations;
}

function createTranslation(step: RosaryContentPrayerStep, text: string): SpanishScriptureTranslation {
  if (!step.scripture_reference) {
    throw new Error(`Scripture reference is missing for ${step.id}.`);
  }
  return {
    reference: localizeSpanishScriptureReference(step.scripture_reference),
    text,
  };
}

/** Returns the translated representative excerpt for a mystery. */
export function getSpanishMysteryScriptureText(mysteryId: string): string {
  const text = spanishHailMaryTextsByMystery[mysteryId]?.[0];
  if (!text) {
    throw new Error(`Spanish mystery Scripture is missing for ${mysteryId}.`);
  }
  return text;
}
