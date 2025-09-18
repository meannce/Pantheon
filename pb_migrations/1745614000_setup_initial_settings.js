/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    let settings = app.settings()

    settings.meta.appName = "Pantheon"

    app.save(settings)
}, (app) => {
    //
})