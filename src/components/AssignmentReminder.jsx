import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'myuniversitybuddy_assignments';

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function sortByDueDate(assignments) {
  return [...assignments].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

export default function AssignmentReminder() {
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ title: '', course: '', dueDate: '' });

  // Load assignments from localStorage on first render
  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setAssignments(sortByDueDate(parsed));
        }
      } catch {
        // ignore corrupt data
      }
    }
  }, []);

  // Persist assignments any time they change
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  }, [assignments]);

  const canSave = useMemo(() => {
    return form.title.trim() && form.course.trim() && form.dueDate.trim();
  }, [form]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!canSave) {
      return;
    }

    const newAssignment = {
      id: createId(),
      title: form.title.trim(),
      course: form.course.trim(),
      dueDate: form.dueDate,
      createdAt: new Date().toISOString(),
    };

    setAssignments((prev) => sortByDueDate([...prev, newAssignment]));

    setForm({ title: '', course: '', dueDate: '' });
  };

  const handleDelete = (id) => {
    setAssignments((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="card">
      <h2>Assignment Reminder</h2>

      <form className="form" onSubmit={handleSubmit}>
        <label className="form__row">
          <span>Assignment title</span>
          <input
            type="text"
            value={form.title}
            onChange={handleChange('title')}
            placeholder="e.g. Read Chapter 4"
            required
          />
        </label>

        <label className="form__row">
          <span>Course name</span>
          <input
            type="text"
            value={form.course}
            onChange={handleChange('course')}
            placeholder="e.g. Biology 101"
            required
          />
        </label>

        <label className="form__row">
          <span>Due date</span>
          <input
            type="date"
            value={form.dueDate}
            onChange={handleChange('dueDate')}
            required
          />
        </label>

        <button type="submit" className="button button--primary" disabled={!canSave}>
          Add assignment
        </button>
      </form>

      <div className="list">
        {assignments.length === 0 ? (
          <p className="list__empty">No assignments yet. Add one above!</p>
        ) : (
          <ul className="list__items">
            {assignments.map((assignment) => (
              <li key={assignment.id} className="list__item">
                <div className="list__main">
                  <div>
                    <strong>{assignment.title}</strong>
                  </div>
                  <div className="list__meta">
                    <span>{assignment.course}</span>
                    <span>Due {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  className="button button--danger"
                  type="button"
                  onClick={() => handleDelete(assignment.id)}
                  aria-label={`Delete assignment ${assignment.title}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
