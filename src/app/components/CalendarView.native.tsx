import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Note } from '../types';

interface CalendarViewProps {
  notes: Note[];
  currentDay: number;
  onDayClick: (day: number) => void;
}

interface DayThumbnailProps {
  note?: Note;
  onClick: () => void;
}

function DayThumbnail({ note, onClick }: DayThumbnailProps) {
  if (note?.image) {
    return (
      <TouchableOpacity
        onPress={onClick}
        style={styles.dayThumbnailContainer}
        activeOpacity={0.8}
      >
        {/* Rotated shadow rectangle behind */}
        <View style={styles.shadowContainer}>
          <View style={[styles.shadowRect, { transform: [{ rotate: '-2deg' }] }]} />
        </View>
        
        {/* Main photo frame */}
        <View style={[styles.photoFrame, { transform: [{ rotate: '3deg' }] }]}>
          <View style={styles.photoBackground} />
          <Image source={{ uri: note.image }} style={styles.photoImage} />
          <View style={styles.photoBorder} />
        </View>
      </TouchableOpacity>
    );
  }

  // Empty day - show dot
  return (
    <TouchableOpacity
      onPress={onClick}
      style={styles.emptyDayContainer}
      activeOpacity={0.8}
    >
      <View style={styles.emptyDot} />
    </TouchableOpacity>
  );
}

export default function CalendarView({ notes, currentDay, onDayClick }: CalendarViewProps) {
  // Calculate total days in current year
  const currentYear = new Date().getFullYear();
  const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
  const totalDays = isLeapYear ? 366 : 365;
  
  const cols = 7;
  const rows = Math.ceil(totalDays / cols);

  const getNoteForDay = (day: number) => {
    return notes.find(note => note.day === day);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        LifeNote · Day {currentDay}
      </Text>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {Array.from({ length: cols }).map((_, colIndex) => {
              const dayNumber = rowIndex * cols + colIndex + 1;
              // Only render if within the year's day count
              if (dayNumber > totalDays) return null;
              
              const note = getNoteForDay(dayNumber);
              const isToday = dayNumber === currentDay;
              
              return (
                <View key={dayNumber} style={styles.dayContainer}>
                  <DayThumbnail
                    note={note}
                    onClick={() => onDayClick(dayNumber)}
                  />
                  {isToday && (
                    <View style={styles.todayIndicator} />
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
      
      {/* Gradient fade at bottom */}
      <View style={styles.gradientFade} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2ede7',
    position: 'relative',
  },
  title: {
    position: 'absolute',
    top: 72,
    left: 0,
    right: 0,
    fontFamily: 'DMMono-Regular',
    fontSize: 14,
    color: '#5a4a35',
    textAlign: 'center',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
    marginTop: 142,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 96,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  dayContainer: {
    position: 'relative',
  },
  dayThumbnailContainer: {
    height: 35,
    width: 32,
    position: 'relative',
  },
  shadowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  shadowRect: {
    backgroundColor: '#e6dfd6',
    height: 35,
    width: 32,
    borderRadius: 10,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  photoFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    zIndex: 10,
    overflow: 'hidden',
  },
  photoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  photoImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  photoBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#f8f7f4',
  },
  emptyDayContainer: {
    height: 35,
    width: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#a4947f',
    opacity: 0.3,
  },
  todayIndicator: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -2,
    width: 4,
    height: 4,
    backgroundColor: '#5a4a35',
    borderRadius: 2,
  },
  gradientFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 96,
    zIndex: 10,
    pointerEvents: 'none',
    backgroundColor: 'transparent',
  },
});
