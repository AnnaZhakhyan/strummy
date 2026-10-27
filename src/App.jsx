
import { useState } from 'react'
import { searchSongs } from './services/itunesApi'

const songs = [
    {
        title: 'Dream a Little Dream',
        artist: 'The Mamas & the Papas',
        chords: 'C · Am · F · G',
        level: 'Beginner',
    },
    {
        title: 'Riptide',
        artist: 'Vance Joy',
        chords: 'Am · G · C',
        level: 'Beginner',
    },
    {
        title: 'Stand by Me',
        artist: 'Ben E. King',
        chords: 'G · Em · C · D',
        level: 'Beginner',
    },
]

function App() {
    const [lampOn, setLampOn] = useState(true)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [hasSearched, setHasSearched] = useState(false)

    async function handleSearch(event) {
        event.preventDefault()

        if (!query.trim()) return

        setLoading(true)
        setError('')
        setHasSearched(true)

        try {
            const songs = await searchSongs(query.trim())
            setResults(songs)
        } catch (err) {
            setError(err.message || 'Something went wrong.')
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    const displayedSongs = results

    return (
        <main className={lampOn ? 'app lamp-on' : 'app lamp-off'}>
            <header className="navbar">
                <a className="logo" href="#home">
                    strummy<span>♪</span>
                </a>

                <nav className="nav-links" aria-label="Main navigation">
                    <a href="#songs">find a song</a>
                    <a href="#how-it-works">how it works</a>
                </nav>

                <a className="nav-button" href="#songs">
                    let's play
                </a>
            </header>

            <section className="hero" id="home">
                <div className="hero-copy">
                    <p className="eyebrow">YOUR LITTLE CORNER OF MUSIC</p>

                    <h1>
                        A little guitar time<span>.</span>
                    </h1>

                    <p className="hero-description">
                        Your favourite songs, a few simple chords, and a little time
                        for yourself. Let's make playing guitar feel easy.
                    </p>

                    <div className="hero-actions">
                        <a className="primary-button" href="#songs">
                            find your first song <span aria-hidden="true">↗</span>
                        </a>
                    </div>

                    <p className="hero-note">
                        no experience needed. just bring your guitar.
                    </p>
                </div>

                <div className="hero-visual">
                    <div
                        className="room"
                        role="img"
                        aria-label="A cosy illustrated music corner with a lamp, guitar, and plant"
                    >
                        <div className="sun-shape" />

                        <div className="wall-frame" aria-hidden="true">
                            <span>take it</span>
                            <span>slow ♡</span>
                        </div>

                        <div className="lamp" aria-hidden="true">
                            <div className="lamp-glow" />
                            <div className="lampshade" />
                            <div className="lamp-neck" />
                            <div className="lamp-base" />

                            <button
                                className="lamp-string"
                                type="button"
                                onClick={() => setLampOn((previous) => !previous)}
                                aria-label={lampOn ? 'Turn lamp off' : 'Turn lamp on'}
                                aria-pressed={lampOn}
                                title="Pull the string to toggle the lamp"
                            >
                                <span />
                            </button>
                        </div>

                        <div className="plant" aria-hidden="true">
                            <span className="leaf leaf-one" />
                            <span className="leaf leaf-two" />
                            <span className="leaf leaf-three" />
                            <span className="leaf leaf-four" />
                            <div className="plant-pot" />
                        </div>

                        <div className="guitar" aria-hidden="true">
                            <div className="guitar-head" />
                            <div className="guitar-neck" />
                            <div className="guitar-body">
                                <div className="guitar-hole" />
                                <div className="guitar-bridge" />
                            </div>
                            <div className="guitar-strings" />
                        </div>

                        <div className="room-floor" />

                        <p className="room-caption">
                            slow evenings, soft strings, good songs.
                        </p>
                    </div>
                </div>
            </section>

            <section className="songs-section" id="songs">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">YOUR NEXT FAVOURITE SONG</p>
                        <h2>Start with something familiar.</h2>
                    </div>

                    <p className="song-count">
                        a few chords go a long way ♡
                    </p>
                </div>

                <form className="song-search" onSubmit={handleSearch}>
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search for a song or artist..."
                        aria-label="Search for a song or artist"
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? 'Searching...' : 'Find songs'}
                    </button>
                </form>

                {error && <p role="alert">{error}</p>}

                {loading && (
                    <p className="search-status" role="status">
                        Finding songs for you...
                    </p>
                )}

                {hasSearched && !loading && !error && results.length === 0 && (
                    <p>No songs found. Try another title or artist.</p>
                )}

                {hasSearched && results.length > 0 && (
                    <p className="search-results-count">
                        Found {results.length} songs for "{query}"
                    </p>
                )}

                <div className="song-grid">
                    {displayedSongs.map((song) => (
                        <article
                            className="song-card"
                            key={song.id ?? song.title}
                        >
                            <div className="song-art">
                                {song.artwork ? (
                                    <img
                                        src={song.artwork}
                                        alt={`Album artwork for ${song.title}`}
                                    />
                                ) : (
                                    <span aria-hidden="true">♫</span>
                                )}
                            </div>

                            <div className="song-info">
                                {song.level && (
                                    <div className="song-tags">
                                        <span className="song-tag">
                                            {song.level}
                                        </span>
                                    </div>
                                )}

                                <h3>{song.title}</h3>
                                <p className="song-artist">{song.artist}</p>

                                {song.chords && (
                                    <p className="song-chords">
                                        CHORDS: {song.chords}
                                    </p>
                                )}

                                {song.preview && (
                                    <audio
                                        controls
                                        preload="none"
                                        src={song.preview}
                                    >
                                        Your browser does not support audio
                                        playback.
                                    </audio>
                                )}

                                {song.url ? (
                                    <a
                                        className="song-button"
                                        href={song.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        view song ↗
                                    </a>
                                ) : (
                                    <button
                                        className="song-button"
                                        type="button"
                                        onClick={() =>
                                            alert(
                                                `We'll learn ${song.title} here soon!`
                                            )
                                        }
                                    >
                                        learn this song →
                                    </button>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section
                className="how-section section"
                id="how-it-works"
            >
                <p className="eyebrow">THERE'S NO RUSH</p>
                <h2>Strum with us</h2>

                <p>
                    Find a song you love, learn the chords at your own pace,
                    and enjoy the little moments when it finally clicks.
                </p>
            </section>

            <footer className="footer">
                <a className="logo" href="#home">
                    strummy<span>♪</span>
                </a>

                <p>made for slow evenings and new beginnings.</p>
            </footer>
        </main>
    )
}

export default App
