import PocketBase from 'pocketbase';
import { randomUUID } from 'crypto';

function getPocketBase() {
    return new PocketBase(process.env.PB_URL + ':' + process.env.PB_PORT);
}

async function authenticate(pb) {
    try {
        await pb.collection('_superusers').authWithPassword(process.env.PB_ADMIN_EMAIL, process.env.PB_ADMIN_PASSWORD);
        console.log('Authenticated successfully!');
    } catch (err) {
        console.error(err)
        throw new Error('Authentication failed.');
    }
}

async function getUsers(pb) {
    try {
        return await pb.collection('users').getFullList()
    } catch (err) {
        throw new Error('Failed to fetch users: ' + err);
    }
}

async function createUser(pb, username) {
    const sanitizeEmail = (username) => {
        return username.toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[^a-z0-9._-]/g, '');
    }

    try {
        const generatedPassword = randomUUID()
        const sanitizedEmail = sanitizeEmail(username)

        const user = {
            name: username,
            email: sanitizedEmail + '@example.com',
            emailVisibility: true,
            password: generatedPassword,
            passwordConfirm: generatedPassword,
        }

        return await pb.collection('users').create(user)
    } catch (err) {
        throw new Error('Failed to create an user: ' + err);
    }
}

async function getPlatforms(pb) {
    try {
        return await pb.collection('platforms').getFullList()
    } catch (err) {
        throw new Error('Failed to fetch platforms: ' + err);
    }
}

async function getVisibilityStatus(pb) {
    try {
        return await pb.collection('visibility_status').getFullList()
    } catch (err) {
        throw new Error('Failed to fetch visibility status: ' + err);
    }
}

async function getAccuracyStatus(pb) {
    try {
        return await pb.collection('accuracy_status').getFullList()
    } catch (err) {
        throw new Error('Failed to fetch completion status: ' + err);
    }
}

async function getCompletionStatus(pb) {
    try {
        return await pb.collection('completion_status').getFullList()
    } catch (err) {
        throw new Error('Failed to fetch completion status: ' + err);
    }
}

async function getTiers(pb) {
    try {
        return await pb.collection('tiers').getFullList()
    } catch (err) {
        throw new Error('Failed to fetch tiers: ' + err);
    }
}

async function getGames(pb) {
    try {
        return await pb.collection('games').getFullList()
    } catch (err) {
        throw new Error('Failed to fetch games: ' + err);
    }
}

async function createGame(pb, entry) {
    await pb.collection('games').create({
        external_id: entry.external_id,
        name: entry.name,
        image_url: entry.image_url,
    })
}

async function updateGame(pb, id, data) {
    await pb.collection('games').update(id, { ...data })
}

async function createReview(
    pb,
    user,
    entry,
    game,
    platform,
    tier,
    visibilityState,
    accuracyState,
    completionState,
) {
    let review = {}

    try {
        review = {
            user: user.id,
            name: entry.name,
            game: game.id,
            platform: platform.id,
            visibility_status: visibilityState.id,
            accuracy_status: accuracyState.id,
            completion_status: completionState.id,
            tier: tier.id,
            contents: entry.description,
            created_at: entry.timestamp,
        }

        return await pb.collection('reviews').create(review)
    } catch (err) {
        console.error(review)
        console.error(err.data)

        throw new Error('Failed to create review.');
    }
}

export {
    getPocketBase,
    authenticate,
    getUsers,
    createUser,
    getPlatforms,
    getVisibilityStatus,
    getAccuracyStatus,
    getCompletionStatus,
    getTiers,
    getGames,
    createGame,
    updateGame,
    createReview,
}
