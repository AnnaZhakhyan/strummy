
export function searchSongs(query) {
    return new Promise((resolve, reject) => {
        const callbackName =
            `itunesCallback_${Date.now()}_${Math.random()
                .toString(36)
                .slice(2)}`

        const params = new URLSearchParams({
            term: query,
            media: 'music',
            entity: 'song',
            limit: '50',
            country: 'US',
            callback: callbackName,
        })

        const script = document.createElement('script')
        script.src = `https://itunes.apple.com/search?${params}`

        let timeout

        function cleanup() {
            clearTimeout(timeout)
            script.remove()
            delete window[callbackName]
        }

        window[callbackName] = (data) => {
            cleanup()

            const alternateVersion =
                /\b(live|remix|karaoke|instrumental|tribute|cover|sped up|slowed|nightcore|acoustic version|remastered)\b/i

            const seenTitles = new Set()

            const songs = (data.results ?? [])
                .filter((song) => {
                    if (
                        !song.trackId ||
                        !song.trackName ||
                        !song.artistName
                    ) {
                        return false
                    }

                    if (alternateVersion.test(song.trackName)) {
                        return false
                    }

                    const key = song.trackName
                        .toLowerCase()
                        .replace(/[^\w\s]/g, '')
                        .trim()

                    if (seenTitles.has(key)) {
                        return false
                    }

                    seenTitles.add(key)
                    return true
                })
                .sort((a, b) => {
                    const term = query.trim().toLowerCase()

                    return (
                        Number(b.trackName.toLowerCase() === term) -
                        Number(a.trackName.toLowerCase() === term)
                    )
                })
                .slice(0, 12)
                .map((song) => ({
                    id: song.trackId,
                    title: song.trackName,
                    artist: song.artistName,
                    artwork: song.artworkUrl100,
                    preview: song.previewUrl,
                    url: song.trackViewUrl,
                }))

            resolve(songs)
        }

        script.onerror = () => {
            cleanup()
            reject(
                new Error('Could not connect to the music service. Please try again.')
            )
        }

        timeout = setTimeout(() => {
            cleanup()
            reject(
                new Error('The music search timed out. Please try again.')
            )
        }, 15000)

        document.head.appendChild(script)
    })
}
