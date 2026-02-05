import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { Note } from './types';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Line, G } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ViewNoteProps {
  note: Note;
  onBack: () => void;
  isEditable?: boolean;
  onUpdate?: (updatedNote: Note) => void;
}

function LinesSVG() {
  return (
    <View style={{ height: 244.476, width: '100%', position: 'relative' }}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 309.001 245.476"
        fill="none"
        preserveAspectRatio="none"
      >
        <G>
          <Line x1="0.00106109" y1="0.499999" x2="309" y2="1.13947" stroke="#A4947F" strokeOpacity="0.3" />
          <Line x1="0.00106109" y1="41.1395" x2="309" y2="41.7789" stroke="#A4947F" strokeOpacity="0.3" />
          <Line x1="0.00106109" y1="81.7789" x2="309" y2="82.4184" stroke="#A4947F" strokeOpacity="0.3" />
          <Line x1="0.00106109" y1="122.418" x2="309" y2="123.058" stroke="#A4947F" strokeOpacity="0.3" />
          <Line x1="0.00106109" y1="163.058" x2="309" y2="163.697" stroke="#A4947F" strokeOpacity="0.3" />
          <Line x1="0.00106109" y1="203.697" x2="309" y2="204.337" stroke="#A4947F" strokeOpacity="0.3" />
          <Line x1="0.00106109" y1="244.337" x2="309" y2="244.976" stroke="#A4947F" strokeOpacity="0.3" />
        </G>
      </Svg>
    </View>
  );
}

export default function ViewNote({ note, onBack, isEditable = false, onUpdate }: ViewNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState<string | null>(note.image);
  const [description, setDescription] = useState(note.description);
  const [isExpanded, setIsExpanded] = useState(false);

  // Animation values
  const shadowScale = useSharedValue(1);
  const shadowRotate = useSharedValue(-1.8);
  const photoScale = useSharedValue(1);
  const photoRotate = useSharedValue(4.94);
  const cardBottom = useSharedValue(-200);

  // Start floating animation
  React.useEffect(() => {
    if (!isExpanded) {
      cardBottom.value = withRepeat(
        withSequence(
          withTiming(-190, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(-200, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      cardBottom.value = withTiming(50, { duration: 500, easing: Easing.bezier(0.4, 0, 0.2, 1) });
    }
  }, [isExpanded]);

  const handlePhotoClick = () => {
    if (isEditing) {
      // Wiggle animation
      shadowScale.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1.02, { duration: 100 }),
        withTiming(0.98, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      shadowRotate.value = withSequence(
        withTiming(-3.5, { duration: 100 }),
        withTiming(-0.5, { duration: 100 }),
        withTiming(-2.5, { duration: 100 }),
        withTiming(-1.8, { duration: 100 })
      );
      
      photoScale.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1.02, { duration: 100 }),
        withTiming(0.98, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      photoRotate.value = withSequence(
        withTiming(3, { duration: 100 }),
        withTiming(6, { duration: 100 }),
        withTiming(4, { duration: 100 }),
        withTiming(4.94, { duration: 100 })
      );
    }
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...note,
        image,
        description,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setImage(note.image);
    setDescription(note.description);
    setIsEditing(false);
  };

  const shadowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: shadowScale.value },
      { rotate: `${shadowRotate.value}deg` },
    ],
  }));

  const photoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: photoScale.value },
      { rotate: `${photoRotate.value}deg` },
    ],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    bottom: isExpanded ? 50 : cardBottom.value,
  }));

  const panGesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.translationY > 150) {
        runOnJS(setIsExpanded)(false);
      } else if (event.translationY < -50) {
        runOnJS(setIsExpanded)(true);
      }
    });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        LifeNote · Day {note.day}
      </Text>

      {/* Photo frame background shadow */}
      <Animated.View style={[styles.shadowContainer, shadowAnimatedStyle]}>
        <View style={styles.shadowBox} />
      </Animated.View>

      {/* Photo frame */}
      <Animated.View style={[styles.photoContainer, photoAnimatedStyle]}>
        <TouchableOpacity 
          style={styles.photoFrame}
          onPress={handlePhotoClick}
          disabled={!isEditing}
          activeOpacity={isEditing ? 1 : 0.8}
        >
          {image && (
            <Image source={{ uri: image }} style={styles.photoImage} />
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Note display card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cardContainer, cardAnimatedStyle]}>
          <TouchableOpacity 
            style={styles.card}
            activeOpacity={1}
            onPress={() => !isEditing && setIsExpanded(!isExpanded)}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Your note :)</Text>
            </View>

            <LinesSVG />

            <View style={styles.textAreaContainer}>
              {isEditing ? (
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="What happened today?"
                  placeholderTextColor="rgba(90, 74, 53, 0.3)"
                  multiline
                  style={styles.textArea}
                  onFocus={() => setIsExpanded(true)}
                />
              ) : (
                <Text style={styles.textAreaReadOnly}>{description}</Text>
              )}
            </View>

            {/* Action buttons - show when editable */}
            {isEditable && (
              <View style={styles.buttonContainer}>
                {isEditing ? (
                  <>
                    <TouchableOpacity
                      onPress={handleCancel}
                      style={styles.cancelButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSave}
                      style={styles.saveButton}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    onPress={() => setIsEditing(true)}
                    style={styles.saveButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.saveButtonText}>Edit</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2ede7',
    overflow: 'hidden',
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    fontFamily: 'DMMono-Regular',
    fontSize: 12,
    color: '#5a4a35',
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
    zIndex: 20,
  },
  shadowContainer: {
    position: 'absolute',
    left: 32.61,
    top: 181.08,
    width: 329.774,
    height: 357.848,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  shadowBox: {
    backgroundColor: '#e6dfd6',
    height: 348,
    width: 319,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  photoContainer: {
    position: 'absolute',
    left: 23.62,
    top: 172.92,
    width: 347.765,
    height: 374.162,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  photoFrame: {
    backgroundColor: 'white',
    borderWidth: 8,
    borderColor: '#f8f7f4',
    height: 348,
    width: 319,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 5,
  },
  photoImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
  },
  cardContainer: {
    position: 'absolute',
    left: SCREEN_WIDTH / 2 - 184.9145,
    width: 369.829,
    height: 401.879,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: 369,
    borderRadius: 32,
    padding: 40,
    paddingHorizontal: 30,
  },
  cardContent: {
    minWidth: '100%',
  },
  cardTitle: {
    fontFamily: 'DMMono-Regular',
    fontSize: 14,
    color: '#2f1f0a',
  },
  textAreaContainer: {
    position: 'absolute',
    top: 85.85,
    left: 29.66,
    width: 309.579,
    height: 280.639,
  },
  textArea: {
    fontFamily: 'Handlee-Regular',
    fontSize: 14,
    color: '#5a4a35',
    width: 309,
    height: 280,
    lineHeight: 39.76,
    textAlignVertical: 'top',
  },
  textAreaReadOnly: {
    fontFamily: 'Handlee-Regular',
    fontSize: 14,
    color: '#5a4a35',
    width: 309,
    lineHeight: 39.76,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 16,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontFamily: 'DMMono-Regular',
    fontSize: 12,
    color: '#5a4a35',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#5a4a35',
  },
  saveButtonText: {
    fontFamily: 'DMMono-Regular',
    fontSize: 12,
    color: 'white',
  },
});
