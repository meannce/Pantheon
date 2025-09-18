/// <reference path="../pb_data/types.d.ts" />

const visibilityStates = [
    { name: "Public", order: 1 },
    { name: "Private", order: 2 }
]

migrate((app) => {
    for (const state of visibilityStates) {
        let record = new Record(app.findCollectionByNameOrId("visibility_status"))

        record.set("name", state.name)
        record.set("order", state.order)

        app.save(record)
    }
}, (app) => {
    for (const state of visibilityStates) {
        try {
            app.delete(
                app.findFirstRecordByFilter("visibility_status", `name = "${state.name}"`)
            )
        } catch {
            // Not found - probably it has already been deleted.
        }
    }
}) 