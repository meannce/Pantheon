/// <reference path="../pb_data/types.d.ts" />

const tiers = [
    { name: "S", order: 1 },
    { name: "A", order: 2 },
    { name: "B", order: 3 },
    { name: "C", order: 4 },
    { name: "D", order: 5 },
    { name: "E", order: 6 },
    { name: "F", order: 7 },
    { name: "N/A", order: 8 }
]

migrate((app) => {
    for (const tier of tiers) {
        let record = new Record(app.findCollectionByNameOrId("tiers"))

        record.set("name", tier.name)
        record.set("order", tier.order)

        app.save(record)
    }
}, (app) => {
    for (const tier of tiers) {
        try {
            app.delete(
                app.findFirstRecordByFilter("tiers", `name = "${tier.name}"`)
            )
        } catch {
            // Not found - probably it has already been deleted.
        }
    }
}) 