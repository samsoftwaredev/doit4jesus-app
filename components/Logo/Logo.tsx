import Image from "next/image";
import blackCompanyLogo from "@/public/assets/svgs/blackCompanyLogo.svg";
import whiteCompanyLogo from "@/public/assets/svgs/whiteCompanyLogo.svg";

interface Props {
  type?: "black" | "white";
}

const Logo = ({ type = "black" }: Props) => {
  if (type === "black") {
    return <Image src={blackCompanyLogo} alt={"Black Company Logo"} />;
  }
  return <Image src={whiteCompanyLogo} alt={"Black Company Logo"} />;
};

export default Logo;
