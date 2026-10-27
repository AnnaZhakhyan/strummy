

const BASE_URL = 'https://www.guitartheory.com/api/v1'

const chordTypes = {
    '': 'major',
    m: 'minor',
    min: 'minor',
    maj: 'major',
    dim: 'diminished',
    aug: 'augmented',
    sus2: 'sus2',
    sus4: 'sus4',
    '5': 'power',
    '6': 'major6',
    m6: 'minor6',
    '7': 'dom7',
    maj7: 'maj7',
    m7: 'min7',
    min7: 'min7',
    m7b5: 'half-diminished',
    dim7: 'dim7',
add9: 'major',
    madd9: 'minor-add9',
    '9': 'dom9',
    maj9: 'maj9',
    m9: 'min9',
    '11': 'dom11',
    '13': 'dom13',
    '7sus4': 'dom7',
}

export async function getChordShapes(chord) {
    // Remove slash-bass notation for now, e.g. G/F# -> G.
    // We can add bass-note handling separately.
    const chordWithoutBass = chord.split('/')[0].trim()

    const match = chordWithoutBass.match(/^([A-G][b#]?)(.*)$/)

    if (!match) {
        throw new Error(`Invalid chord: ${chord}`)
    }

    const [, root, suffix] = match
    const type = chordTypes[suffix]

    if (!type) {
        throw new Error(`Chord type not supported yet: ${chord}`)
    }

    const encodedRoot = encodeURIComponent(root)

    const response = await fetch(
        `${BASE_URL}/chords/${encodedRoot}/${encodeURIComponent(type)}`
    )

  if (!response.ok) {
    const details = await response.text()
    console.error('Chord:', chord)
    console.error('Request URL:', response.url)
    console.error('Status:', response.status)
    console.error('API response:', details)

    throw new Error(`Could not load ${chord} (${response.status})`)
}

    const data = await response.json()

    return {
        ...data,
        shapes: data.shapes ?? [],
    }
}
export async function debugChordTypes() {
    const response = await fetch(`${BASE_URL}/chord-types`)
    const data = await response.json()

    console.log('Chord types API response:', data)
    return data
}
