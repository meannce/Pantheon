import dotenv from 'dotenv';
import { getPocketBase, authenticate, getGames, createGame } from './pocketbase.js';


async function readSteamApiGames() {
    try {
        const response = await fetch('http://api.steampowered.com/ISteamApps/GetAppList/v0002?format=json')
        const data = await response.json()

        return data.applist.apps
            .filter(game => game.appid && game.name && game.name.trim() !== '')
            .map(game => ({
                external_id: game.appid,
                image_url: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
                name: game.name.trim(),
            }));
    } catch (error) {
        throw new Error('Failed to fetch steam games: ' + error);
    }
};

async function main() {
    dotenv.config();

    const pb = getPocketBase()

    await authenticate(pb)

    const entries = await readSteamApiGames()
    const existingGames = await getGames(pb)

    for (const entry of entries) {
        if (existingGames.find(it => it.external_id === entry.external_id)) {
            continue
        }

        await createGame(pb, entry)
    }
}

main()
