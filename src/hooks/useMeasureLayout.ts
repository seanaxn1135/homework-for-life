import { useRef } from "react"
import { LayoutRectangle, View } from "react-native"

/**
 * Custom hook to provide a ref and a function to measure layout for a component.
 * @returns { ref, measureLayout }
 */
export function useMeasureLayout<T extends View>() {
  const ref = useRef<T>(null)
  const measureLayout = (callback: (layout: LayoutRectangle) => void) => {
    if (!ref.current) return
    ref.current.measure(
      (
        x: number,
        y: number,
        width: number,
        height: number,
        pageX: number,
        pageY: number
      ) => {
        callback({ x: pageX, y: pageY, width, height })
      }
    )
  }
  return { ref, measureLayout }
}
