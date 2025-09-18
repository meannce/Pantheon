/// <reference path="../pb_data/types.d.ts" />

const completionStates = [
    { name: "Completed", order: 1 },
    { name: "Unfinished", order: 2 },
    { name: "In progress", order: 3 },
]

migrate((app) => {
    for (const state of completionStates) {
        let record = new Record(app.findCollectionByNameOrId("completion_status"))

        record.set("name", state.name)
        record.set("order", state.order)

        app.save(record)
    }
}, (app) => {
    for (const state of completionStates) {
        try {
            app.delete(
                app.findFirstRecordByFilter("completion_status", `name = "${state.name}"`)
            )
        } catch {
            // Not found - probably it has already been deleted.
        }
    }
}) 