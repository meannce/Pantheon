/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    let collection = new Collection({
        type: "base",
        name: "games",
        listRule: "@request.auth.id != ''", // Needs to be authenticated
        viewRule: "@request.auth.id != ''", // Needs to be authenticated
        createRule: "@request.auth.id != ''", // Needs to be authenticated
        updateRule: null, // Needs super-admin
        deleteRule: null, // Needs super-admin
        fields: [
            {
                name: "external_id",
                type: "text",
                required: false,
            },
            {
                name: "name",
                type: "text",
                required: true,
            },
            {
                name: "description",
                type: "editor",
                required: false,
            },
            {
                name: "image_url",
                type: "text",
                required: false,
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
        indexes: [
            //
        ],
    })

    app.save(collection)
}, (app) => {
    app.delete(
        app.findCollectionByNameOrId("games")
    )
})