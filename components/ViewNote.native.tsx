import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Dimensions, Image, Keyboard } from 'react-native';
import { Note } from './types';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  cancelAnimation,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ViewNoteProps {
  note: Note;
  onBack: () => void;
  isEditable?: boolean;
  onUpdate?: (updatedNote: Note) => void;
  thumbnailScrollY?: number;
}

const NOTEBOOK_LINE_HEIGHT = 40.64;
const NOTEBOOK_CONTAINER_HEIGHT = 244.476;
const NOTEBOOK_LINE_COUNT = Math.round(NOTEBOOK_CONTAINER_HEIGHT / NOTEBOOK_LINE_HEIGHT);

function NotebookLines() {
  return (
    <View style={{ height: NOTEBOOK_CONTAINER_HEIGHT, width: '100%', position: 'relative' }} pointerEvents="none">
      {Array.from({ length: NOTEBOOK_LINE_COUNT }, (_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: i * NOTEBOOK_LINE_HEIGHT,
            height: StyleSheet.hairlineWidth,
            backgroundColor: 'rgba(164, 148, 127, 0.3)',
          }}
        />
      ))}
    </View>
  );
}

function calcThumbnailStartPositions(day: number, scrollY: number) {
  const cols = 7;
  const thumbnailWidth = 32;
  const thumbnailHeight = 35;
  const gap = 16;
  const gridWidth = cols * thumbnailWidth + (cols - 1) * gap;
  const gridStartX = (SCREEN_WIDTH - gridWidth) / 2;
  const rowIndex = Math.floor((day - 1) / cols);
  const colIndex = (day - 1) % cols;
  const thumbLeft = gridStartX + colIndex * (thumbnailWidth + gap);
  const thumbTop = 142 + rowIndex * (thumbnailHeight + gap) - scrollY;

  const currentPhotoWidth = 319;
  const currentPhotoHeight = 348;
  const finalScale = Math.min(thumbnailWidth / currentPhotoWidth, thumbnailHeight / currentPhotoHeight);
  const scaledW = currentPhotoWidth * finalScale;
  const scaledH = currentPhotoHeight * finalScale;

  return {
    finalScale,
    shadowLeft: thumbLeft - (329.774 - scaledW) / 2,
    shadowTop:  thumbTop  - (357.848 - scaledH) / 2,
    photoLeft:  thumbLeft - (347.765 - scaledW) / 2,
    photoTop:   thumbTop  - (374.162 - scaledH) / 2,
  };
}

export default function ViewNote({ note, onBack, isEditable = false, onUpdate, thumbnailScrollY = 0 }: ViewNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState<string | null>(note.image);
  const [description, setDescription] = useState(note.description);
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate thumbnail starting position for entrance animation
  const start = note.image ? calcThumbnailStartPositions(note.day, thumbnailScrollY) : null;

  // Photo / shadow position & appearance shared values
  const shadowLeft = useSharedValue(start ? start.shadowLeft : 32.61);
  const shadowTop  = useSharedValue(start ? start.shadowTop  : 181.08);
  const shadowScale = useSharedValue(start ? start.finalScale : 1);
  const shadowRotate = useSharedValue(start ? -2 : -1.8);
  const shadowBorderRadius = useSharedValue(start ? 10 : 32);

  const photoLeft  = useSharedValue(start ? start.photoLeft  : 23.62);
  const photoTop   = useSharedValue(start ? start.photoTop   : 172.92);
  const photoScale = useSharedValue(start ? start.finalScale : 1);
  const photoRotate = useSharedValue(start ? 3 : 4.94);
  const photoBorderRadius = useSharedValue(start ? 10 : 32);

  // Title / back button fade
  const titleOpacity = useSharedValue(start ? 0 : 1);
  const backOpacity  = useSharedValue(start ? 0 : 1);

  // Card entrance
  const cardOpacity   = useSharedValue(start ? 0 : 1);
  const cardEntranceY = useSharedValue(start ? 100 : 0);

  const cardBottom = useSharedValue(-200);
  const dragTranslateY = useSharedValue(0);

  // Entrance animation
  React.useEffect(() => {
    if (start) {
      const springEase = Easing.bezier(0.34, 1.56, 0.64, 1);
      const smoothEase = Easing.bezier(0.4, 0, 0.2, 1);
      // BorderRadius: progressive across phase1 duration (600ms) — reaches final before phase2 drop
      shadowBorderRadius.value = withTiming(32, { duration: 600, easing: smoothEase });
      photoBorderRadius.value  = withTiming(32, { duration: 600, easing: smoothEase });

      // Phase 1: thumbnail → slight overshoot ABOVE final position (600ms, spring)
      shadowLeft.value   = withTiming(32.61,  { duration: 600, easing: springEase });
      shadowTop.value    = withTiming(151,    { duration: 600, easing: springEase }); // 181.08 - 30
      shadowScale.value  = withTiming(1.05,   { duration: 600, easing: springEase });
      shadowRotate.value = withTiming(-1.8,   { duration: 600, easing: springEase });

      photoLeft.value    = withTiming(23.62,  { duration: 600, easing: springEase });
      photoTop.value     = withTiming(143,    { duration: 600, easing: springEase }); // 172.92 - 30
      photoScale.value   = withTiming(1.05,   { duration: 600, easing: springEase });
      photoRotate.value  = withTiming(4.94,   { duration: 600, easing: springEase });

      // Title + back button fade in during phase 1
      titleOpacity.value = withTiming(1, { duration: 600, easing: smoothEase });
      backOpacity.value  = withTiming(1, { duration: 600, easing: smoothEase });

      // Phase 2: drop DOWN to final position (600ms, smooth decelerate)
      setTimeout(() => {
        shadowTop.value   = withTiming(181.08, { duration: 600, easing: smoothEase });
        shadowScale.value = withTiming(1,      { duration: 600, easing: smoothEase });

        photoTop.value    = withTiming(172.92, { duration: 600, easing: smoothEase });
        photoScale.value  = withTiming(1,      { duration: 600, easing: smoothEase });
      }, 600);

      // Card: slide-fade-in from bottom, starts as photo settles
      setTimeout(() => {
        cardOpacity.value   = withTiming(1, { duration: 600, easing: smoothEase });
        cardEntranceY.value = withTiming(0, { duration: 600, easing: smoothEase });
      }, 400);
    }

    // Card floating entrance
    cardBottom.value = withRepeat(
      withSequence(
        withTiming(-190, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-200, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const expand = () => {
    cancelAnimation(cardBottom);
    cardBottom.value = withTiming(50, { duration: 500, easing: Easing.bezier(0.4, 0, 0.2, 1) });
    setIsExpanded(true);
  };

  const collapse = () => {
    cancelAnimation(cardBottom);
    cardBottom.value = withTiming(-195, { duration: 400, easing: Easing.bezier(0.4, 0, 0.2, 1) });
    setIsExpanded(false);
  };

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

  const handleBack = () => {
    if (!start) {
      onBack();
      return;
    }
    const smoothEase = Easing.bezier(0.4, 0, 0.2, 1);
    const exitDuration = 550;

    // Cancel any ongoing card animation
    cancelAnimation(cardBottom);

    // Fade out UI
    titleOpacity.value = withTiming(0, { duration: 250, easing: smoothEase });
    backOpacity.value  = withTiming(0, { duration: 250, easing: smoothEase });
    cardOpacity.value  = withTiming(0, { duration: 250, easing: smoothEase });
    cardEntranceY.value = withTiming(40, { duration: 250, easing: smoothEase });

    // BorderRadius: 32 → 10 across exit duration
    shadowBorderRadius.value = withTiming(10, { duration: exitDuration, easing: smoothEase });
    photoBorderRadius.value  = withTiming(10, { duration: exitDuration, easing: smoothEase });

    // Shrink photo back to thumbnail position
    shadowLeft.value   = withTiming(start.shadowLeft, { duration: exitDuration, easing: smoothEase });
    shadowTop.value    = withTiming(start.shadowTop,  { duration: exitDuration, easing: smoothEase });
    shadowScale.value  = withTiming(start.finalScale, { duration: exitDuration, easing: smoothEase });
    shadowRotate.value = withTiming(-2, { duration: exitDuration, easing: smoothEase });

    photoLeft.value    = withTiming(start.photoLeft,  { duration: exitDuration, easing: smoothEase });
    photoTop.value     = withTiming(start.photoTop,   { duration: exitDuration, easing: smoothEase });
    photoRotate.value  = withTiming(3, { duration: exitDuration, easing: smoothEase });
    photoScale.value   = withTiming(start.finalScale, { duration: exitDuration, easing: smoothEase }, (finished) => {
      if (finished) runOnJS(onBack)();
    });
  };

  const handleSave = () => {
    Keyboard.dismiss();
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
    Keyboard.dismiss();
    setImage(note.image);
    setDescription(note.description);
    setIsEditing(false);
  };

  const shadowAnimatedStyle = useAnimatedStyle(() => ({
    left: shadowLeft.value,
    top: shadowTop.value,
    transform: [
      { scale: shadowScale.value },
      { rotate: `${shadowRotate.value}deg` },
    ],
  }));

  const shadowBoxAnimatedStyle = useAnimatedStyle(() => ({
    borderRadius: shadowBorderRadius.value,
  }));

  const photoAnimatedStyle = useAnimatedStyle(() => ({
    left: photoLeft.value,
    top: photoTop.value,
    transform: [
      { scale: photoScale.value },
      { rotate: `${photoRotate.value}deg` },
    ],
  }));

  const photoFrameAnimatedStyle = useAnimatedStyle(() => ({
    borderRadius: photoBorderRadius.value,
    overflow: 'hidden' as const,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backOpacity.value,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    bottom: cardBottom.value,
    opacity: cardOpacity.value,
    transform: [
      { translateY: dragTranslateY.value + cardEntranceY.value }
    ],
  }));

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      // Make the card follow the finger during drag
      dragTranslateY.value = event.translationY;
    })
    .onEnd((event) => {
      dragTranslateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      if (event.translationY > 150) {
        runOnJS(collapse)();
      } else if (event.translationY < -50) {
        runOnJS(expand)();
      }
    });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <Animated.View style={[styles.backButton, backAnimatedStyle]}>
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.Text style={[styles.title, titleAnimatedStyle]}>
        LifeNote · Day {note.day}
      </Animated.Text>

      {/* Photo frame background shadow */}
      <Animated.View style={[styles.shadowContainer, shadowAnimatedStyle]}>
        <Animated.View style={[styles.shadowBox, shadowBoxAnimatedStyle]} />
      </Animated.View>

      {/* Photo frame */}
      <Animated.View style={[styles.photoContainer, photoAnimatedStyle]}>
        <Animated.View style={[styles.photoFrameOuter, photoFrameAnimatedStyle]}>
          <TouchableOpacity 
            style={styles.photoFrameInner}
            onPress={handlePhotoClick}
            disabled={!isEditing}
            activeOpacity={isEditing ? 1 : 0.8}
          >
            {image && (
              <Image source={{ uri: image }} style={styles.photoImage} />
            )}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Note display card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cardContainer, cardAnimatedStyle]}>
          <TouchableOpacity 
            style={styles.card}
            activeOpacity={1}
            onPress={() => !isEditing && (isExpanded ? collapse() : expand())}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Your note :)</Text>
              
              <View style={styles.linesContainer}>
                <NotebookLines />
                {isEditing ? (
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="What happened today?"
                    placeholderTextColor="rgba(90, 74, 53, 0.3)"
                    multiline
                    style={styles.textArea}
                    onFocus={() => expand()}
                  />
                ) : (
                  <Text style={styles.textAreaReadOnly}>{description}</Text>
                )}
              </View>
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
                    onPress={() => { setIsEditing(true); expand(); }}
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
    </TouchableWithoutFeedback>
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
    top: 72,
    left: 24,
    zIndex: 30,
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderRadius: 8,
    justifyContent: 'center',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  photoContainer: {
    position: 'absolute',
    width: 347.765,
    height: 374.162,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  photoFrameOuter: {
    backgroundColor: 'white',
    borderWidth: 8,
    borderColor: '#f8f7f4',
    height: 348,
    width: 319,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 5,
  },
  photoFrameInner: {
    width: '100%',
    height: '100%',
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
    marginBottom: 24,
  },
  linesContainer: {
    position: 'relative',
    width: '100%',
    height: NOTEBOOK_CONTAINER_HEIGHT,
  },
  textArea: {
    fontFamily: 'Handlee-Regular',
    fontSize: 14,
    color: '#5a4a35',
    position: 'absolute',
    top: -26,
    left: 0,
    right: 0,
    bottom: 0,
    lineHeight: 40.64,
    textAlignVertical: 'top',
    paddingTop: 0,
    includeFontPadding: false,
  },
  textAreaReadOnly: {
    fontFamily: 'Handlee-Regular',
    fontSize: 14,
    color: '#5a4a35',
    position: 'absolute',
    top: -26,
    left: 0,
    right: 0,
    lineHeight: 40.64,
    includeFontPadding: false,
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
