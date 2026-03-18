import AssignmentReminder from './components/AssignmentReminder.jsx';
import FavoriteCourses from './components/FavoriteCourses.jsx';

export default function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1>MyUniversityBuddy</h1>
        <p>A simple app to keep track of assignments and favorite courses.</p>
      </header>

      <main className="app__main">
        <section className="app__section">
          <AssignmentReminder />
        </section>
        <section className="app__section">
          <FavoriteCourses />
        </section>
      </main>

      <footer className="app__footer">
        <small>All data is stored locally in your browser.</small>
      </footer>
    </div>
  );
}
