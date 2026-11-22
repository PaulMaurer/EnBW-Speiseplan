# EnBW-Speiseplan

Aufrufen über: [speiseplan.paul-maurer.de](https://speiseplan.paul-maurer.de)

Eine Wochenübersicht für die Betriebsrestaurants an zehn EnBW-Standorten. Der Speiseplan zeigt alle fünf Werktage von Montag bis Freitag in einer Tabelle. Auch bereits vergangene Tage der angezeigten Woche bleiben sichtbar.

## Speiseplan aufrufen

Der gewünschte Standort lässt sich über das Dropdown am Seitenanfang auswählen. Die Auswahl wird in der URL gespeichert und kann als Link geteilt werden. Beim ersten Aufruf ist Stuttgart vorausgewählt.

Die Tabelle zeigt vegetarische Gerichte, weitere Menüs, Salate, Beilagen, Gemüse, Desserts und die Tagessuppe, soweit diese für den Standort verfügbar sind. Auf schmalen Bildschirmen lässt sich die Tabelle horizontal scrollen.

## Datenquelle und Aktualität

Die Website lädt den Speiseplan beim Öffnen von der Speiseplan-API. Kalenderwoche und Gültigkeitszeitraum stehen oberhalb der Tabelle. Ist die Live-Quelle vorübergehend nicht erreichbar, zeigt die Website den mitgelieferten Datenstand aus `data.json` an und weist darauf hin. Preise und Allergene sind in den verwendeten Daten nicht enthalten.

## Technik

Die Website besteht aus HTML, CSS und JavaScript und ist für GitHub Pages ausgelegt. Für eine lokale Vorschau genügt ein HTTP-Server, etwa `python -m http.server 8000` im Repository-Verzeichnis. Die Seite ist dann unter `http://localhost:8000` erreichbar.
