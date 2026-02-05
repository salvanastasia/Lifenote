import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from './src/app/types';
import CalendarView from './src/app/components/CalendarView.native';
import NewNoteView from './src/app/components/NewNoteView.native';
import ViewNote from './src/app/components/ViewNote.native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type ViewMode = 'calendar' | 'new-note' | 'view-note';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

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
  const [appIsReady, setAppIsReady] = useState(false);

  // ============ DEMO MODE - REMOVE LATER ============
  const DEMO_MODE = true;
  // ============ END DEMO MODE ============

  const [fontsLoaded] = useFonts({
    'DMMono-Regular': require('./assets/fonts/DMMono-Regular.ttf'),
    'Handlee-Regular': require('./assets/fonts/Handlee-Regular.ttf'),
  });

  // Load notes from AsyncStorage on mount
  useEffect(() => {
    async function prepare() {
      try {
        // ============ DEMO MODE - REMOVE LATER ============
        if (DEMO_MODE) {
          // In demo mode, start fresh with no notes
          // Don't load from AsyncStorage, don't save demo data
          setNotes([]);
          
          // Calculate current day
          const today = getToday();
          const dayNum = getDayNumber(today);
          setCurrentDay(dayNum);
          
          // Always show new note view in demo mode on load
          setViewMode('new-note');
          setAppIsReady(true);
          return; // Skip the normal AsyncStorage logic
        }
        // ============ END DEMO MODE ============
        
        const savedNotes = await AsyncStorage.getItem('lifenote-notes');
        if (savedNotes) {
          try {
            const parsed = JSON.parse(savedNotes);
            setNotes(parsed);
          } catch (e) {
            console.error('Failed to parse notes from AsyncStorage', e);
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
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Save notes to AsyncStorage whenever they change
  useEffect(() => {
    async function saveNotes() {
      // ============ DEMO MODE - REMOVE LATER ============
      if (DEMO_MODE) {
        // Don't persist to AsyncStorage in demo mode
        return;
      }
      // ============ END DEMO MODE ============
      
      if (notes.length > 0) {
        try {
          await AsyncStorage.setItem('lifenote-notes', JSON.stringify(notes));
        } catch (e) {
          console.error('Failed to save notes to AsyncStorage', e);
        }
      }
    }

    saveNotes();
  }, [notes]);

  // Hide splash screen when fonts and data are loaded
  useEffect(() => {
    if (fontsLoaded && appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, appIsReady]);

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

  if (!fontsLoaded || !appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
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
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
