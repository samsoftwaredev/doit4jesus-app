import styled from "styled-components";
import { viewSize } from "@/interfaces/rosaryInterface";

interface Props {
  size: viewSize;
}

export const Container = styled.div<Props>`
  display: grid;
  max-height: 80vh;
  height: 700px;
  padding: 5px 15px;

  ${(p) => {
    switch (p.size) {
      case "sm":
        return `
          align-items: center;
          align-content: align-stretch;
          grid-template-rows: 150px 2fr auto;
          grid-template-columns: 50px minmax(auto, 300px);
          
          .rosary-header {
            justify-self: center;
            align-self: center;
            order: 2;
          }

          .rosary-image {
            justify-self: center;
            align-self: start;
            order: 1; 
          }

          .rosary-content {
            align-self: start;
            order: 3;
            grid-column-start: 1;
            grid-column-end: 3;
            height: 100%;
            padding: 20px 0;
            overflow-y: auto;
            position: relative;
          }

          .rosary-content::after {
            position: absolute;
            box-shadow: inset 0 -10px 10px -10px #000000;
          }

          .rosary-controls {
            text-align: center;
            justify-self: center;
            align-self: end;
            order: 4;
            grid-column-start: 1;
            grid-column-end: 3;
          }
        `;
      case "md":
        return `
        align-items: center;

        .rosary-header { 
          text-align: center;
        }

        .rosary-image { 
          grid-row: span 2;
        }

        .rosary-content { 
        }

        .rosary-controls {
          text-align: center;
          justify-self: center;
          align-self: end; 
        }
        `;
      default:
        return "";
    }
  }}
`;
