
import { useEffect, useState } from 'react'
import { getChordShapes } from './guitarTheoryApi.js'

function GuitarFretboard({ shape }) {
    const notes = shape.frets ?? []

    // The API numbers strings from 1 (high E) to 6 (low E).
    const stringNumbers = [6, 5, 4, 3, 2, 1]
    const frettedNotes = notes.filter(note => note.fret > 0)

    const firstFret =
        frettedNotes.length > 0
            ? Math.max(1, Math.min(...frettedNotes.map(note => note.fret)) - 1)
            : 1

    const lastFret = Math.max(
        firstFret + 3,
        ...frettedNotes.map(note => note.fret)
    )

    const fretCount = Math.min(lastFret - firstFret + 1, 5)

    return (
        <div className="guitar-fretboard">
            <div className="fretboard-strings">
                {stringNumbers.map(stringNumber => {
                    const note = notes.find(
                        item => item.string === stringNumber
                    )

                    return (
                        <div className="fretboard-string" key={stringNumber}>
                            <span className="string-label">
                                {['E', 'A', 'D', 'G', 'B', 'e'][
                                    6 - stringNumber
                                ]}
                            </span>

                            <div className="string-frets">
                                {Array.from(
                                    { length: fretCount + 1 },
                                    (_, index) => {
                                        const fret = firstFret + index
                                        const isOpen = fret === 0
                                        const isAtNut = fret === 1
                                        const isNote =
                                            note && note.fret === fret

                                        return (
                                            <div
                                                className={`fret-cell ${
                                                    isAtNut ? 'nut-fret' : ''
                                                }`}
                                                key={fret}
                                            >
                                                {isNote && (
                                                    <span
                                                        className={`note-dot ${
                                                            note.isRoot
                                                                ? 'root-note'
                                                                : ''
                                                        }`}
                                                        title={`${note.note}, fret ${fret}`}
                                                    >
                                                        {note.note}
                                                    </span>
                                                )}
                                                {isOpen && note?.fret === 0 && (
                                                    <span className="open-note">
                                                        ○
                                                    </span>
                                                )}
                                            </div>
                                        )
                                    }
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="fret-numbers">
                {Array.from({ length: fretCount }, (_, index) => (
                    <span key={index}>{firstFret + index}</span>
                ))}
            </div>
        </div>
    )
}

export default function ChordDiagram({ chord }) {
    const [shapes, setShapes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showAlternatives, setShowAlternatives] = useState(false)

    useEffect(() => {
        let cancelled = false

        async function loadChord() {
            setLoading(true)
            setError('')
            setShapes([])
            setShowAlternatives(false)

            try {
                const data = await getChordShapes(chord)

                if (!cancelled) {
                    setShapes(data.shapes ?? [])
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || 'Could not load this chord.')
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadChord()

        return () => {
            cancelled = true
        }
    }, [chord])

    if (loading) {
        return <p>Finding your {chord} chord...</p>
    }

    if (error) {
        return <p className="chord-error">{error}</p>
    }

    if (!shapes.length) {
        return <p>No fingerings found for {chord}.</p>
    }

    // Prefer open-position shapes for beginners.
    const beginnerIndex = Math.max(
        0,
        shapes.findIndex(shape =>
            /open/i.test(shape.name ?? '')
        )
    )

    const beginnerShape = shapes[beginnerIndex]
    const otherShapes = shapes.filter(
        (_, index) => index !== beginnerIndex
    )

    return (
        <article className="chord-diagram">
            <h4>{chord}</h4>

            <div className="chord-shape">
                <p className="shape-name">
                    {beginnerShape.name ?? 'Beginner fingering'}
                </p>
                <GuitarFretboard shape={beginnerShape} />
            </div>

            {otherShapes.length > 0 && (
                <>
                    <button
                        className="alternatives-button"
                        type="button"
                        onClick={() =>
                            setShowAlternatives(previous => !previous)
                        }
                    >
                        {showAlternatives
                            ? 'Hide other fingerings ↑'
                            : 'Other fingerings ↓'}
                    </button>

                    {showAlternatives && (
                        <div className="alternative-shapes">
                            {otherShapes.map((shape, index) => (
                                <div
                                    className="chord-shape"
                                    key={`${shape.name}-${index}`}
                                >
                                    <p className="shape-name">
                                        {shape.name ?? `Alternative ${index + 1}`}
                                    </p>
                                    <GuitarFretboard shape={shape} />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </article>
    )
}
