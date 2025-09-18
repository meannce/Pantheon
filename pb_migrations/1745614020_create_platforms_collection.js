/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    let collection = new Collection({
        type: "base",
        name: "platforms",
        listRule: "@request.auth.id != ''", // Needs to be authenticated
        viewRule: "@request.auth.id != ''", // Needs to be authenticated
        createRule: null, // Needs super-admin
        updateRule: null, // Needs super-admin
        deleteRule: null, // Needs super-admin
        fields: [
            {
                name: "name",
                type: "text",
                required: true,
            },
            {
                name: "order",
                type: "number",
                required: true,
            },
            {
                name: "created_at",
                type: "autodate",
                required: false,
                onCreate: true,
                onUpdate: false,
            },
            {
                name: "updated_at",
                type: "autodate",
                required: false,
                onCreate: true,
                onUpdate: true,
            },
        ],
    })

    app.save(collection)
}, (app) => {
    app.delete(
        app.findCollectionByNameOrId("platforms")
    )
})