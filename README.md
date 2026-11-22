# Inoffizielle Speiseplanübersicht für EnBW-Standorte

Aufrufen über: [speiseplan.paul-maurer.de](https://speiseplan.paul-maurer.de)

Ein privates, unabhängiges Projekt mit einer Wochenübersicht für die Betriebsrestaurants an zehn EnBW-Standorten. Die Tabelle zeigt Montag bis Freitag der aktuellen Woche einschließlich der bereits vergangenen Tage.

## Speiseplan aufrufen

Der gewünschte Standort lässt sich über das Dropdown am Seitenanfang auswählen. Die Auswahl wird in der URL gespeichert und kann als Link geteilt werden. Beim ersten Aufruf ist Stuttgart vorausgewählt.

Die Tabelle zeigt vegetarische Gerichte, weitere Menüs, Salate, Beilagen, Gemüse, Desserts und die Tagessuppe, soweit diese für den Standort verfügbar sind. Auf schmalen Bildschirmen lässt sich die Tabelle horizontal scrollen.

## Datenquelle und Aktualität

Die Website lädt den Speiseplan beim Öffnen direkt von der [externen Speiseplan-Schnittstelle](https://enbw-speiseplan.azurewebsites.net/v2/all). Kalenderwoche und Gültigkeitszeitraum stehen oberhalb der Tabelle. Bei einem Ladefehler lässt sich der Abruf erneut starten. Für verbindliche Angaben, einschließlich Preisen und Allergenen, ist das jeweilige Betriebsrestaurant die Anlaufstelle.

## Technik

Die Website besteht aus HTML, CSS und JavaScript und ist für GitHub Pages ausgelegt. Für eine lokale Vorschau genügt ein HTTP-Server, etwa `python -m http.server 8000` im Repository-Verzeichnis. Die Seite ist dann unter `http://localhost:8000` erreichbar.
