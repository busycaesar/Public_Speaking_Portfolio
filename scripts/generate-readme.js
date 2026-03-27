#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const ENGAGEMENTS_PATH = path.join(ROOT, "engagements.json");
const README_PATH = path.join(ROOT, "README.md");

const EVENT_DETAILS_SINGULAR = new Set([
  "Tech Talk (In-Person) - May 2025",
  "Global Azure Bootcamp - Toronto 2025",
]);

function mdLink(label, url) {
  return url ? `[${label}](${url})` : `[${label}](#)`;
}

function userGroupBullet(userGroup) {
  if (!userGroup) {
    return `  - ${mdLink("User Group: User Group Name", null)}`;
  }
  if (userGroup.name === "Event Partners") {
    return `  - ${mdLink("Event Partners", userGroup.url)}`;
  }
  return `  - ${mdLink(`User Group: ${userGroup.name}`, userGroup.url)}`;
}

function locationBullet(location) {
  if (!location) {
    return `  - ${mdLink("Location: Location Name", null)}`;
  }
  return `  - ${mdLink(`Location: ${location.name}`, location.url)}`;
}

function eventsSectionHeading(title) {
  return EVENT_DETAILS_SINGULAR.has(title)
    ? "### Event Details"
    : "### Events Details";
}

function renderEngagement(e) {
  const lines = [];
  const titleSuffix = e.status === "upcoming" ? " `Upcoming`" : "";
  lines.push(`## ${e.title}${titleSuffix}`);
  lines.push(eventsSectionHeading(e.title));
  lines.push(userGroupBullet(e.userGroup));
  lines.push(locationBullet(e.location));
  lines.push(`  - ${mdLink("Event Details Page", e.eventPage)}`);
  lines.push("### Presentation Details");
  lines.push(`  - ${mdLink("Presentation Slides", e.slides)}`);
  lines.push(`  - ${mdLink("Code and Documentation", e.code)}`);
  lines.push("### After Event Photos");
  const ae = e.afterEvent || {};
  if (ae.youtube) {
    lines.push(`  - ${mdLink("Session Recording", ae.youtube)}`);
  }
  lines.push(`  - ${mdLink("LinkedIn", ae.linkedin)}`);
  lines.push(`  - ${mdLink("X", ae.x)}`);
  return lines.join("\n");
}

function main() {
  const raw = fs.readFileSync(ENGAGEMENTS_PATH, "utf8");
  const engagements = JSON.parse(raw);

  const header = [
    "# Public Speaking Portfolio",
    "",
    "Welcome to my public speaking portfolio of tech talks and workshops. This repo includes a list of events where I have presented on software development topics.",
    "",
    "---",
    "",
    "",
  ].join("\n");

  const body = engagements.map(renderEngagement).join("\n\n---\n\n");
  const out = header + body + "\n\n";
  fs.writeFileSync(README_PATH, out, "utf8");
}

main();
