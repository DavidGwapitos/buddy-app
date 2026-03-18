import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'myuniversitybuddy_favoriteCourses';

// This could come from an API or user data in a real app.
const AVAILABLE_COURSES = [
  'Biology 101',
  'Calculus I',
  'Computer Science Fundamentals',
  'English Literature',
  'History of Art',
  'Physics: Mechanics',
  'Psychology Basics',
];

export default function FavoriteCourses() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      } catch {
        // ignore bad data
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

  const toggleFavorite = (course) => {
    setFavorites((prev) => {
      if (prev.includes(course)) {
        return prev.filter((item) => item !== course);
      }
      return [...prev, course];
    });
  };

  return (
    <div className="card">
      <h2>Favorite Courses</h2>

      <div className="courses">
        <h3>All courses</h3>
        <ul className="courses__list">
          {AVAILABLE_COURSES.map((course) => {
            const isFav = favoritesSet.has(course);
            return (
              <li key={course} className="courses__item">
                <span>{course}</span>
                <button
                  type="button"
                  className={`icon-button ${isFav ? 'icon-button--active' : ''}`}
                  onClick={() => toggleFavorite(course)}
                  aria-label={`${isFav ? 'Remove' : 'Add'} ${course} from favorites`}
                >
                  <span aria-hidden="true">{isFav ? '★' : '☆'}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="favorites">
        <h3>Favorite courses</h3>
        {favorites.length === 0 ? (
          <p className="list__empty">No favorite courses yet. Tap the star to add one.</p>
        ) : (
          <ul className="courses__list">
            {favorites.map((course) => (
              <li key={course} className="courses__item">
                <span>{course}</span>
                <button
                  type="button"
                  className="icon-button icon-button--active"
                  onClick={() => toggleFavorite(course)}
                  aria-label={`Remove ${course} from favorites`}
                >
                  <span aria-hidden="true">★</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
