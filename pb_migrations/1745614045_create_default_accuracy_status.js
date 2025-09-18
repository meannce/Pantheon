/// <reference path="../pb_data/types.d.ts" />

const accuracyStates = [
    { name: "Finished", order: 1 },
    { name: "Draft", order: 2 },
]

migrate((app) => {
    for (const state of accuracyStates) {
        let record = new Record(app.findCollectionByNameOrId("accuracy_status"))

        record.set("name", state.name)
        record.set("order", state.order)

        app.save(record)
    }
}, (app) => {
    for (const state of accuracyStates) {
        try {
            app.delete(
                app.findFirstRecordByFilter("accuracy_status", `name = "${state.name}"`)
            )
        } catch {
            // Not found - probably it has already been deleted.
        }
    }
}) 