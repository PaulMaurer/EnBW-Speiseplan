"use strict";

const api = "https://enbw-speiseplan.azurewebsites.net/v2/all";
const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
const dateFormat = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit", month: "2-digit", timeZone: "UTC"
});
const locationSelect = document.querySelector("#location");
const status = document.querySelector("#status");
const retry = document.querySelector("#retry");
const overview = document.querySelector("#overview");
const table = document.querySelector("#plan");

function element(tag, content, className) {
  const node = document.createElement(tag);
  if (content) node.textContent = content;
  if (className) node.className = className;
  return node;
}

function parseDate(value) {
  const [day, month, year] = (value || "").split(".").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function datePlus(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function currentMonday() {
  const today = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Berlin"
  }).format(new Date());
  const date = parseDate(today);
  return datePlus(date, -((date.getUTCDay() + 6) % 7));
}

function addDishes(cell, dishes) {
  for (const dish of dishes) {
    const entry = element("div", dish.name, "dish");
    if (dish.description) entry.append(element("span", dish.description, "description"));
    cell.append(entry);
  }
  if (!dishes.length) cell.append(element("span", "–", "empty"));
}

function addRow(body, label, records, className) {
  const row = body.insertRow();
  if (className) row.className = className;
  const header = element("th", label);
  header.scope = "row";
  row.append(header);
  for (const dishes of records) addDishes(row.insertCell(), dishes);
  return row;
}

function render(location) {
  const start = parseDate(location.beginDate);
  const monday = datePlus(start, -((start.getUTCDay() + 6) % 7));
  const week = document.querySelector("#week");
  const details = document.querySelector("#location-details");
  details.textContent = location.description || "";
  details.hidden = !location.description;

  if (+monday !== +currentMonday()) {
    week.textContent = "";
    status.textContent = "Für diesen Standort liegt derzeit kein Speiseplan für die aktuelle Woche vor.";
    overview.hidden = true;
    table.replaceChildren();
    return;
  }

  week.textContent = `KW ${location.calendarWeek} · ${location.beginDate} – ${location.endDate}`;
  status.textContent = "";

  const head = element("thead");
  const headings = head.insertRow();
  const category = element("th", "Angebot");
  category.scope = "col";
  headings.append(category);
  weekdays.forEach((weekday, index) => {
    const heading = element("th", weekday);
    heading.scope = "col";
    heading.append(element("span", dateFormat.format(datePlus(monday, index)), "date"));
    headings.append(heading);
  });

  const days = weekdays.map((_, index) =>
    location.dishes.find(dish => Number(dish.dayOfWeek) === index + 1) || {});
  const closed = days.map(day => day.menus?.find(dish => /^geschlossen$/i.test(dish.name.trim())));
  const menus = element("tbody");
  [
    ["Vegetarisches Menü", "MENU_VEGGIE"],
    ["Menü 1", "MENU1"],
    ["Menü 2", "MENU2"]
  ].forEach(([label, type], rowIndex) => {
    const row = addRow(menus, label, days.map((day, index) => {
      if (closed[index]) return rowIndex === 0 ? [closed[index]] : [];
      return day.menus?.filter(dish => dish.dishType === type) || [];
    }), "menu");
    if (rowIndex === 0) closed.forEach((dish, index) => {
      if (dish) row.cells[index + 1].classList.add("closed");
    });
  });

  if (location.salads?.length) {
    const saladRow = addRow(menus, "Salate", [location.salads]);
    saladRow.cells[1].colSpan = weekdays.length;
  }
  const sides = element("tbody");
  const section = sides.insertRow();
  section.className = "section";
  const sectionTitle = element("th", "Komponenten & Tagessuppe");
  sectionTitle.scope = "rowgroup";
  sectionTitle.colSpan = weekdays.length + 1;
  section.append(sectionTitle);
  for (const [label, field] of [
    ["Beilagen", "supplements"],
    ["Gemüse", "vegetables"],
    ["Dessert", "desserts"],
    ["Tagessuppe", "soup"]
  ]) {
    addRow(sides, label, days.map((day, index) =>
      closed[index] ? [] : [day[field]].flat().filter(Boolean)));
  }
  table.replaceChildren(head, menus, sides);
  overview.hidden = false;
}

async function getLocations() {
  const response = await fetch(api, {
    cache: "no-store",
    credentials: "omit",
    referrerPolicy: "no-referrer",
    signal: AbortSignal.timeout(25000)
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const payload = await response.json();
  const locations = payload.locations?.filter(location =>
    location.shortName && location.name && Array.isArray(location.dishes) &&
    Number.isFinite(+parseDate(location.beginDate)) && Number.isFinite(+parseDate(location.endDate)));
  if (!locations?.length) throw new Error("Keine gültigen Standortdaten");
  return locations;
}

async function start() {
  retry.hidden = true;
  status.textContent = "Der Speiseplan wird geladen …";
  let locations;
  try {
    locations = await getLocations();
  } catch (error) {
    console.error("Speiseplan-API", error);
    status.textContent = "Die Live-Daten konnten gerade nicht geladen werden.";
    retry.hidden = false;
    return;
  }
  locations.sort((left, right) => left.name.localeCompare(right.name, "de"));
  locationSelect.replaceChildren(...locations.map(location =>
    new Option(location.name, location.shortName)));
  const requested = new URLSearchParams(window.location.search).get("standort");
  const initial = locations.find(location => location.shortName === requested) ||
    locations.find(location => location.shortName === "ESN") || locations[0];
  locationSelect.value = initial.shortName;
  locationSelect.disabled = false;
  render(initial);
  locationSelect.addEventListener("change", () => {
    const selected = locations.find(location => location.shortName === locationSelect.value);
    const url = new URL(window.location.href);
    url.searchParams.set("standort", selected.shortName);
    history.replaceState(null, "", url);
    overview.scrollLeft = 0;
    render(selected);
  });
}

retry.addEventListener("click", start);
start();
