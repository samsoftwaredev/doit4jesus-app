export const isClientSideRender = () => typeof window !== "undefined";

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const css = (...args: string[]) => [...args].join(" ");

export const generateRandomStringId = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const dollarFormatter = (amount: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return formatter.format(amount);
};

export const numberToDollar = (dollar: number) => {
  const dollarArrStr = dollar.toString().split("");
  dollarArrStr.splice(dollarArrStr.length - 2, 0, ".");
  const dollarNumber = dollarArrStr.join("");
  return +dollarNumber;
};
