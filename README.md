# Pantheon Backend

## Requirements

- Docker
- npm / NodeJS (optional: for the custom [scripts](#scripts))

## Setup

```
cp .env.example .env

docker compose up -d
```

There are two ways to create a superuser.

  - Using the command line

```
docker compose pocketbase ./pocketbase superuser create [EMAIL] [PASS]
```

Now open the following [URL](http://localhost:8000/_/#/login) (assuming you're using the default settings available in the `.env`) and you should see the admin panel.

  - Using the browser

```
docker compose logs
```

Open the given URL and create an account - you're all set, you should now see the admin panel.

## Scripts

There are currently two scripts available (look in the `scripts` folder).

`001_add_steam_games.js` - import every game from Steam in order to bootstrap/update the available games in the API/platform.
`002_migrate_previous_website_data.js` - import game reviews from a JSON file (data from a previous platform).
