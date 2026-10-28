
import { useState } from "react";
import "./AIRecommendations.css";

export default function AIRecommendations() {
  const [prompt, setPrompt] = useState("");
  const [songs, setSongs] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!prompt.trim()) {
      setError("Describe the kind of song you want first.");
      return;
    }

    setLoading(true);
    setError("");
    setSongs([]);
    setPreferences(null);

    try {
      const response = await fetch("/ai-api/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Could not find recommendations."
        );
      }

      setSongs(data.results || []);
      setPreferences(data.preferences || null);
    } catch (err) {
      console.error("Strummy recommendation error:", err);
      setError(
        "We couldn't load recommendations. Make sure the Python backend is running and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="ai-recommendations">
      <div className="ai-recommendations__intro">
        <p className="ai-recommendations__eyebrow">
          YOUR NEXT GUITAR SONG
        </p>

        <h2>Find a song that feels right.</h2>

        <p>
          Tell Strummy your mood, skill level, or which chords
          you'd like to avoid.
        </p>
      </div>

      <form
        className="ai-recommendations__form"
        onSubmit={handleSubmit}
      >
        <label htmlFor="song-prompt">
          What would you like to play?
        </label>

        <textarea
          id="song-prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Something cozy and sad, beginner-friendly, without barre chords..."
          rows={3}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Finding your songs..." : "Find my songs"}
        </button>
      </form>

      {error && (
        <p className="ai-recommendations__error" role="alert">
          {error}
        </p>
      )}

      {preferences && (
        <div className="ai-recommendations__preferences">
          <p>We understood your preferences as:</p>
          <div className="ai-recommendations__tags">
            {preferences.moods?.map((mood) => (
              <span key={mood}>{mood}</span>
            ))}
            <span>{preferences.max_difficulty}</span>
            {preferences.avoid_barre_chords && (
              <span>No barre chords</span>
            )}
          </div>
        </div>
      )}

      {preferences && songs.length === 0 && !error && (
        <p>
          No songs matched all those preferences. Try describing
          a different mood or allowing more chords.
        </p>
      )}

      {songs.length > 0 && (
        <div className="ai-recommendations__results">
          <h3>Your song matches</h3>

          {songs.map((song) => (
            <article
              className="ai-recommendations__song"
              key={song.id}
            >
              <div>
                <h4>{song.title}</h4>
                <p>{song.artist}</p>
                {song.reason && <p>{song.reason}</p>}
              </div>

              <div className="ai-recommendations__details">
                <span>{song.difficulty}</span>
                <span>
                  Chords: {song.chords?.join(", ") || "Not listed"}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
