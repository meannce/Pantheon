/// <reference path="../pb_data/types.d.ts" />

const platforms = [
    { name: "Steam", order: 1 },
    { name: "Epic Games", order: 2 },
    { name: "GOG", order: 3 },
    { name: "itch.io", order: 4 },
    { name: "Battle.net", order: 5 },
    { name: "Bethesda.net", order: 6 },
    { name: "EA App / Origin", order: 7 },
    { name: "Rockstar Games", order: 8 },
    { name: "PlayStation", order: 9 },
    { name: "Xbox", order: 10 },
    { name: "Nintendo", order: 11 },
    { name: "Google Play", order: 12 },
    { name: "App Store", order: 13 }
]

migrate((app) => {
    for (const platform of platforms) {
        let record = new Record(app.findCollectionByNameOrId("platforms"))

        record.set("name", platform.name)
        record.set("order", platform.order)

        app.save(record)
    }
}, (app) => {
    for (const platform of platforms) {
        try {
            app.delete(
                app.findFirstRecordByFilter("platforms", `name = "${platform.name}"`)
            )
        } catch {
            // Not found - probably it has already been deleted.
        }
    }
}) 