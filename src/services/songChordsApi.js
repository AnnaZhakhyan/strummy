
const BASE_URL = import.meta.env.DEV
  ? '/chords-api'
  : 'https://strummy-chord-backend.onrender.com/api'
export async function searchSongsWithChords(query) {
    const response = await fetch(
        `${BASE_URL}/search?q=${encodeURIComponent(query)}&limit=10`
    )

    if (!response.ok) {
        throw new Error(
            `Could not search for songs with chords. (${response.status})`
        )
    }

    return response.json()
}

export async function getSongChords(songId) {
    const response = await fetch(
        `${BASE_URL}/songs/${encodeURIComponent(songId)}`
    )

    if (!response.ok) {
        throw new Error(
            `Could not load this song's chords. (${response.status})`
        )
    }

    return response.json()
}

export async function findSongChords(artist, title) {
    const matches = await searchSongsWithChords(`${artist} ${title}`)

    if (!Array.isArray(matches) || matches.length === 0) {
        throw new Error('No chord chart found for this song.')
    }

    const normalize = value =>
        (value ?? '')
            .toLowerCase()
            .replace(/\([^)]*\)/g, '')
            .replace(/\[[^\]]*\]/g, '')
            .replace(/[^a-z0-9]/g, '')

    const wantedArtist = normalize(artist)
    const wantedTitle = normalize(title)

    const exactMatch = matches.find(song =>
        normalize(song.artist) === wantedArtist &&
        (
            normalize(song.title) === wantedTitle ||
            normalize(song.title).startsWith(wantedTitle) ||
            wantedTitle.startsWith(normalize(song.title))
        )
    )

    const artistMatch = matches.find(
        song => normalize(song.artist) === wantedArtist
    )

    const match = exactMatch ?? artistMatch

    if (!match) {
        throw new Error(
            `No matching chord chart found for ${artist} - ${title}. Try another song.`
        )
    }

    return getSongChords(match.id)
}
