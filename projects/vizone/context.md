# Vizone: app context

## App map (Viz One Studio, logged in as admin)

- Top: global "Search Items" box, fullscreen / split view, menubar Dashboard, Macros, Stack (item basket, "Stack (N)").
- Left nav: **Search** Items, Log Entries, Programs, Series, Packages, Folders; **Browse** Rundowns, Today, Yesterday; **Media** Create, Files, Delete Queue, Transfers, Retention, Dart; **System** Dashboard, Preferences, Accessibility, Macros, Documentation, Administration, About, Log out.
- Dashboard: a dashboard message, Recent Items, Recent Folders. URLs are hash routes (`/studio/#DashboardPlace:`).
- Login page: Domain select (Internal accounts = SYSTEM), User name, Password, Log In.

## Media and preview

- Items: Search > Items, sort "Media Duration" for the longest (staging has 1-3h40m Feed items). Item page = HTML5 video player (proxy H.264/AAC from vizone-staging-media01, audio items play an mp3), Overview table (Duration, Start TC, Format, Audio), tabs Metadata, Keyframes (paged thumbnails), Files (Highres / Proxy Video LR + Audio LR / Archive location), Log, Segments.
- Player time code shows Start TC + position, not 00:00 based.
- Archived items: no "archived" media status; use the Archive policy facet (No, N/A, NAS, Scality) and the Files tab location (e.g. Scality Archive). Their proxy still plays.
- Asset media status values: Online, Empty, Failed, Importing (on 2026-10-30 Importing = stale .wav.filepart uploads, no live recording).
- Search: Chinese keywords match titles and text; English keywords do not match Chinese-only items (Q-002). Facets list the top 4 values; "Show All" reveals all facets.
- Easycut / Precut / Logger buttons on the item page did not open anything visible in the browser.

## Known user issues (feedback report 28 Oct 2026)

Source: "Vizone User Feedback 28Oct2026.docx" from the user. Most issues are in the Premiere plugin / Media Server, not the web client; web-testable angles in brackets.

CNCA:
1. (High) Long (1-2 h) or archived files: Media Bin thumbnail preview hangs, dragging to the timeline freezes, Premiere can crash. [preview of long/archived items in Studio]
2. (High) Severe lag from about 15:00 daily (peak load on the Media Server): search, loading, editing. [search/load timings by time of day]
3. (High) Exported sequences with Vizone clips randomly lose audio; workaround: mute a specific audio track before export. [plugin only]
4. (Medium) Growing files (live recordings) on the timeline stop extending their end timecode. [growing-file duration in Studio]
5. (Medium) Different plugin / Premiere versions per workstation cause project compatibility errors. [plugin only]

ENCA:
1. (High) Long program files (1-2 h) load very slowly. [item/preview load time]
2. (High) Audio waveform not rendered and no sound after import, needs waits or reloads. [audio playback in Studio preview]
3. (Medium) English keyword search does not find items with Chinese titles; no automatic folder filtering by feed source (Live View, agency feeds, press releases). [search, folders]

Recommended remediation in the report: Media Server hardware / NAS / proxy workflow, fix audio pass-through between the plugin and Adobe Media Encoder, enforce one plugin version, AI auto-transcription and multilingual translation.
