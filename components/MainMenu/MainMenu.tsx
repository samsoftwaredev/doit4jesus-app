import { MainContent } from "@/components/index";
import { Typography } from "@mui/material";
import styles from "./mainMenu.module.scss";

const MainMenu = () => {
  return (
    <MainContent>
      <div className={styles.container}>
        <div className={styles.tabletContainer}>
          <ul>
            <li>Rosary</li>
            <li>Confession</li>
          </ul>
        </div>
        <Typography className={styles.title} variant="h4" color="primary">
          Vision Of The Two Columns
        </Typography>
        <Typography className={styles.description} color="primary">
          “In the midst of this endless sea, two solid columns, a short distance
          apart, soar high into the sky. One is surmounted by a statue of the
          Immaculate Virgin, at whose feet a large inscription reads:” ‘Auxilium
          Christianorum’ (‘Help of Christians’). The other, far loftier and
          sturdier, supports a Host of proportionate size, and bears beneath it
          the inscription: ‘Salus credentium’ (‘Salvation of believers’).
        </Typography>
        <Typography className={styles.author} color="primary">
          - St. John Bosco
        </Typography>
      </div>
    </MainContent>
  );
};

export default MainMenu;
