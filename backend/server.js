
import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

const CHORD_API = 'https://songsearch.chords.wbou.dev/api'
const ALLOWED_ORIGIN = 'https://annazhakhyan.github.io'

app.use(cors({
    origin: ALLOWED_ORIGIN,
    methods: ['GET'],
}))

app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.get('/api/search', async (req, res) => {
    try {
        const query = String(req.query.q || '').trim()

        if (!query) {
            return res.status(400).json({
                error: 'A search query is required.',
            })
        }

        const url = new URL(`${CHORD_API}/search`)
        url.searchParams.set('q', query)
        url.searchParams.set('limit', '10')

        const response = await fetch(url)
        const body = await response.text()

        res.status(response.status)
        res.type(response.headers.get('content-type') || 'application/json')
        res.send(body)
    } catch (error) {
        console.error('Song search failed:', error)
        res.status(502).json({
            error: 'Could not reach the chord database.',
        })
    }
})

app.get('/api/songs/:id', async (req, res) => {
    try {
        const id = req.params.id

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                error: 'Invalid song ID.',
            })
        }

        const response = await fetch(
            `${CHORD_API}/songs/${encodeURIComponent(id)}`
        )
        const body = await response.text()

        res.status(response.status)
        res.type(response.headers.get('content-type') || 'application/json')
        res.send(body)
    } catch (error) {
        console.error('Chord chart request failed:', error)
        res.status(502).json({
            error: 'Could not load the chord chart.',
        })
    }
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Strummy chord backend running on port ${PORT}`)
})
