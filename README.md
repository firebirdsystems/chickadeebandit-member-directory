# Member Directory

A Chickadee Bandit organization roster app for browsing member profiles.

The app reads the hub-native `family.members` directory and presents it as an internal org roster with fields for photos, bios, pledge class or cohort, role, contact details, and active or alumni status. Everyone can browse and search the directory.

The app does not write `family.members`. It stores directory-specific data in its own tables:

- `member_profiles`: extra directory fields linked to existing hub members.
- `directory_people`: people who belong in the directory but are not hub members, such as alumni, advisors, partners, or guests.

Leadership access is configured through the app admin setting `leadership_group_id`.

Headshots are uploaded through the hub app file endpoint and stored as app-scoped files. Profile rows keep the resulting file URL in `photo_url`.

## Development

```bash
npm run dev
npm run build
npm test
```

`npm run build` produces `dist/bundle.json` for marketplace installation or GitHub release publishing.
