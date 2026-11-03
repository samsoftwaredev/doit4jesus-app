import { fireEvent, render, screen } from "@testing-library/react-native";

import { i18n } from "@/localization";

import { ChurchSearchToolbar, type ChurchSearchToolbarProps } from "./ChurchSearchToolbar";

function createProps(overrides: Partial<ChurchSearchToolbarProps> = {}): ChurchSearchToolbarProps {
  return {
    canShowMap: false,
    errorMessage: null,
    hasSearched: false,
    isSearching: false,
    onChangeText: jest.fn(),
    onSearch: jest.fn(),
    onViewChange: jest.fn(),
    searchTerm: "",
    view: "list",
    ...overrides,
  };
}

describe("ChurchSearchToolbar", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await i18n.changeLanguage("en");
  });

  it("shows only unified U.S. search and its submit action before a successful search", async () => {
    const onChangeText = jest.fn();
    const onSearch = jest.fn();

    await render(<ChurchSearchToolbar {...createProps({ onChangeText, onSearch })} />);

    const toolbar = screen.getByTestId("church-search-toolbar-row");
    expect(toolbar).toHaveStyle({ flexDirection: "row", flexWrap: "nowrap" });
    expect(screen.getByText("USA only")).toBeTruthy();
    expect(screen.getByLabelText("Search by ZIP, church name, or address")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Search churches" })).toHaveStyle({ height: 44, width: 44 });
    expect(screen.queryByRole("button", { name: "Open church filters" })).toBeNull();
    expect(screen.queryAllByRole("tab")).toHaveLength(0);
    expect(screen.queryByRole("button", { name: "Open church filters" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Show church map" })).toBeNull();

    await fireEvent.changeText(screen.getByLabelText("Search by ZIP, church name, or address"), "St. Mary");
    await fireEvent(screen.getByLabelText("Search by ZIP, church name, or address"), "submitEditing");
    await fireEvent.press(screen.getByRole("button", { name: "Search churches" }));

    expect(onChangeText).toHaveBeenCalledWith("St. Mary");
    expect(onSearch).toHaveBeenCalledTimes(2);
  });

  it("uses one icon button to toggle between the church map and list", async () => {
    const onViewChange = jest.fn();
    const { rerender } = await render(
      <ChurchSearchToolbar {...createProps({ canShowMap: true, hasSearched: true, onViewChange, view: "map" })} />,
    );

    expect(screen.queryAllByRole("tab")).toHaveLength(0);
    expect(screen.queryByRole("button", { name: "Open church filters" })).toBeNull();
    expect(screen.getByRole("button", { name: "Show church list" }).props.accessibilityState).toMatchObject({
      disabled: false,
    });
    await fireEvent.press(screen.getByRole("button", { name: "Show church list" }));
    expect(onViewChange).toHaveBeenCalledWith("list");

    await rerender(
      <ChurchSearchToolbar {...createProps({ canShowMap: true, hasSearched: true, onViewChange, view: "list" })} />,
    );
    await fireEvent.press(screen.getByRole("button", { name: "Show church map" }));
    expect(onViewChange).toHaveBeenLastCalledWith("map");
  });

  it("renders errors and Spanish toolbar copy", async () => {
    await i18n.changeLanguage("es");
    await render(
      <ChurchSearchToolbar
        {...createProps({
          canShowMap: true,
          errorMessage: "No pudimos buscar iglesias.",
          hasSearched: true,
        })}
      />,
    );

    expect(screen.getByText("Solo EE. UU.")).toBeTruthy();
    expect(screen.getByLabelText("Buscar por código postal, iglesia o dirección")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Buscar iglesias" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Mostrar mapa de iglesias" })).toBeTruthy();
    expect(screen.getByRole("alert")).toHaveTextContent("No pudimos buscar iglesias.");
  });
});
