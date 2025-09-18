import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getPocketBase, authenticate, getUsers, createUser, getPlatforms, getVisibilityStatus, getAccuracyStatus, getCompletionStatus, getTiers, createReview, getGames } from './pocketbase.js';

function readGameReviews() {
    const filePath = path.join('fixtures', 'games.json');

    if (!fs.existsSync(filePath)) {
        throw new Error('JSON file not found at: ' + filePath);
    }

    const reviews = JSON.parse(
        fs.readFileSync(filePath, 'utf-8')
    );

    return reviews.map(function (it) {
        switch (it.status) {
            case '':
            case 'N/A':
            case 'Unfinished':
                it.completion_status = 'Unfinished'
                break;
            case 'Completed':
            case 'Beaten':
                it.completion_status = 'Completed'
                break;
            default:
                throw new Error('Unknown status: ' + it.status)
        }

        it.visibility_status = 'Private'
        it.accuracy_status = 'Finished'

        return it
    })
};

async function main() {
    dotenv.config();

    const pb = getPocketBase()

    await authenticate(pb)
    const users = await getUsers(pb)
    const platforms = await getPlatforms(pb)
    const visibilityStates = await getVisibilityStatus(pb)
    const accuracyStates = await getAccuracyStatus(pb)
    const completionStates = await getCompletionStatus(pb)
    const tiers = await getTiers(pb)
    const games = await getGames(pb)

    const entries = readGameReviews()

    for (const entry of entries) {
        let user = users.find(it => it.name === entry.player)

        if (!user) {
            user = await createUser(pb, entry.player)
            users.push(user)
        }

        let platform = platforms.find(it => it.name === entry.platform)
        if (!platform) {
            throw new Error('Platform not found: ' + entry.platform)
        }

        let visibilityState = visibilityStates.find(it => it.name === entry.visibility_status)
        if (!visibilityState) {
            throw new Error('Visibility status not found: ' + entry.visibility_status)
        }

        let accuracyState = accuracyStates.find(it => it.name === entry.accuracy_status)
        if (!accuracyState) {
            throw new Error('Accuracy status not found: ' + entry.accuracy_status)
        }

        let completionState = completionStates.find(it => it.name === entry.completion_status)
        if (!completionState) {
            throw new Error('Completion status not found: ' + entry.completion_status)
        }

        let tier = tiers.find(it => it.name === entry.tier)
        if (!tier) {
            throw new Error('Tier not found: ' + entry.tier)
        }

        let possibleGames = games.filter(it => it.name === entry.name)
        if (possibleGames.length === 0) {
            throw new Error('Game not found: ' + entry.name)
        }
        if (possibleGames.length > 1) {
            // We can later develop an improved algorithm to find the best match
            //  based on the image being available.
            // But we'll just use the higher external_id for now.
            possibleGames = possibleGames.sort((a, b) => b.external_id - a.external_id)

            console.warn('Multiple games found: ' + entry.name + ' - ' + possibleGames.map(it => it.external_id).join(', '))
        }

        let game = possibleGames[0]

        await createReview(pb, user, entry, game, platform, tier, visibilityState, accuracyState, completionState)
    }
}

main()
