import { fireEvent, render, screen } from "@testing-library/react-native";

import { ArmorDetailCard } from "./ArmorDetailCard";
import { ArmorHeader } from "./ArmorHeader";
import { ArmorItemCard } from "./ArmorItemCard";
import { ArmorSelector } from "./ArmorSelector";
import { KnightDisplay } from "./KnightDisplay";
import { ScriptureReference } from "./ScriptureReference";
import { StickyActionBar } from "./StickyActionBar";
import { armorItems, getArmorItems } from "./armorOfGod.data";

describe("Armor of God components", () => {
  it("provides localized bundled armor content without changing stable item identifiers", () => {
    const spanishItems = getArmorItems("es");

    expect(spanishItems.map((item) => item.id)).toEqual(armorItems.map((item) => item.id));
    expect(spanishItems[0]).toMatchObject({
      name: "YELMO DE LA SALVACIÓN",
      scriptureReference: "Efesios 6:17",
      shortName: "Yelmo",
    });
  });

  it("renders armor choices and selects the pressed item", async () => {
    const onSelect = jest.fn();
    await render(<ArmorSelector items={armorItems} onSelect={onSelect} selectedId="helmet" />);

    await fireEvent.press(screen.getByRole("button", { name: /3\. BELT OF TRUTH/i }));
    expect(onSelect).toHaveBeenCalledWith("belt");
    expect(screen.getByRole("button", { name: /6\. BOOTS OF PEACE/i })).toBeTruthy();
  });

  it("renders item cards and their interactive details", async () => {
    const onPress = jest.fn();
    const { rerender } = await render(<ArmorItemCard item={armorItems[2]} onPress={onPress} selected />);

    await fireEvent.press(screen.getByRole("button", { name: /3\. BELT OF TRUTH/i }));
    expect(onPress).toHaveBeenCalledTimes(1);

    await rerender(<ArmorItemCard item={armorItems[5]} onPress={onPress} selected={false} />);
    expect(screen.getByText("Locked")).toBeTruthy();
  });

  it("renders action detail, scripture, knight, header, and sticky controls", async () => {
    const onAction = jest.fn();
    const onReadScripture = jest.fn();
    await render(
      <>
        <ArmorHeader />
        <KnightDisplay selectedItem={armorItems[0]} />
        <ArmorDetailCard item={armorItems[2]} onAction={onAction} />
        <ScriptureReference reference="Ephesians 6:14" />
        <StickyActionBar
          actionDisabled={false}
          actionLabel="EQUIP BELT"
          onAction={onAction}
          onReadScripture={onReadScripture}
        />
      </>,
    );

    expect(screen.getByText("ARMOR OF GOD")).toBeTruthy();
    expect(screen.getByLabelText(/Guardian knight/)).toBeTruthy();
    expect(screen.getAllByLabelText("Scripture reference: Ephesians 6:14")).toHaveLength(2);
    await fireEvent.press(screen.getAllByText("EQUIP BELT")[0]);
    await fireEvent.press(screen.getByText("READ EPHESIANS 6"));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onReadScripture).toHaveBeenCalledTimes(1);
  });
});
