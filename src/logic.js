// Pure, testable logic extracted from index.html.
// No DOM, no network — safe to import from Node for unit tests.

export function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[ch]);
}

export function normalizeMember(member) {
  const profile = member.profile ?? member.directory ?? {};
  const contact = profile.contact ?? member.contact ?? {};
  return {
    ...member,
    uid: member.uid ?? member.id,
    name: member.name ?? "Unnamed member",
    status: (profile.status ?? member.status ?? "active").toLowerCase(),
    orgRole: profile.orgRole ?? profile.org_role ?? profile.title ?? member.orgRole ?? member.org_role ?? member.title ?? member.role ?? "",
    cohort: profile.cohort ?? profile.pledgeClass ?? member.cohort ?? member.pledgeClass ?? "",
    bio: profile.bio ?? member.bio ?? "",
    photoUrl: profile.photoUrl ?? profile.photo_url ?? profile.avatarUrl ?? member.photoUrl ?? member.photo_url ?? member.avatarUrl ?? "",
    email: contact.email ?? profile.email ?? member.email ?? "",
    phone: contact.phone ?? profile.phone ?? member.phone ?? "",
    kind: profile.kind ?? member.kind ?? "member",
  };
}

export function isLeader(member) {
  const role = String(member?.role ?? "").toLowerCase();
  const orgRole = String(member?.orgRole ?? "").toLowerCase();
  return !!(member?.isAdmin || member?.admin || role === "admin" || role === "leadership" || orgRole.includes("president") || orgRole.includes("chair"));
}

// Merge hub members + directory-only people + profiles into a sorted member list.
export function composeDirectory(hubMembers, people, profiles) {
  const profileByMemberId = new Map(profiles.map((profile) => [profile.linked_member_id, profile]));
  const hubRows = hubMembers.map((member) => {
    const profile = profileByMemberId.get(member.id) ?? {};
    return normalizeMember({
      ...member,
      ...profile,
      id: member.id,
      uid: `hub:${member.id}`,
      source: "hub",
      linkedMemberId: member.id,
      name: member.name,
      role: member.role,
      isAdmin: member.isAdmin,
    });
  });
  const appRows = people.map((person) => normalizeMember({
    ...person,
    uid: `person:${person.id}`,
    source: "person",
    personId: person.id,
  }));
  return [...hubRows, ...appRows].sort((a, b) => a.name.localeCompare(b.name));
}

export function filterMembers(members, { query = "", status = "all", cohort = "all" } = {}) {
  const q = query.trim().toLowerCase();
  return members.filter((member) => {
    const statusOk = status === "all" || member.status === status;
    const cohortOk = cohort === "all" || member.cohort === cohort;
    const haystack = [member.name, member.orgRole, member.role, member.cohort, member.status, member.bio, member.email, member.phone].join(" ").toLowerCase();
    return statusOk && cohortOk && (!q || haystack.includes(q));
  });
}

export function initialsFor(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
}

export function labelForStatus(status) {
  if (status === "alumni") return "Alumni";
  if (status === "inactive") return "Inactive";
  return "Active";
}

export function labelForKind(kind) {
  return ({
    alumni: "Alumni",
    advisor: "Advisor",
    partner: "Partner",
    guest: "Guest",
    other: "Directory person",
    member: "Hub member",
  })[kind] ?? "Directory person";
}
