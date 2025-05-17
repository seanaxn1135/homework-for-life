import { useRef, useEffect } from "react"
import { Animated, Dimensions, LayoutRectangle } from "react-native"

// Common animation configurations
const OPEN_ANIMATION_CONFIG = {
  duration: 300,
  useNativeDriver: true,
}

const CLOSE_ANIMATION_CONFIG = {
  duration: 200,
  useNativeDriver: true,
}

/**
 * Custom hook for handling modal open/close animations with optional source position for transform origin.
 * @param visible Whether the modal is visible
 * @param sourcePosition Optional LayoutRectangle for animating from a source position
 */
export function useModalAnimation(
  visible: boolean,
  sourcePosition: LayoutRectangle | null
) {
  const { height: screenHeight, width: screenWidth } = Dimensions.get("window")
  const animateScale = useRef(new Animated.Value(0)).current
  const animateOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      animateScale.setValue(0)
      animateOpacity.setValue(0)
      Animated.parallel([
        Animated.timing(animateScale, {
          toValue: 1,
          ...OPEN_ANIMATION_CONFIG,
        }),
        Animated.timing(animateOpacity, {
          toValue: 1,
          ...OPEN_ANIMATION_CONFIG,
        }),
      ]).start()
    }
  }, [visible, animateScale, animateOpacity])

  const animateClose = (onComplete: () => void) => {
    Animated.parallel([
      Animated.timing(animateScale, {
        toValue: 0,
        ...CLOSE_ANIMATION_CONFIG,
      }),
      Animated.timing(animateOpacity, {
        toValue: 0,
        ...CLOSE_ANIMATION_CONFIG,
      }),
    ]).start(onComplete)
  }

  // Get scaling animation interpolation
  const getScaleInterpolation = () => {
    return animateScale.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    })
  }

  // Get transform from source position (when modal opens from a specific UI element)
  const getSourcePositionTransform = () => {
    if (!sourcePosition) return null

    const centerX = screenWidth / 2
    const centerY = screenHeight / 2
    const sourceX = sourcePosition.x + sourcePosition.width / 2
    const sourceY = sourcePosition.y + sourcePosition.height / 2

    const translateX = animateScale.interpolate({
      inputRange: [0, 1],
      outputRange: [sourceX - centerX, 0],
    })

    const translateY = animateScale.interpolate({
      inputRange: [0, 1],
      outputRange: [sourceY - centerY, 0],
    })

    return [{ translateX }, { translateY }]
  }

  // Get default center transform (when modal appears from center of screen)
  const getDefaultTransform = () => {
    return [
      {
        translateY: animateScale.interpolate({
          inputRange: [0, 1],
          outputRange: [screenHeight * 0.2, 0],
        }),
      },
    ]
  }

  const getAnimatedContentStyle = () => {
    const scale = getScaleInterpolation()
    const sourceTransform = getSourcePositionTransform()

    return {
      opacity: animateOpacity,
      transform: [...(sourceTransform || getDefaultTransform()), { scale }],
    }
  }

  return {
    animateOpacity,
    animateScale,
    getAnimatedContentStyle,
    animateClose,
  }
}
