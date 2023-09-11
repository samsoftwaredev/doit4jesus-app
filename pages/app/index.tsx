import { MainLayout } from "@/layouts/index";
import { Container } from "@mui/material";
import type { NextPage } from "next";

const App: NextPage = () => {
  return (
    <MainLayout>
      <Container maxWidth="sm">
        <h4 color="primary">Vision Of The Two Columns</h4>
        <p color="primary">
          “In the midst of this endless sea, two solid columns, a short distance
          apart, soar high into the sky. One is surmounted by a statue of the
          Immaculate Virgin, at whose feet a large inscription reads:” ‘Auxilium
          Christianorum’ (‘Help of Christians’). The other, far loftier and
          sturdier, supports a Host of proportionate size, and bears beneath it
          the inscription: ‘Salus credentium’ (‘Salvation of believers’).
        </p>
        <p color="primary">- St. John Bosco</p>
      </Container>
    </MainLayout>
  );
};

export default App;
