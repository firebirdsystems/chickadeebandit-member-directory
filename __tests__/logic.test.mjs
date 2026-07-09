import { describe, it, expect } from "vitest";
import {
  esc, normalizeMember, isLeader, composeDirectory, filterMembers,
  initialsFor, labelForStatus, labelForKind,
} from "../src/logic.js";

describe("esc", () => {
  it("escapes HTML metacharacters", () => {
    expect(esc(`<b>"x"&'`)).toBe("&lt;b&gt;&quot;x&quot;&amp;&#39;");
  });
});

describe("normalizeMember", () => {
  it("fills defaults for a bare member", () => {
    const m = normalizeMember({ id: "1" });
    expect(m.uid).toBe("1");
    expect(m.name).toBe("Unnamed member");
    expect(m.status).toBe("active");
    expect(m.kind).toBe("member");
  });
  it("prefers profile fields and lowercases status", () => {
    const m = normalizeMember({ id: "1", name: "Al", status: "ALUMNI", profile: { orgRole: "President", contact: { email: "a@b.c" } } });
    expect(m.status).toBe("alumni");
    expect(m.orgRole).toBe("President");
    expect(m.email).toBe("a@b.c");
  });
});

describe("isLeader", () => {
  it("detects admins and leadership roles", () => {
    expect(isLeader({ isAdmin: true })).toBe(true);
    expect(isLeader({ role: "admin" })).toBe(true);
    expect(isLeader({ orgRole: "Vice President" })).toBe(true);
    expect(isLeader({ orgRole: "Social Chair" })).toBe(true);
  });
  it("is false for ordinary members", () => {
    expect(isLeader({ role: "member", orgRole: "Treasurer" })).toBe(false);
    expect(isLeader(null)).toBe(false);
  });
});

describe("composeDirectory", () => {
  it("merges hub members and people, sorted by name", () => {
    const hub = [{ id: "h1", name: "Zoe", role: "member" }];
    const people = [{ id: "p1", name: "Ada" }];
    const profiles = [{ linked_member_id: "h1", status: "alumni" }];
    const out = composeDirectory(hub, people, profiles);
    expect(out.map(m => m.name)).toEqual(["Ada", "Zoe"]);
    expect(out.find(m => m.uid === "hub:h1").status).toBe("alumni");
    expect(out.find(m => m.uid === "person:p1").source).toBe("person");
  });
});

describe("filterMembers", () => {
  const members = [
    { name: "Ada Lovelace", orgRole: "President", role: "admin", cohort: "2020", status: "active", bio: "", email: "ada@x.io", phone: "" },
    { name: "Bob Stone", orgRole: "", role: "member", cohort: "2021", status: "alumni", bio: "guitarist", email: "", phone: "" },
  ];
  it("returns all with default filters", () => {
    expect(filterMembers(members)).toHaveLength(2);
  });
  it("filters by status and cohort", () => {
    expect(filterMembers(members, { status: "alumni" }).map(m => m.name)).toEqual(["Bob Stone"]);
    expect(filterMembers(members, { cohort: "2020" }).map(m => m.name)).toEqual(["Ada Lovelace"]);
  });
  it("searches across the haystack", () => {
    expect(filterMembers(members, { query: "guitar" }).map(m => m.name)).toEqual(["Bob Stone"]);
    expect(filterMembers(members, { query: "ada@x" }).map(m => m.name)).toEqual(["Ada Lovelace"]);
  });
});

describe("initialsFor", () => {
  it("takes up to two initials", () => expect(initialsFor("Ada Lovelace King")).toBe("AL"));
  it("handles blank names", () => expect(initialsFor("   ")).toBe("?"));
});

describe("labels", () => {
  it("labelForStatus", () => {
    expect(labelForStatus("alumni")).toBe("Alumni");
    expect(labelForStatus("inactive")).toBe("Inactive");
    expect(labelForStatus("active")).toBe("Active");
    expect(labelForStatus("whatever")).toBe("Active");
  });
  it("labelForKind", () => {
    expect(labelForKind("advisor")).toBe("Advisor");
    expect(labelForKind("member")).toBe("Hub member");
    expect(labelForKind("unknown")).toBe("Directory person");
  });
});
