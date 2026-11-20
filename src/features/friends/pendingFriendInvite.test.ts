import {
  clearPendingFriendInvite,
  isFriendInviteCode,
  readPendingFriendInvite,
  savePendingFriendInvite,
} from "./pendingFriendInvite";

const mockStore = new Map<string, string>();

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async (key: string) => mockStore.get(key) ?? null),
    removeItem: jest.fn(async (key: string) => void mockStore.delete(key)),
    setItem: jest.fn(async (key: string, value: string) => void mockStore.set(key, value)),
  },
}));

describe("pending friend invite storage", () => {
  beforeEach(() => {
    mockStore.clear();
  });

  it("validates invite codes", () => {
    expect(isFriendInviteCode("abcdefghijkl")).toBe(true);
    expect(isFriendInviteCode("short")).toBe(false);
    expect(isFriendInviteCode("has spaces in it!")).toBe(false);
    expect(isFriendInviteCode(undefined)).toBe(false);
  });

  it("remembers, reads, and clears a code", async () => {
    await savePendingFriendInvite("abcdefghijkl");
    await expect(readPendingFriendInvite()).resolves.toBe("abcdefghijkl");

    await clearPendingFriendInvite();
    await expect(readPendingFriendInvite()).resolves.toBeNull();
  });

  it("ignores malformed codes", async () => {
    await savePendingFriendInvite("nope");
    await expect(readPendingFriendInvite()).resolves.toBeNull();
  });
});
