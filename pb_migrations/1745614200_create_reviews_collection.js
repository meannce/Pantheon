/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    let collection = new Collection({
        type: "base",
        name: "reviews",
        listRule: "id = @request.auth.id || visibility_status.name = 'Public'",
        viewRule: "id = @request.auth.id || visibility_status.name = 'Public'",
        createRule: "@request.auth.id != ''",
        updateRule: "id = @request.auth.id",
        deleteRule: "id = @request.auth.id",
        fields: [
            {
                name: "user",
                type: "relation",
                required: true,
                maxSelect: 1,
                collectionId: '_pb_users_auth_',
                cascadeDelete: true,
            },
            {
                name: "game",
                type: "relation",
                required: true,
                maxSelect: 1,
                collectionId: app.findCollectionByNameOrId("games").id,
                cascadeDelete: false,
            },
            {
                name: "visibility_status",
                type: "relation",
                required: true,
                maxSelect: 1,
                collectionId: app.findCollectionByNameOrId("visibility_status").id,
                cascadeDelete: false,
            },
            {
                name: "accuracy_status",
                type: "relation",
                required: true,
                maxSelect: 1,
                collectionId: app.findCollectionByNameOrId("accuracy_status").id,
                cascadeDelete: false,
            },
            {
                name: "completion_status",
                type: "relation",
                required: true,
                maxSelect: 1,
                collectionId: app.findCollectionByNameOrId("completion_status").id,
                cascadeDelete: false,
            },
            {
                name: "tier",
                type: "relation",
                required: false,
                maxSelect: 1,
                collectionId: app.findCollectionByNameOrId("tiers").id,
                cascadeDelete: false,
            },
            {
                name: "platform",
                type: "relation",
                required: true,
                maxSelect: 1,
                collectionId: app.findCollectionByNameOrId("platforms").id,
                cascadeDelete: false,
            },
            {
                name: "contents",
                type: "editor",
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
        app.findCollectionByNameOrId("reviews")
    )
})