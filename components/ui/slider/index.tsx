'use client';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import React from 'react';
import {
  Insets,
  LayoutChangeEvent,
  PanResponder,
  Platform,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

const sliderStyle = tva({
  base: 'justify-center relative py-2 data-[disabled=true]:opacity-40 data-[disabled=true]:web:pointer-events-none',
  variants: {
    orientation: {
      horizontal: 'w-full',
      vertical: 'h-full',
    },
    isReversed: {
      true: '',
      false: '',
    },
  },
});

const sliderThumbStyle = tva({
  base: 'bg-white border border-primary ring-ring/50 absolute rounded-full shadow-sm web:cursor-pointer h-4 w-4',
});

const sliderTrackStyle = tva({
  base: 'bg-muted rounded-full overflow-hidden',
  parentVariants: {
    orientation: {
      horizontal: 'w-full h-1.5 flex-row',
      vertical: 'h-full w-1.5 flex-col-reverse',
    },
    isReversed: {
      true: '',
      false: '',
    },
  },
});

const sliderFilledTrackStyle = tva({
  base: 'bg-primary',
  parentVariants: {
    orientation: {
      horizontal: 'h-full',
      vertical: 'w-full',
    },
  },
});

type SliderContextValue = {
  value: number;
  minValue: number;
  maxValue: number;
  step: number;
  orientation: 'horizontal' | 'vertical';
  isReversed: boolean;
  isDisabled: boolean;
  percent: number;
  isDragging: boolean;
  trackRef: React.RefObject<View | null>;
  onTrackLayout: (e: LayoutChangeEvent) => void;
};

const SliderContext = React.createContext<SliderContextValue>({
  value: 0,
  minValue: 0,
  maxValue: 100,
  step: 1,
  orientation: 'horizontal',
  isReversed: false,
  isDisabled: false,
  percent: 0,
  isDragging: false,
  trackRef: { current: null },
  onTrackLayout: () => {},
});

export type ISliderProps = {
  value?: number;
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  isDisabled?: boolean;
  isReversed?: boolean;
  orientation?: 'horizontal' | 'vertical';
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  onChangeStart?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  hitSlop?: Insets | number;
};

const Slider = React.forwardRef<View, ISliderProps>(function Slider(
  {
    value: controlledValue,
    defaultValue = 0,
    minValue = 0,
    maxValue = 100,
    step = 1,
    isDisabled = false,
    isReversed = false,
    orientation = 'horizontal',
    onChange,
    onChangeEnd,
    onChangeStart,
    className,
    style,
    children,
    ...props
  },
  forwardedRef
) {
  const isControlled = controlledValue !== undefined;
  const initialValue = isControlled ? controlledValue : defaultValue;
  const [internalValue, setInternalValue] = React.useState<number>(initialValue);
  const [isDragging, setIsDragging] = React.useState(false);

  // Sync internalValue when controlledValue changes from parent (when not dragging)
  React.useEffect(() => {
    if (isControlled && !isDragging) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue, isControlled, isDragging]);

  const activeValue = isControlled ? (isDragging ? internalValue : controlledValue) : internalValue;
  const clampedValue = Math.max(minValue, Math.min(maxValue, activeValue));
  const percent = maxValue > minValue ? (clampedValue - minValue) / (maxValue - minValue) : 0;

  const containerRef = React.useRef<View | null>(null);
  const trackRef = React.useRef<View | null>(null);
  const trackLayoutRef = React.useRef({ width: 0, height: 0, x: 0, y: 0 });
  const trackWindowRef = React.useRef({ x: 0, y: 0, width: 0, height: 0 });
  const isDraggingRef = React.useRef(false);
  const lastValueRef = React.useRef(clampedValue);

  const propsRef = React.useRef({
    value: clampedValue,
    minValue,
    maxValue,
    step,
    isDisabled,
    isReversed,
    orientation,
    onChange,
    onChangeEnd,
    onChangeStart,
  });

  React.useEffect(() => {
    propsRef.current = {
      value: clampedValue,
      minValue,
      maxValue,
      step,
      isDisabled,
      isReversed,
      orientation,
      onChange,
      onChangeEnd,
      onChangeStart,
    };
  });

  const measureTrack = React.useCallback(() => {
    trackRef.current?.measureInWindow((x, y, w, h) => {
      if (w > 0 || h > 0) {
        trackWindowRef.current = { x, y, width: w, height: h };
      }
    });
  }, []);

  const handleTrackLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      const { width, height, x, y } = e.nativeEvent.layout;
      trackLayoutRef.current = { width, height, x, y };
      measureTrack();
    },
    [measureTrack]
  );

  const calculateValueFromCoords = React.useCallback(
    (pageX: number, pageY: number, locationX?: number, locationY?: number) => {
      const {
        minValue: min,
        maxValue: max,
        step: s,
        isReversed: rev,
        orientation: ori,
      } = propsRef.current;
      const isVertical = ori === 'vertical';

      let size = isVertical
        ? trackWindowRef.current.height || trackLayoutRef.current.height
        : trackWindowRef.current.width || trackLayoutRef.current.width;

      if (size <= 0) {
        return propsRef.current.value ?? min;
      }

      let offset = 0;
      if (isVertical) {
        if (trackWindowRef.current.height > 0) {
          offset = pageY - trackWindowRef.current.y;
        } else if (locationY !== undefined) {
          offset = locationY;
        }
      } else {
        if (trackWindowRef.current.width > 0) {
          offset = pageX - trackWindowRef.current.x;
        } else if (locationX !== undefined) {
          offset = locationX;
        }
      }

      let rawPercent = Math.max(0, Math.min(1, offset / size));

      if (isVertical) {
        rawPercent = rev ? rawPercent : 1 - rawPercent;
      } else {
        rawPercent = rev ? 1 - rawPercent : rawPercent;
      }

      const rawVal = min + rawPercent * (max - min);
      const steppedVal = Math.round((rawVal - min) / s) * s + min;
      return Math.max(min, Math.min(max, steppedVal));
    },
    []
  );

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !propsRef.current.isDisabled,
      onStartShouldSetPanResponderCapture: () => !propsRef.current.isDisabled,
      onMoveShouldSetPanResponder: (_evt, gs) => {
        if (propsRef.current.isDisabled) return false;
        const isVertical = propsRef.current.orientation === 'vertical';
        return isVertical ? Math.abs(gs.dy) > 0 : Math.abs(gs.dx) > 0;
      },
      onMoveShouldSetPanResponderCapture: (_evt, gs) => {
        if (propsRef.current.isDisabled) return false;
        const isVertical = propsRef.current.orientation === 'vertical';
        return isVertical ? Math.abs(gs.dy) > 0 : Math.abs(gs.dx) > 0;
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (evt) => {
        if (propsRef.current.isDisabled) return;
        isDraggingRef.current = true;
        setIsDragging(true);
        propsRef.current.onChangeStart?.();

        measureTrack();

        const { pageX, pageY, locationX, locationY } = evt.nativeEvent;
        const newVal = calculateValueFromCoords(pageX, pageY, locationX, locationY);
        setInternalValue(newVal);
        lastValueRef.current = newVal;
        propsRef.current.onChange?.(newVal);
      },
      onPanResponderMove: (evt) => {
        if (propsRef.current.isDisabled || !isDraggingRef.current) return;
        const { pageX, pageY } = evt.nativeEvent;
        const newVal = calculateValueFromCoords(pageX, pageY);

        setInternalValue(newVal);
        if (newVal !== lastValueRef.current) {
          lastValueRef.current = newVal;
          propsRef.current.onChange?.(newVal);
        }
      },
      onPanResponderRelease: (evt) => {
        if (propsRef.current.isDisabled || !isDraggingRef.current) return;
        isDraggingRef.current = false;
        setIsDragging(false);

        const { pageX, pageY } = evt.nativeEvent;
        const finalVal = calculateValueFromCoords(pageX, pageY);
        setInternalValue(finalVal);
        lastValueRef.current = finalVal;
        propsRef.current.onChange?.(finalVal);
        propsRef.current.onChangeEnd?.(finalVal);
      },
      onPanResponderTerminate: () => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        setIsDragging(false);
        propsRef.current.onChangeEnd?.(lastValueRef.current);
      },
    })
  ).current;

  const webProps = React.useMemo(() => {
    if (Platform.OS !== 'web') return {};
    return {
      onPointerDown: (e: any) => {
        if (propsRef.current.isDisabled) return;
        try {
          e.currentTarget?.setPointerCapture?.(e.pointerId);
        } catch (_) {}
        isDraggingRef.current = true;
        setIsDragging(true);
        propsRef.current.onChangeStart?.();
        measureTrack();
        const newVal = calculateValueFromCoords(e.clientX, e.clientY);
        setInternalValue(newVal);
        lastValueRef.current = newVal;
        propsRef.current.onChange?.(newVal);
      },
      onPointerMove: (e: any) => {
        if (propsRef.current.isDisabled || !isDraggingRef.current) return;
        const newVal = calculateValueFromCoords(e.clientX, e.clientY);
        setInternalValue(newVal);
        if (newVal !== lastValueRef.current) {
          lastValueRef.current = newVal;
          propsRef.current.onChange?.(newVal);
        }
      },
      onPointerUp: (e: any) => {
        if (propsRef.current.isDisabled || !isDraggingRef.current) return;
        try {
          e.currentTarget?.releasePointerCapture?.(e.pointerId);
        } catch (_) {}
        isDraggingRef.current = false;
        setIsDragging(false);
        const finalVal = calculateValueFromCoords(e.clientX, e.clientY);
        setInternalValue(finalVal);
        lastValueRef.current = finalVal;
        propsRef.current.onChange?.(finalVal);
        propsRef.current.onChangeEnd?.(finalVal);
      },
    };
  }, [calculateValueFromCoords, measureTrack]);

  const contextValue: SliderContextValue = React.useMemo(
    () => ({
      value: clampedValue,
      minValue,
      maxValue,
      step,
      orientation,
      isReversed,
      isDisabled,
      percent,
      isDragging,
      trackRef,
      onTrackLayout: handleTrackLayout,
    }),
    [
      clampedValue,
      minValue,
      maxValue,
      step,
      orientation,
      isReversed,
      isDisabled,
      percent,
      isDragging,
      handleTrackLayout,
    ]
  );

  return (
    <SliderContext.Provider value={contextValue}>
      <View
        ref={(node) => {
          containerRef.current = node;
          if (typeof forwardedRef === 'function') {
            forwardedRef(node);
          } else if (forwardedRef) {
            (forwardedRef as any).current = node;
          }
        }}
        className={sliderStyle({
          orientation,
          isReversed,
          class: className,
        })}
        style={[
          {
            position: 'relative',
            justifyContent: 'center',
            ...(Platform.OS === 'web' ? { userSelect: 'none' as const } : {}),
          },
          style,
        ]}
        {...panResponder.panHandlers}
        {...webProps}
        {...props}
      >
        {children}
      </View>
    </SliderContext.Provider>
  );
});

export type ISliderTrackProps = {
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

const SliderTrack = React.forwardRef<View, ISliderTrackProps>(
  function SliderTrack({ className, style, children, ...props }, ref) {
    const { onTrackLayout, trackRef, orientation, isReversed } = React.useContext(SliderContext);

    return (
      <View
        ref={(node) => {
          (trackRef as any).current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            (ref as any).current = node;
          }
        }}
        onLayout={onTrackLayout}
        pointerEvents="none"
        className={sliderTrackStyle({
          parentVariants: {
            orientation,
            isReversed,
          },
          class: className,
        })}
        style={style}
        {...props}
      >
        {children}
      </View>
    );
  }
);

export type ISliderFilledTrackProps = {
  className?: string;
  style?: StyleProp<ViewStyle>;
};

const SliderFilledTrack = React.forwardRef<View, ISliderFilledTrackProps>(
  function SliderFilledTrack({ className, style, ...props }, ref) {
    const { percent, orientation, isReversed } = React.useContext(SliderContext);
    const isVertical = orientation === 'vertical';
    const displayPercent = isReversed ? 1 - percent : percent;

    const dimensionStyle = isVertical
      ? { height: `${displayPercent * 100}%` as any, width: '100%' as any }
      : { width: `${displayPercent * 100}%` as any, height: '100%' as any };

    return (
      <View
        ref={ref}
        pointerEvents="none"
        className={sliderFilledTrackStyle({
          parentVariants: { orientation },
          class: className,
        })}
        style={[dimensionStyle, style]}
        {...props}
      />
    );
  }
);

export type ISliderThumbProps = {
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

const SliderThumb = React.forwardRef<View, ISliderThumbProps>(
  function SliderThumb({ className, style, children, ...props }, ref) {
    const { percent, orientation, isReversed } = React.useContext(SliderContext);
    const [thumbSize, setThumbSize] = React.useState({ width: 20, height: 20 });
    const isVertical = orientation === 'vertical';

    const handleLayout = (e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      if (width > 0 && height > 0) {
        setThumbSize({ width, height });
      }
    };

    const displayPercent = isReversed ? 1 - percent : percent;

    const thumbPositionStyle = isVertical
      ? {
          position: 'absolute' as const,
          bottom: `${displayPercent * 100}%` as any,
          left: '50%' as any,
          transform: [
            { translateX: -thumbSize.width / 2 },
            { translateY: thumbSize.height / 2 },
          ],
        }
      : {
          position: 'absolute' as const,
          left: `${displayPercent * 100}%` as any,
          top: '50%' as any,
          transform: [
            { translateX: -thumbSize.width / 2 },
            { translateY: -thumbSize.height / 2 },
          ],
        };

    return (
      <View
        ref={ref}
        onLayout={handleLayout}
        pointerEvents="none"
        className={sliderThumbStyle({ class: className })}
        style={[thumbPositionStyle, style]}
        {...props}
      >
        {children}
      </View>
    );
  }
);

// Backward compatibility alias if needed
export const UISlider = Slider as any;

export { Slider, SliderFilledTrack, SliderThumb, SliderTrack };
