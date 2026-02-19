import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Dimensions, Image, Alert, Keyboard } from 'react-native';
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
import * as ImagePicker from 'expo-image-picker';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface NewNoteViewProps {
  currentDay: number;
  onSave: (note: Omit<Note, 'day' | 'date'>) => void;
  onCancel: () => void;
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

export default function NewNoteView({ currentDay, onSave, onCancel }: NewNoteViewProps) {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Animation values
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(-20);
  const titleBlur = useSharedValue(10);

  const shadowLeft = useSharedValue(32.61);
  const shadowTop = useSharedValue(181.08);
  const shadowScale = useSharedValue(1);
  const shadowRotate = useSharedValue(-1.8);
  const shadowOpacity = useSharedValue(0);
  const shadowBorderRadius = useSharedValue(32);

  const photoLeft = useSharedValue(23.62);
  const photoTop = useSharedValue(172.92);
  const photoScale = useSharedValue(1);
  const photoRotate = useSharedValue(4.94);
  const photoOpacity = useSharedValue(0);
  const photoBorderRadius = useSharedValue(32);

  const cardBottom = useSharedValue(-200);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(100);
  const dragTranslateY = useSharedValue(0);

  const textOpacity = useSharedValue(0);
  const textBlur = useSharedValue(10);

  // Start entrance animations
  React.useEffect(() => {
    // Title animation
    titleOpacity.value = withTiming(1, { duration: 600, easing: Easing.bezier(0.4, 0, 0.2, 1) });
    titleY.value = withTiming(0, { duration: 600, easing: Easing.bezier(0.4, 0, 0.2, 1) });
    titleBlur.value = withTiming(0, { duration: 600, easing: Easing.bezier(0.4, 0, 0.2, 1) });

    // Shadow animation
    shadowOpacity.value = withTiming(1, { 
      duration: 600, 
      easing: Easing.bezier(0.4, 0, 0.2, 1) 
    });

    // Photo frame animation
    photoOpacity.value = withTiming(1, { 
      duration: 600, 
      easing: Easing.bezier(0.4, 0, 0.2, 1) 
    });

    // Card animation with floating effect
    cardOpacity.value = withTiming(1, { duration: 600, easing: Easing.bezier(0.4, 0, 0.2, 1) });
    cardTranslateY.value = withTiming(0, { duration: 600, easing: Easing.bezier(0.4, 0, 0.2, 1) });
    cardBottom.value = withRepeat(
      withSequence(
        withTiming(-190, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-200, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Text animations
    setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 400, easing: Easing.bezier(0.4, 0, 0.2, 1) });
      textBlur.value = withTiming(0, { duration: 400, easing: Easing.bezier(0.4, 0, 0.2, 1) });
    }, 700);
  }, []);

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to add photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    Keyboard.dismiss();
    if (image || description) {
      setIsSaving(true);

      // Calculate final position in calendar grid
      const cols = 7;
      const rowIndex = Math.floor((currentDay - 1) / cols);
      const colIndex = (currentDay - 1) % cols;
      
      // Calendar layout: 7 columns, 16px gap, centered
      const thumbnailWidth = 32;
      const thumbnailHeight = 35;
      const gap = 16;
      const gridWidth = cols * thumbnailWidth + (cols - 1) * gap;
      const gridStartX = (SCREEN_WIDTH - gridWidth) / 2;
      
      // Calculate the actual position on screen
      // The grid starts at marginTop: 142, with rows spaced by (thumbnailHeight + gap)
      const finalLeft = gridStartX + colIndex * (thumbnailWidth + gap);
      const finalTop = 142 + rowIndex * (thumbnailHeight + gap);
      
      // Step 1: Animate title out
      titleOpacity.value = withTiming(0, { duration: 600, easing: Easing.bezier(0.4, 0, 0.2, 1) });
      titleBlur.value = withTiming(10, { duration: 600, easing: Easing.bezier(0.4, 0, 0.2, 1) });

      // Step 2: Animate photos to center with spring
      // BorderRadius: progressive across full animation span (800ms phase1 + 200ms gap + 1200ms phase2 = 2200ms)
      shadowBorderRadius.value = withTiming(10, { duration: 2200, easing: Easing.bezier(0.4, 0, 0.2, 1) });
      photoBorderRadius.value  = withTiming(10, { duration: 2200, easing: Easing.bezier(0.4, 0, 0.2, 1) });

      shadowLeft.value = withTiming(SCREEN_WIDTH / 2 - 159.887, { 
        duration: 800, 
        easing: Easing.bezier(0.34, 1.56, 0.64, 1) 
      });
      shadowTop.value = withTiming(300, { 
        duration: 800, 
        easing: Easing.bezier(0.34, 1.56, 0.64, 1) 
      });
      shadowScale.value = withTiming(1.1, { 
        duration: 800, 
        easing: Easing.bezier(0.34, 1.56, 0.64, 1) 
      });
      shadowRotate.value = withTiming(-3.5, { 
        duration: 800, 
        easing: Easing.bezier(0.34, 1.56, 0.64, 1) 
      });

      photoLeft.value = withTiming(SCREEN_WIDTH / 2 - 173.8825, { 
        duration: 800, 
        easing: Easing.bezier(0.34, 1.56, 0.64, 1) 
      });
      photoTop.value = withTiming(292, { 
        duration: 800, 
        easing: Easing.bezier(0.34, 1.56, 0.64, 1) 
      });
      photoScale.value = withTiming(1.1, { 
        duration: 800, 
        easing: Easing.bezier(0.34, 1.56, 0.64, 1) 
      });
      photoRotate.value = withTiming(7, { 
        duration: 800, 
        easing: Easing.bezier(0.34, 1.56, 0.64, 1) 
      });

      // Step 3: Animate card out
      cardBottom.value = withTiming(50, { duration: 500, easing: Easing.bezier(0.4, 0, 0.2, 1) });
      cardTranslateY.value = withTiming(100, { duration: 500, easing: Easing.bezier(0.4, 0, 0.2, 1) });
      cardOpacity.value = withTiming(0, { duration: 500, easing: Easing.bezier(0.4, 0, 0.2, 1) });

      // Step 4: After center animation, move to final calendar position
      setTimeout(() => {
        // Calculate scale factor: from current frame size to thumbnail size
        const currentPhotoWidth = 319;
        const currentPhotoHeight = 348;
        const scaleX = thumbnailWidth / currentPhotoWidth;
        const scaleY = thumbnailHeight / currentPhotoHeight;
        const finalScale = Math.min(scaleX, scaleY);
        
        // The containers have the frame centered inside them
        // Shadow container: 329.774 x 357.848, Photo container: 347.765 x 374.162
        // After scaling, we need to position the container so the scaled frame appears at finalLeft, finalTop
        const shadowContainerWidth = 329.774;
        const shadowContainerHeight = 357.848;
        const photoContainerWidth = 347.765;
        const photoContainerHeight = 374.162;
        
        // Calculate where the top-left of the container should be
        // so that the centered, scaled frame appears at the thumbnail position
        const scaledFrameWidth = currentPhotoWidth * finalScale;
        const scaledFrameHeight = currentPhotoHeight * finalScale;
        
        // Container positions (accounting for centered content and desired frame position)
        const shadowTargetLeft = finalLeft - (shadowContainerWidth - scaledFrameWidth) / 2;
        const shadowTargetTop = finalTop - (shadowContainerHeight - scaledFrameHeight) / 2;
        
        const photoTargetLeft = finalLeft - (photoContainerWidth - scaledFrameWidth) / 2;
        const photoTargetTop = finalTop - (photoContainerHeight - scaledFrameHeight) / 2;

        // Animate to calendar position
        shadowLeft.value = withTiming(shadowTargetLeft, { 
          duration: 1200, 
          easing: Easing.bezier(0.4, 0, 0.2, 1) 
        });
        shadowTop.value = withTiming(shadowTargetTop, { 
          duration: 1200, 
          easing: Easing.bezier(0.4, 0, 0.2, 1) 
        });
        shadowScale.value = withTiming(finalScale, { 
          duration: 1200, 
          easing: Easing.bezier(0.4, 0, 0.2, 1) 
        });
        shadowRotate.value = withTiming(-2, { 
          duration: 1200, 
          easing: Easing.bezier(0.4, 0, 0.2, 1) 
        });

        photoLeft.value = withTiming(photoTargetLeft, { 
          duration: 1200, 
          easing: Easing.bezier(0.4, 0, 0.2, 1) 
        });
        photoTop.value = withTiming(photoTargetTop, { 
          duration: 1200, 
          easing: Easing.bezier(0.4, 0, 0.2, 1) 
        });
        photoScale.value = withTiming(finalScale, { 
          duration: 1200, 
          easing: Easing.bezier(0.4, 0, 0.2, 1) 
        }, (finished) => {
          // After movement animation completes, immediately transition to calendar
          if (finished) {
            runOnJS(onSave)({ image, description });
          }
        });
        photoRotate.value = withTiming(3, { 
          duration: 1200, 
          easing: Easing.bezier(0.4, 0, 0.2, 1) 
        });
      }, 1000); // Start moving to calendar position 1s after center animation starts
    }
  };

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

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: isSaving ? withTiming(0, { duration: 600 }) : titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const shadowAnimatedStyle = useAnimatedStyle(() => ({
    left: shadowLeft.value,
    top: shadowTop.value,
    transform: [
      { scale: shadowScale.value },
      { rotate: `${shadowRotate.value}deg` },
    ],
    opacity: shadowOpacity.value,
  }));

  const photoAnimatedStyle = useAnimatedStyle(() => ({
    left: photoLeft.value,
    top: photoTop.value,
    transform: [
      { scale: photoScale.value },
      { rotate: `${photoRotate.value}deg` },
    ],
    opacity: photoOpacity.value,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    bottom: cardBottom.value,
    transform: [
      { translateY: cardTranslateY.value + dragTranslateY.value }
    ],
    opacity: cardOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const shadowBoxAnimatedStyle = useAnimatedStyle(() => ({
    borderRadius: shadowBorderRadius.value,
  }));

  const photoFrameAnimatedStyle = useAnimatedStyle(() => ({
    borderRadius: photoBorderRadius.value,
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
      {/* Title */}
      <Animated.Text style={[styles.title, titleAnimatedStyle]}>
        LifeNote · Day {currentDay}
      </Animated.Text>

      {/* Photo frame background shadow */}
      <Animated.View style={[styles.shadowContainer, shadowAnimatedStyle]}>
        <Animated.View style={[styles.shadowBox, shadowBoxAnimatedStyle]} />
      </Animated.View>

      {/* Photo frame with upload */}
      <Animated.View style={[styles.photoContainer, photoAnimatedStyle]}>
        <Animated.View style={[styles.photoFrame, photoFrameAnimatedStyle]}>
          <TouchableOpacity 
            style={styles.photoFrameButton}
            onPress={handleImageUpload}
            disabled={isSaving}
            activeOpacity={0.9}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.uploadedImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Text style={styles.uploadText}>Tap to add photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Note input card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cardContainer, cardAnimatedStyle]}>
          <TouchableOpacity 
            style={styles.card}
            activeOpacity={1}
            onPress={() => !isSaving && (isExpanded ? collapse() : expand())}
          >
            <Animated.View style={[styles.cardContent, textAnimatedStyle]}>
              <Text style={styles.cardTitle}>Add a note to your memory</Text>
              
              <View style={styles.linesContainer}>
                <NotebookLines />
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="What happened today?"
                  placeholderTextColor="rgba(90, 74, 53, 0.3)"
                  multiline
                  style={styles.textArea}
                  editable={!isSaving}
                  onFocus={() => expand()}
                />
              </View>
            </Animated.View>

            {/* Action buttons */}
            {!isSaving && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={onCancel}
                  style={styles.cancelButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={!image && !description}
                  style={[
                    styles.saveButton,
                    (!image && !description) && styles.saveButtonDisabled
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
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
  },
  photoContainer: {
    position: 'absolute',
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
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoFrameButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadedImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
  },
  uploadPlaceholder: {
    padding: 24,
  },
  uploadText: {
    fontFamily: 'DMMono-Regular',
    fontSize: 12,
    color: '#5a4a35',
    textAlign: 'center',
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
  saveButtonDisabled: {
    opacity: 0.3,
  },
  saveButtonText: {
    fontFamily: 'DMMono-Regular',
    fontSize: 12,
    color: 'white',
  },
});
