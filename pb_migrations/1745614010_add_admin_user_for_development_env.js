/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const environment = $os.getenv('PB_ENV').trim().toLowerCase()

    if (environment !== 'dev' && environment !== 'development') {
        return
    }

    let record = new Record(
        app.findCollectionByNameOrId("_superusers")
    )

    record.set("email", $os.getenv('PB_ADMIN_EMAIL'))
    record.set("password", $os.getenv('PB_ADMIN_PASSWORD'))

    app.save(record)
}, (app) => {
    const environment = $os.getenv('PB_ENV').toLowerCase()

    if (environment !== 'dev' || environment !== 'development') {
        return
    }

    try {
        let record = app.findAuthRecordByEmail("_superusers", $os.getenv('PB_ADMIN_EMAIL'))

        app.delete(record)
    } catch {
        // Not found - probably it has already been deleted.
    }
})