import { useState, useEffect } from 'react';
import { Note } from './types';
import CalendarView from './components/CalendarView';
import NewNoteView from './components/NewNoteView';
import ViewNote from './components/ViewNote';

type ViewMode = 'calendar' | 'new-note' | 'view-note';

function getToday(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

function getDayNumber(dateString: string): number {
  // Calculate day number within the current year (1-365/366)
  const date = new Date(dateString);
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diffTime = date.getTime() - startOfYear.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 because Jan 1 is day 1
  return diffDays;
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [currentDay, setCurrentDay] = useState<number>(1);

  // ============ DEMO MODE - REMOVE LATER ============
  const DEMO_MODE = true;
  // ============ END DEMO MODE ============

  // Load notes from localStorage on mount
  useEffect(() => {
    // ============ DEMO MODE - REMOVE LATER ============
    if (DEMO_MODE) {
      // In demo mode, start fresh with no notes
      // Don't load from localStorage, don't save demo data
      setNotes([]);
      
      // Calculate current day
      const today = getToday();
      const dayNum = getDayNumber(today);
      setCurrentDay(dayNum);
      
      // Always show new note view in demo mode on load
      setViewMode('new-note');
      return; // Skip the normal localStorage logic
    }
    // ============ END DEMO MODE ============
    
    const savedNotes = localStorage.getItem('lifenote-notes');
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        setNotes(parsed);
      } catch (e) {
        console.error('Failed to parse notes from localStorage', e);
      }
    }

    // Calculate current day
    const today = getToday();
    const dayNum = getDayNumber(today);
    setCurrentDay(dayNum);

    // Check if today has a note
    if (savedNotes) {
      const parsed = JSON.parse(savedNotes);
      const todayNote = parsed.find((note: Note) => note.date === today);
      if (!todayNote) {
        // No note for today, show new note view
        setViewMode('new-note');
      } else {
        // Note exists, show calendar
        setViewMode('calendar');
      }
    } else {
      // No notes at all, show new note view
      setViewMode('new-note');
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    // ============ DEMO MODE - REMOVE LATER ============
    if (DEMO_MODE) {
      // Don't persist to localStorage in demo mode
      return;
    }
    // ============ END DEMO MODE ============
    
    if (notes.length > 0) {
      localStorage.setItem('lifenote-notes', JSON.stringify(notes));
    }
  }, [notes]);

  const handleSaveNote = (noteData: Omit<Note, 'day' | 'date'>) => {
    const today = getToday();
    const dayNum = getDayNumber(today);
    
    const newNote: Note = {
      ...noteData,
      date: today,
      day: dayNum,
    };

    setNotes([...notes, newNote]);
    setViewMode('calendar');
  };

  const handleDayClick = (day: number) => {
    const note = notes.find(n => n.day === day);
    if (note) {
      setSelectedNote(note);
      setViewMode('view-note');
    } else {
      // If clicking on today and no note exists, go to new note
      const today = getToday();
      const todayDayNum = getDayNumber(today);
      if (day === todayDayNum) {
        setViewMode('new-note');
      }
    }
  };

  const handleBackToCalendar = () => {
    setSelectedNote(null);
    setViewMode('calendar');
  };

  const handleCancelNewNote = () => {
    setViewMode('calendar');
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(notes.map(n => n.day === updatedNote.day ? updatedNote : n));
    setSelectedNote(updatedNote);
  };

  const isNoteEditable = (note: Note | null): boolean => {
    if (!note) return false;
    const today = getToday();
    return note.date === today;
  };

  return (
    <div className="size-full">
      {viewMode === 'calendar' && (
        <CalendarView
          notes={notes}
          currentDay={currentDay}
          onDayClick={handleDayClick}
        />
      )}
      {viewMode === 'new-note' && (
        <NewNoteView
          currentDay={currentDay}
          onSave={handleSaveNote}
          onCancel={handleCancelNewNote}
        />
      )}
      {viewMode === 'view-note' && selectedNote && (
        <ViewNote
          note={selectedNote}
          onBack={handleBackToCalendar}
          onUpdate={handleUpdateNote}
          isEditable={isNoteEditable(selectedNote)}
        />
      )}
    </div>
  );
}