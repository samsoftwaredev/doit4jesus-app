import Link from "next/link";
import styles from "./tovNavbar.module.scss";
import { useId } from "react";

const tovSessions = [
  {
    label: "Reunion de apertura",
    meditation: "Lectura rezada",
  },
  {
    label: "Si Conocieran al Padre",
    meditation: "Oracion escrita",
  },
  {
    label: "Peregrinos de la fe",
    meditation: "Oracion auditiva",
  },
  {
    label: "Por el abandono a la paz",
    meditation: "oracion de abandono ",
  },
  {
    label: "Perdon Amor",
    meditation: "Holocausto",
  },
  {
    label: "Recapitulacion",
    meditation: "Intercomunicacion y Conviviencia",
  },
  {
    label: "Encuentro",
    meditation: "Oracion de contemplacion",
  },
  {
    label: "Principio, centro, meta",
    meditation: "Oracion de acogida",
  },
  {
    label: "Libres para amar",
    meditation: "En el espiritu de Jesus",
  },
  {
    label: "Deporte de amar",
    meditation: "Pobres y humildes",
  },
  {
    label: "Pobres y humildes",
    meditation: "Orar con los Salmos",
  },
  {
    label: "Y dejando las redes",
    meditation: "Oracion comunitaria y Meditacion comunitaria",
  },
  {
    label: "Desierto",
    meditation: "Orar con la naturaleza",
  },
];

const TovNavbar = () => {
  return (
    <nav className={styles.container}>
      <div className={styles.logo}>
        <Link href="/tov" className={styles.link}>
          TOV
        </Link>
      </div>
      <div className={styles.linkContainer}>
        <ul className={styles.item}>
          {tovSessions.map((session) => (
            <li key={useId()} className={styles.itemLink}>
              <Link href={session.label.toLowerCase().replace(" ", "-")}>
                {session.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default TovNavbar;
