'use strict';

var React2 = require('react');
var ReactNative = require('react-native');
var shim = require('use-sync-external-store/shim');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var React2__namespace = /*#__PURE__*/_interopNamespace(React2);
var ReactNative__namespace = /*#__PURE__*/_interopNamespace(ReactNative);

// src/components/LegendList.tsx
ReactNative.Animated.View;
var View = ReactNative.View;
var Text = ReactNative.Text;
var Platform = ReactNative.Platform;
var PlatformAdjustBreaksScroll = Platform.OS === "android";

// src/utils/rtl.ts
function clampHorizontalOffset(offset, maxOffset) {
  if (maxOffset === void 0) {
    return offset;
  }
  return Math.max(0, Math.min(maxOffset, offset));
}
function getHorizontalMaxOffset(state, contentWidth) {
  if (contentWidth === void 0 || !Number.isFinite(contentWidth) || !Number.isFinite(state.scrollLength) || contentWidth <= state.scrollLength) {
    return contentWidth !== void 0 && Number.isFinite(contentWidth) && Number.isFinite(state.scrollLength) ? 0 : void 0;
  }
  return Math.max(0, contentWidth - state.scrollLength);
}
function getDefaultHorizontalRTLScrollType() {
  return Platform.OS === "web" ? "normal" : "inverted";
}
function getNativeHorizontalRTLScrollType(state) {
  var _a3;
  return (_a3 = state == null ? void 0 : state.horizontalRTLScrollType) != null ? _a3 : getDefaultHorizontalRTLScrollType();
}
function isRTLProps(props) {
  var _a3;
  return (_a3 = props == null ? void 0 : props.rtl) != null ? _a3 : !!ReactNative.I18nManager.isRTL;
}
function isHorizontalRTL(state) {
  return isHorizontalRTLProps(state == null ? void 0 : state.props);
}
function isHorizontalRTLProps(props) {
  return !!(props == null ? void 0 : props.horizontal) && isRTLProps(props);
}
function getLogicalHorizontalMaxOffset(state, contentWidth) {
  var _a3;
  return (_a3 = getHorizontalMaxOffset(state, contentWidth)) != null ? _a3 : 0;
}
function getHorizontalInsetEnd(state, inset) {
  if (!inset) {
    return 0;
  }
  return (isHorizontalRTL(state) ? inset.left : inset.right) || 0;
}
function toPhysicalHorizontalItemPosition(state, logicalPosition, itemSize, listSize) {
  if (!isHorizontalRTL(state) || listSize === void 0 || !Number.isFinite(listSize)) {
    return logicalPosition;
  }
  return Math.max(0, listSize - logicalPosition - itemSize);
}
function toNativeHorizontalOffset(state, logicalOffset, contentWidth) {
  if (!state || !isHorizontalRTL(state)) {
    return logicalOffset;
  }
  const maxOffset = getHorizontalMaxOffset(state, contentWidth);
  const clampedLogicalOffset = clampHorizontalOffset(logicalOffset, maxOffset);
  const mode = getNativeHorizontalRTLScrollType(state);
  if (mode === "negative") {
    return clampedLogicalOffset === 0 ? 0 : -clampedLogicalOffset;
  }
  if (mode === "inverted") {
    if (maxOffset === void 0) {
      return clampedLogicalOffset;
    }
    return clampHorizontalOffset(maxOffset - clampedLogicalOffset, maxOffset);
  }
  return clampedLogicalOffset;
}
function toLogicalHorizontalOffset(state, rawOffset, contentWidth) {
  if (!isHorizontalRTL(state)) {
    state.horizontalRTLScrollType = void 0;
    return rawOffset;
  }
  const maxOffset = getHorizontalMaxOffset(state, contentWidth);
  if (rawOffset < 0) {
    state.horizontalRTLScrollType = "negative";
    return clampHorizontalOffset(-rawOffset, maxOffset);
  }
  if (maxOffset === void 0) {
    return rawOffset;
  }
  const normalOffset = rawOffset;
  const invertedOffset = maxOffset - rawOffset;
  if (!Number.isFinite(invertedOffset)) {
    state.horizontalRTLScrollType = "normal";
    return normalOffset;
  }
  const previousMode = state.horizontalRTLScrollType;
  if (previousMode === "inverted") {
    return clampHorizontalOffset(invertedOffset, maxOffset);
  }
  if (previousMode === "normal") {
    return clampHorizontalOffset(normalOffset, maxOffset);
  }
  if (!state.hasScrolled) {
    const defaultMode = getDefaultHorizontalRTLScrollType();
    state.horizontalRTLScrollType = defaultMode;
    return clampHorizontalOffset(defaultMode === "inverted" ? invertedOffset : normalOffset, maxOffset);
  }
  const referenceScroll = state.scroll;
  const distanceNormal = Math.abs(normalOffset - referenceScroll);
  const distanceInverted = Math.abs(invertedOffset - referenceScroll);
  const useInverted = distanceInverted + 0.5 < distanceNormal;
  state.horizontalRTLScrollType = useInverted ? "inverted" : "normal";
  return clampHorizontalOffset(useInverted ? invertedOffset : normalOffset, maxOffset);
}
var createAnimatedValue = (value) => new ReactNative.Animated.Value(value);

// src/state/state.tsx
var ContextState = React2__namespace.createContext(null);
var contextNum = 0;
function StateProvider({ children }) {
  const [value] = React2__namespace.useState(() => ({
    animatedScrollY: createAnimatedValue(0),
    columnWrapperStyle: void 0,
    containerLayoutTriggers: /* @__PURE__ */ new Map(),
    contextNum: contextNum++,
    listeners: /* @__PURE__ */ new Map(),
    mapViewabilityAmountCallbacks: /* @__PURE__ */ new Map(),
    mapViewabilityAmountValues: /* @__PURE__ */ new Map(),
    mapViewabilityCallbacks: /* @__PURE__ */ new Map(),
    mapViewabilityConfigStates: /* @__PURE__ */ new Map(),
    mapViewabilityValues: /* @__PURE__ */ new Map(),
    positionListeners: /* @__PURE__ */ new Map(),
    scrollAxisGap: 0,
    state: void 0,
    values: /* @__PURE__ */ new Map([
      ["alignItemsAtEndPadding", 0],
      ["stylePaddingTop", 0],
      ["headerSize", 0],
      ["numContainers", 0],
      ["activeStickyIndex", -1],
      ["isAtEnd", false],
      ["isAtStart", false],
      ["isNearEnd", false],
      ["isNearStart", false],
      ["isWithinMaintainScrollAtEndThreshold", false],
      ["adaptiveRender", "normal"],
      ["totalSize", 0],
      ["scrollAdjustPending", 0]
    ]),
    viewRefs: /* @__PURE__ */ new Map()
  }));
  return /* @__PURE__ */ React2__namespace.createElement(ContextState.Provider, { value }, children);
}
function useStateContext() {
  return React2__namespace.useContext(ContextState);
}
function createSelectorFunctionsArr(ctx, signalNames) {
  let lastValues = [];
  let lastSignalValues = [];
  return {
    get: () => {
      const currentValues = [];
      let hasChanged = false;
      for (let i = 0; i < signalNames.length; i++) {
        const value = peek$(ctx, signalNames[i]);
        currentValues.push(value);
        if (value !== lastSignalValues[i]) {
          hasChanged = true;
        }
      }
      lastSignalValues = currentValues;
      if (hasChanged) {
        lastValues = currentValues;
      }
      return lastValues;
    },
    subscribe: (cb) => {
      const listeners = [];
      for (const signalName of signalNames) {
        listeners.push(listen$(ctx, signalName, cb));
      }
      return () => {
        for (const listener of listeners) {
          listener();
        }
      };
    }
  };
}
function listen$(ctx, signalName, cb) {
  const { listeners } = ctx;
  let setListeners = listeners.get(signalName);
  if (!setListeners) {
    setListeners = /* @__PURE__ */ new Set();
    listeners.set(signalName, setListeners);
  }
  setListeners.add(cb);
  return () => setListeners.delete(cb);
}
function peek$(ctx, signalName) {
  const { values } = ctx;
  return values.get(signalName);
}
function set$(ctx, signalName, value) {
  const { listeners, values } = ctx;
  if (values.get(signalName) !== value) {
    values.set(signalName, value);
    const setListeners = listeners.get(signalName);
    if (setListeners) {
      for (const listener of setListeners) {
        listener(value);
      }
    }
  }
}
function listenPosition$(ctx, key, cb) {
  const { positionListeners } = ctx;
  let setListeners = positionListeners.get(key);
  if (!setListeners) {
    setListeners = /* @__PURE__ */ new Set();
    positionListeners.set(key, setListeners);
  }
  setListeners.add(cb);
  return () => setListeners.delete(cb);
}
function notifyPosition$(ctx, key, value) {
  const { positionListeners } = ctx;
  const setListeners = positionListeners.get(key);
  if (setListeners) {
    for (const listener of setListeners) {
      listener(value);
    }
  }
}
function useArr$(signalNames) {
  const ctx = React2__namespace.useContext(ContextState);
  const { subscribe, get } = React2__namespace.useMemo(() => createSelectorFunctionsArr(ctx, signalNames), [ctx, signalNames]);
  const value = shim.useSyncExternalStore(subscribe, get, get);
  return value;
}
function useSelector$(signalName, selector) {
  const ctx = React2__namespace.useContext(ContextState);
  const { subscribe, get } = React2__namespace.useMemo(() => createSelectorFunctionsArr(ctx, [signalName]), [ctx, signalName]);
  const getSelectedValue = React2__namespace.useCallback(() => selector(get()[0]), [get, selector]);
  const value = shim.useSyncExternalStore(subscribe, getSelectedValue, getSelectedValue);
  return value;
}

// src/state/getContentInsetEnd.ts
function getContentInsetEndAdjustmentEnd(adjustment) {
  return Math.max(0, adjustment != null ? adjustment : 0);
}
function getContentInsetEnd(ctx, contentInsetEndAdjustmentOverride) {
  var _a3, _b;
  const state = ctx.state;
  const { props } = state;
  const horizontal = props.horizontal;
  const contentInset = props.contentInset;
  const baseInset = contentInset != null ? contentInset : state.nativeContentInset;
  const baseEndInset = (horizontal ? getHorizontalInsetEnd(state, baseInset) : baseInset == null ? void 0 : baseInset.bottom) || 0;
  const contentInsetEndAdjustment = getContentInsetEndAdjustmentEnd(
    contentInsetEndAdjustmentOverride != null ? contentInsetEndAdjustmentOverride : props.contentInsetEndAdjustment
  );
  const anchoredEndSpaceSize = peek$(ctx, "anchoredEndSpaceSize");
  const anchoredEndInset = ((_a3 = props.anchoredEndSpace) == null ? void 0 : _a3.includeInEndInset) && anchoredEndSpaceSize ? anchoredEndSpaceSize : 0;
  const overrideInset = (_b = state.contentInsetOverride) != null ? _b : void 0;
  const adjustedBaseEndInset = baseEndInset + contentInsetEndAdjustment;
  if (overrideInset) {
    const mergedInset = { bottom: 0, left: 0, right: 0, ...baseInset, ...overrideInset };
    return Math.max(
      ((horizontal ? getHorizontalInsetEnd(state, mergedInset) : mergedInset.bottom) || 0) + contentInsetEndAdjustment,
      anchoredEndInset
    );
  }
  return Math.max(adjustedBaseEndInset, anchoredEndInset);
}

// src/state/getContentSize.ts
function getContentSize(ctx) {
  var _a3, _b;
  const { values, state } = ctx;
  const stylePaddingTop = values.get("stylePaddingTop") || 0;
  const stylePaddingBottom = state.props.stylePaddingBottom || 0;
  const alignItemsAtEndPadding = values.get("alignItemsAtEndPadding") || 0;
  const headerSize = values.get("headerSize") || 0;
  const footerSize = values.get("footerSize") || 0;
  const contentInsetBottom = getContentInsetEnd(ctx);
  const totalSize = (_b = (_a3 = state.pendingTotalSize) != null ? _a3 : state.totalSize) != null ? _b : values.get("totalSize");
  return headerSize + footerSize + totalSize + stylePaddingTop + alignItemsAtEndPadding + stylePaddingBottom + (contentInsetBottom || 0);
}

// src/components/DebugView.tsx
var DebugRow = ({ children }) => {
  return /* @__PURE__ */ React2__namespace.createElement(View, { style: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" } }, children);
};
React2__namespace.memo(function DebugView2() {
  const ctx = useStateContext();
  const [
    totalSize = 0,
    scrollAdjust = 0,
    rawScroll = 0,
    scroll = 0,
    _numContainers = 0,
    _numContainersPooled = 0,
    isAtEnd = false
  ] = useArr$([
    "totalSize",
    "scrollAdjust",
    "debugRawScroll",
    "debugComputedScroll",
    "numContainers",
    "numContainersPooled",
    "isAtEnd"
  ]);
  const contentSize = getContentSize(ctx);
  const [, forceUpdate] = React2.useReducer((x) => x + 1, 0);
  useInterval(() => {
    forceUpdate();
  }, 100);
  return /* @__PURE__ */ React2__namespace.createElement(
    View,
    {
      pointerEvents: "none",
      style: {
        // height: 100,
        backgroundColor: "#FFFFFFCC",
        borderRadius: 4,
        padding: 4,
        paddingBottom: 4,
        paddingLeft: 4,
        position: "absolute",
        right: 0,
        top: 0
      }
    },
    /* @__PURE__ */ React2__namespace.createElement(DebugRow, null, /* @__PURE__ */ React2__namespace.createElement(Text, null, "TotalSize:"), /* @__PURE__ */ React2__namespace.createElement(Text, null, totalSize.toFixed(2))),
    /* @__PURE__ */ React2__namespace.createElement(DebugRow, null, /* @__PURE__ */ React2__namespace.createElement(Text, null, "ContentSize:"), /* @__PURE__ */ React2__namespace.createElement(Text, null, contentSize.toFixed(2))),
    /* @__PURE__ */ React2__namespace.createElement(DebugRow, null, /* @__PURE__ */ React2__namespace.createElement(Text, null, "At end:"), /* @__PURE__ */ React2__namespace.createElement(Text, null, String(isAtEnd))),
    /* @__PURE__ */ React2__namespace.createElement(DebugRow, null, /* @__PURE__ */ React2__namespace.createElement(Text, null, "ScrollAdjust:"), /* @__PURE__ */ React2__namespace.createElement(Text, null, scrollAdjust.toFixed(2))),
    /* @__PURE__ */ React2__namespace.createElement(DebugRow, null, /* @__PURE__ */ React2__namespace.createElement(Text, null, "RawScroll: "), /* @__PURE__ */ React2__namespace.createElement(Text, null, rawScroll.toFixed(2))),
    /* @__PURE__ */ React2__namespace.createElement(DebugRow, null, /* @__PURE__ */ React2__namespace.createElement(Text, null, "ComputedScroll: "), /* @__PURE__ */ React2__namespace.createElement(Text, null, scroll.toFixed(2)))
  );
});
function useInterval(callback, delay) {
  React2.useEffect(() => {
    const interval = setInterval(callback, delay);
    return () => clearInterval(interval);
  }, [delay]);
}

// src/components/stickyPositionUtils.ts
function getStickyPushLimit(state, index, itemKey) {
  if (!itemKey) {
    return void 0;
  }
  const currentSize = state.sizes.get(itemKey);
  if (!(currentSize && currentSize > 0)) {
    return void 0;
  }
  const stickyIndexInArray = state.props.stickyHeaderIndicesArr.indexOf(index);
  if (stickyIndexInArray === -1) {
    return void 0;
  }
  const nextStickyIndex = state.props.stickyHeaderIndicesArr[stickyIndexInArray + 1];
  if (nextStickyIndex === void 0) {
    return void 0;
  }
  const nextStickyPosition = state.positions[nextStickyIndex];
  if (nextStickyPosition === void 0) {
    return void 0;
  }
  return nextStickyPosition - currentSize;
}

// src/utils/devEnvironment.ts
var metroDev = typeof __DEV__ !== "undefined" ? __DEV__ : void 0;
var _a;
var envMode = typeof process !== "undefined" && typeof process.env === "object" && process.env ? (_a = process.env.NODE_ENV) != null ? _a : process.env.MODE : void 0;
var processDev = typeof envMode === "string" ? envMode.toLowerCase() !== "production" : void 0;
var _a2;
var IS_DEV = (_a2 = processDev != null ? processDev : metroDev) != null ? _a2 : false;

// src/constants.ts
var POSITION_OUT_OF_VIEW = -1e7;
var EDGE_POSITION_EPSILON = 1;
var ENABLE_DEVMODE = IS_DEV && false;
var ENABLE_DEBUG_VIEW = IS_DEV && false;

// src/constants-platform.native.ts
var f = global.nativeFabricUIManager;
var IsNewArchitecture = f !== void 0 && f != null;
var useAnimatedValue = (initialValue) => {
  const [animAnimatedValue] = React2.useState(() => new ReactNative.Animated.Value(initialValue));
  return animAnimatedValue;
};

// src/hooks/useValue$.ts
function useValue$(key, params) {
  const { getValue } = params || {};
  const ctx = useStateContext();
  const getNewValue = () => {
    var _a3;
    return (_a3 = getValue ? getValue(peek$(ctx, key)) : peek$(ctx, key)) != null ? _a3 : 0;
  };
  const animValue = useAnimatedValue(getNewValue());
  React2.useLayoutEffect(() => {
    const syncCurrentValue = () => {
      animValue.setValue(getNewValue());
    };
    const unsubscribe = listen$(ctx, key, syncCurrentValue);
    syncCurrentValue();
    return unsubscribe;
  }, [animValue, ctx, key]);
  return animValue;
}
var typedForwardRef = React2__namespace.forwardRef;
var typedMemo = React2__namespace.memo;
var getComponent = (Component) => {
  if (React2__namespace.isValidElement(Component)) {
    return Component;
  }
  if (Component) {
    return /* @__PURE__ */ React2__namespace.createElement(Component, null);
  }
  return null;
};

// src/components/PositionView.native.tsx
var PositionViewState = typedMemo(function PositionViewState2({
  id,
  horizontal,
  style,
  refView,
  ...rest
}) {
  const [position = POSITION_OUT_OF_VIEW, _itemKey] = useArr$([`containerPosition${id}`, `containerItemKey${id}`]);
  return /* @__PURE__ */ React2__namespace.createElement(ReactNative.View, { ref: refView, style: [style, horizontal ? { left: position } : { top: position }], ...rest });
});
var PositionViewAnimated = typedMemo(function PositionViewAnimated2({
  id,
  horizontal,
  style,
  refView,
  ...rest
}) {
  const position$ = useValue$(`containerPosition${id}`, {
    getValue: (v) => v != null ? v : POSITION_OUT_OF_VIEW
  });
  const position = horizontal ? { left: position$ } : { top: position$ };
  return /* @__PURE__ */ React2__namespace.createElement(ReactNative.Animated.View, { ref: refView, style: [style, position], ...rest });
});
var PositionViewSticky = typedMemo(function PositionViewSticky2({
  id,
  horizontal,
  style,
  refView,
  animatedScrollY,
  index,
  stickyHeaderConfig,
  children,
  ...rest
}) {
  const ctx = useStateContext();
  const [
    position = POSITION_OUT_OF_VIEW,
    alignItemsAtEndPadding = 0,
    headerSize = 0,
    stylePaddingTop = 0,
    itemKey,
    _totalSize = 0
  ] = useArr$([
    `containerPosition${id}`,
    "alignItemsAtEndPadding",
    "headerSize",
    "stylePaddingTop",
    `containerItemKey${id}`,
    "totalSize"
  ]);
  const pushLimit = React2__namespace.useMemo(
    () => getStickyPushLimit(ctx.state, index, itemKey),
    [ctx.state, index, itemKey, _totalSize]
  );
  const transform = React2__namespace.useMemo(() => {
    var _a3;
    if (animatedScrollY) {
      const stickyConfigOffset = (_a3 = stickyHeaderConfig == null ? void 0 : stickyHeaderConfig.offset) != null ? _a3 : 0;
      const stickyStart = position + headerSize + stylePaddingTop + alignItemsAtEndPadding - stickyConfigOffset;
      let nextStickyPosition;
      if (pushLimit !== void 0) {
        if (pushLimit <= position) {
          nextStickyPosition = pushLimit;
        } else {
          nextStickyPosition = animatedScrollY.interpolate({
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            inputRange: [stickyStart, stickyStart + (pushLimit - position)],
            outputRange: [position, pushLimit]
          });
        }
      } else {
        nextStickyPosition = animatedScrollY.interpolate({
          extrapolateLeft: "clamp",
          extrapolateRight: "extend",
          inputRange: [stickyStart, stickyStart + 5e3],
          outputRange: [position, position + 5e3]
        });
      }
      return horizontal ? [{ translateX: nextStickyPosition }] : [{ translateY: nextStickyPosition }];
    }
  }, [
    alignItemsAtEndPadding,
    animatedScrollY,
    headerSize,
    position,
    pushLimit,
    stylePaddingTop,
    stickyHeaderConfig == null ? void 0 : stickyHeaderConfig.offset
  ]);
  const viewStyle = React2__namespace.useMemo(() => [style, { zIndex: index + 1e3 }, { transform }], [style, transform]);
  const renderStickyHeaderBackdrop = React2__namespace.useMemo(() => {
    if (!(stickyHeaderConfig == null ? void 0 : stickyHeaderConfig.backdropComponent)) {
      return null;
    }
    return /* @__PURE__ */ React2__namespace.createElement(
      ReactNative.View,
      {
        style: {
          inset: 0,
          pointerEvents: "none",
          position: "absolute"
        }
      },
      getComponent(stickyHeaderConfig == null ? void 0 : stickyHeaderConfig.backdropComponent)
    );
  }, [stickyHeaderConfig == null ? void 0 : stickyHeaderConfig.backdropComponent]);
  return /* @__PURE__ */ React2__namespace.createElement(ReactNative.Animated.View, { ref: refView, style: viewStyle, ...rest }, renderStickyHeaderBackdrop, children);
});
var PositionView = IsNewArchitecture ? PositionViewState : PositionViewAnimated;
function useInit(cb) {
  React2.useState(() => cb());
}

// src/utils/helpers.ts
function isFunction(obj) {
  return typeof obj === "function";
}
function isArray(obj) {
  return Array.isArray(obj);
}
var warned = /* @__PURE__ */ new Set();
function warnDevOnce(id, text) {
  if (IS_DEV && !warned.has(id)) {
    warned.add(id);
    console.warn(`[legend-list] ${text}`);
  }
}
function roundSize(size) {
  return Math.floor(size * 8) / 8;
}
function isNullOrUndefined(value) {
  return value === null || value === void 0;
}
function getPadding(s, type) {
  var _a3, _b, _c;
  const axisPadding = type === "Left" || type === "Right" ? s.paddingHorizontal : s.paddingVertical;
  return (_c = (_b = (_a3 = s[`padding${type}`]) != null ? _a3 : axisPadding) != null ? _b : s.padding) != null ? _c : 0;
}
function extractPadding(style, contentContainerStyle, type) {
  return getPadding(style, type) + getPadding(contentContainerStyle, type);
}
function findContainerId(ctx, key) {
  var _a3, _b;
  const directMatch = (_b = (_a3 = ctx.state) == null ? void 0 : _a3.containerItemKeys) == null ? void 0 : _b.get(key);
  if (directMatch !== void 0) {
    return directMatch;
  }
  const numContainers = peek$(ctx, "numContainers");
  for (let i = 0; i < numContainers; i++) {
    const itemKey = peek$(ctx, `containerItemKey${i}`);
    if (itemKey === key) {
      return i;
    }
  }
  return -1;
}

// src/state/ContextContainer.ts
var ContextContainer = React2.createContext(null);
function useContextContainer() {
  return React2.useContext(ContextContainer);
}
function useAdaptiveRender() {
  const [mode] = useArr$(["adaptiveRender"]);
  return mode;
}
function useAdaptiveRenderChange(callback) {
  const ctx = useStateContext();
  const callbackRef = React2.useRef(callback);
  callbackRef.current = callback;
  React2.useLayoutEffect(() => {
    let mode = peek$(ctx, "adaptiveRender");
    return listen$(ctx, "adaptiveRender", (nextMode) => {
      if (mode !== nextMode) {
        mode = nextMode;
        callbackRef.current(nextMode);
      }
    });
  }, [ctx]);
}
function useViewability(callback, configId) {
  const ctx = useStateContext();
  const containerContext = useContextContainer();
  useInit(() => {
    if (!containerContext) {
      return;
    }
    const { containerId } = containerContext;
    const key = containerId + (configId != null ? configId : "");
    const value = ctx.mapViewabilityValues.get(key);
    if (value) {
      callback(value);
    }
  });
  React2.useEffect(() => {
    if (!containerContext) {
      return;
    }
    const { containerId } = containerContext;
    const key = containerId + (configId != null ? configId : "");
    ctx.mapViewabilityCallbacks.set(key, callback);
    return () => {
      ctx.mapViewabilityCallbacks.delete(key);
    };
  }, [ctx, callback, configId, containerContext]);
}
function useViewabilityAmount(callback) {
  const ctx = useStateContext();
  const containerContext = useContextContainer();
  useInit(() => {
    if (!containerContext) {
      return;
    }
    const { containerId } = containerContext;
    const value = ctx.mapViewabilityAmountValues.get(containerId);
    if (value) {
      callback(value);
    }
  });
  React2.useEffect(() => {
    if (!containerContext) {
      return;
    }
    const { containerId } = containerContext;
    ctx.mapViewabilityAmountCallbacks.set(containerId, callback);
    return () => {
      ctx.mapViewabilityAmountCallbacks.delete(containerId);
    };
  }, [ctx, callback, containerContext]);
}
function useRecyclingEffect(effect) {
  const containerContext = useContextContainer();
  const prevValues = React2.useRef({
    prevIndex: void 0,
    prevItem: void 0
  });
  React2.useEffect(() => {
    if (!containerContext) {
      return;
    }
    const { index, value } = containerContext;
    let ret;
    if (prevValues.current.prevIndex !== void 0 && prevValues.current.prevItem !== void 0) {
      ret = effect({
        index,
        item: value,
        prevIndex: prevValues.current.prevIndex,
        prevItem: prevValues.current.prevItem
      });
    }
    prevValues.current = {
      prevIndex: index,
      prevItem: value
    };
    return ret;
  }, [effect, containerContext]);
}
function useRecyclingState(valueOrFun) {
  var _a3, _b;
  const containerContext = useContextContainer();
  const computeValue = (ctx) => {
    if (isFunction(valueOrFun)) {
      const initializer = valueOrFun;
      return ctx ? initializer({
        index: ctx.index,
        item: ctx.value,
        prevIndex: void 0,
        prevItem: void 0
      }) : initializer();
    }
    return valueOrFun;
  };
  const [stateValue, setStateValue] = React2.useState(() => {
    return computeValue(containerContext);
  });
  const prevItemKeyRef = React2.useRef((_a3 = containerContext == null ? void 0 : containerContext.itemKey) != null ? _a3 : null);
  const currentItemKey = (_b = containerContext == null ? void 0 : containerContext.itemKey) != null ? _b : null;
  if (currentItemKey !== null && prevItemKeyRef.current !== currentItemKey) {
    prevItemKeyRef.current = currentItemKey;
    setStateValue(computeValue(containerContext));
  }
  const triggerLayout = containerContext == null ? void 0 : containerContext.triggerLayout;
  const setState = React2.useCallback(
    (newState) => {
      if (!triggerLayout) {
        return;
      }
      setStateValue((prevValue) => {
        return isFunction(newState) ? newState(prevValue) : newState;
      });
      triggerLayout();
    },
    [triggerLayout]
  );
  return [stateValue, setState];
}
function useIsLastItem() {
  const containerContext = useContextContainer();
  const isLast = useSelector$("lastItemKeys", (lastItemKeys) => {
    if (containerContext) {
      const { itemKey } = containerContext;
      if (!isNullOrUndefined(itemKey)) {
        return (lastItemKeys == null ? void 0 : lastItemKeys.includes(itemKey)) || false;
      }
    }
    return false;
  });
  return isLast;
}
function useListScrollSize() {
  const [scrollSize] = useArr$(["scrollSize"]);
  return scrollSize;
}
var noop = () => {
};
function useSyncLayout() {
  const containerContext = useContextContainer();
  if (IsNewArchitecture && containerContext) {
    const { triggerLayout: syncLayout } = containerContext;
    return syncLayout;
  } else {
    return noop;
  }
}

// src/components/Separator.tsx
function Separator({ ItemSeparatorComponent, leadingItem }) {
  const isLastItem = useIsLastItem();
  return isLastItem ? null : /* @__PURE__ */ React2__namespace.createElement(ItemSeparatorComponent, { leadingItem });
}

// src/core/deferredPublicOnScroll.ts
function withResolvedContentOffset(state, event, resolvedOffset) {
  return {
    ...event,
    nativeEvent: {
      ...event.nativeEvent,
      contentOffset: state.props.horizontal ? { x: resolvedOffset, y: 0 } : { x: 0, y: resolvedOffset }
    }
  };
}
function releaseDeferredPublicOnScroll(ctx, resolvedOffset) {
  var _a3, _b, _c, _d;
  const state = ctx.state;
  const deferredEvent = state.deferredPublicOnScrollEvent;
  state.deferredPublicOnScrollEvent = void 0;
  if (deferredEvent) {
    (_d = (_c = state.props).onScroll) == null ? void 0 : _d.call(
      _c,
      withResolvedContentOffset(
        state,
        deferredEvent,
        (_b = (_a3 = resolvedOffset != null ? resolvedOffset : state.scrollPending) != null ? _a3 : state.scroll) != null ? _b : 0
      )
    );
  }
}

// src/core/initialScrollSession.ts
var INITIAL_SCROLL_MIN_TARGET_OFFSET = 1;
function hasInitialScrollSessionCompletion(completion) {
  return !!((completion == null ? void 0 : completion.didDispatchNativeScroll) || (completion == null ? void 0 : completion.didRetrySilentInitialScroll) || (completion == null ? void 0 : completion.watchdog));
}
function clearInitialScrollSession(state) {
  state.initialScrollSession = void 0;
  return void 0;
}
function createInitialScrollSession(options) {
  const { bootstrap, completion, kind, previousDataLength } = options;
  return kind === "offset" ? {
    completion,
    kind,
    previousDataLength
  } : {
    bootstrap,
    completion,
    kind,
    previousDataLength
  };
}
function ensureInitialScrollSessionCompletion(state, kind = ((_b) => (_b = ((_a3) => (_a3 = state.initialScrollSession) == null ? void 0 : _a3.kind)()) != null ? _b : "bootstrap")()) {
  var _a4, _b2;
  if (!state.initialScrollSession) {
    state.initialScrollSession = createInitialScrollSession({
      completion: {},
      kind,
      previousDataLength: 0
    });
  } else if (state.initialScrollSession.kind !== kind) {
    state.initialScrollSession = createInitialScrollSession({
      bootstrap: state.initialScrollSession.kind === "bootstrap" ? state.initialScrollSession.bootstrap : void 0,
      completion: state.initialScrollSession.completion,
      kind,
      previousDataLength: state.initialScrollSession.previousDataLength
    });
  }
  (_b2 = (_a4 = state.initialScrollSession).completion) != null ? _b2 : _a4.completion = {};
  return state.initialScrollSession.completion;
}
var initialScrollCompletion = {
  didDispatchNativeScroll(state) {
    var _a3, _b;
    return !!((_b = (_a3 = state.initialScrollSession) == null ? void 0 : _a3.completion) == null ? void 0 : _b.didDispatchNativeScroll);
  },
  didRetrySilentInitialScroll(state) {
    var _a3, _b;
    return !!((_b = (_a3 = state.initialScrollSession) == null ? void 0 : _a3.completion) == null ? void 0 : _b.didRetrySilentInitialScroll);
  },
  markInitialScrollNativeDispatch(state) {
    ensureInitialScrollSessionCompletion(state).didDispatchNativeScroll = true;
  },
  markSilentInitialScrollRetry(state) {
    ensureInitialScrollSessionCompletion(state).didRetrySilentInitialScroll = true;
  },
  resetFlags(state) {
    if (!state.initialScrollSession) {
      return;
    }
    const completion = ensureInitialScrollSessionCompletion(state, state.initialScrollSession.kind);
    completion.didDispatchNativeScroll = void 0;
    completion.didRetrySilentInitialScroll = void 0;
  }
};
var initialScrollWatchdog = {
  clear(state) {
    initialScrollWatchdog.set(state, void 0);
  },
  didReachTarget(newScroll, watchdog) {
    const nextDistance = Math.abs(newScroll - watchdog.targetOffset);
    return nextDistance <= INITIAL_SCROLL_MIN_TARGET_OFFSET;
  },
  get(state) {
    var _a3, _b;
    return (_b = (_a3 = state.initialScrollSession) == null ? void 0 : _a3.completion) == null ? void 0 : _b.watchdog;
  },
  hasNonZeroTargetOffset(targetOffset) {
    return targetOffset !== void 0 && targetOffset > INITIAL_SCROLL_MIN_TARGET_OFFSET;
  },
  isAtZeroTargetOffset(targetOffset) {
    return targetOffset <= INITIAL_SCROLL_MIN_TARGET_OFFSET;
  },
  set(state, watchdog) {
    var _a3, _b;
    if (!watchdog && !((_b = (_a3 = state.initialScrollSession) == null ? void 0 : _a3.completion) == null ? void 0 : _b.watchdog)) {
      return;
    }
    const completion = ensureInitialScrollSessionCompletion(state);
    completion.watchdog = watchdog ? {
      startScroll: watchdog.startScroll,
      targetOffset: watchdog.targetOffset
    } : void 0;
  }
};
function setInitialScrollSession(state, options = {}) {
  var _a3, _b, _c, _d;
  const existingSession = state.initialScrollSession;
  const kind = (_a3 = options.kind) != null ? _a3 : existingSession == null ? void 0 : existingSession.kind;
  const completion = existingSession == null ? void 0 : existingSession.completion;
  const existingBootstrap = (existingSession == null ? void 0 : existingSession.kind) === "bootstrap" ? existingSession.bootstrap : void 0;
  const bootstrap = kind === "bootstrap" ? options.bootstrap === null ? void 0 : (_b = options.bootstrap) != null ? _b : existingBootstrap : void 0;
  if (!kind) {
    return clearInitialScrollSession(state);
  }
  if (!state.initialScroll && !bootstrap && !hasInitialScrollSessionCompletion(completion)) {
    return clearInitialScrollSession(state);
  }
  const previousDataLength = (_d = (_c = options.previousDataLength) != null ? _c : existingSession == null ? void 0 : existingSession.previousDataLength) != null ? _d : 0;
  state.initialScrollSession = createInitialScrollSession({
    bootstrap,
    completion,
    kind,
    previousDataLength
  });
  return state.initialScrollSession;
}

// src/utils/checkThreshold.ts
var HYSTERESIS_MULTIPLIER = 1.3;
var checkThreshold = (distance, atThreshold, threshold, wasReached, snapshot, context, onReached, setSnapshot, allowReentryOnChange) => {
  const absDistance = Math.abs(distance);
  const within = atThreshold || threshold > 0 && absDistance <= threshold;
  const updateSnapshot = () => {
    setSnapshot({
      atThreshold,
      contentSize: context.contentSize,
      dataLength: context.dataLength,
      scrollPosition: context.scrollPosition
    });
  };
  if (!wasReached) {
    if (!within) {
      return false;
    }
    onReached(distance);
    updateSnapshot();
    return true;
  }
  const reset = !atThreshold && threshold > 0 && absDistance >= threshold * HYSTERESIS_MULTIPLIER || !atThreshold && threshold <= 0 && absDistance > 0;
  if (reset) {
    setSnapshot(void 0);
    return false;
  }
  if (within) {
    const changed = !snapshot || snapshot.atThreshold !== atThreshold || snapshot.contentSize !== context.contentSize || snapshot.dataLength !== context.dataLength;
    if (changed) {
      if (allowReentryOnChange) {
        onReached(distance);
      }
      updateSnapshot();
    }
  }
  return true;
};

// src/utils/hasActiveInitialScroll.ts
function hasActiveInitialScroll(state) {
  return !!(state == null ? void 0 : state.initialScroll) && !state.didFinishInitialScroll;
}

// src/utils/checkAtBottom.ts
function checkAtBottom(ctx) {
  var _a3;
  const state = ctx.state;
  if (!state) {
    return;
  }
  const {
    queuedInitialLayout,
    scrollLength,
    scroll,
    maintainingScrollAtEnd,
    props: { maintainScrollAtEndThreshold, onEndReachedThreshold }
  } = state;
  const contentSize = getContentSize(ctx);
  if (contentSize > 0 && queuedInitialLayout) {
    const insetEnd = getContentInsetEnd(ctx);
    const distanceFromEnd = contentSize - scroll - scrollLength - insetEnd;
    const isContentLess = contentSize < scrollLength;
    set$(ctx, "isAtEnd", isContentLess || distanceFromEnd <= EDGE_POSITION_EPSILON);
    set$(ctx, "isNearEnd", isContentLess || distanceFromEnd <= onEndReachedThreshold * scrollLength);
    set$(
      ctx,
      "isWithinMaintainScrollAtEndThreshold",
      isContentLess || distanceFromEnd <= maintainScrollAtEndThreshold * scrollLength
    );
    const shouldSkipThresholdChecks = hasActiveInitialScroll(state) || maintainingScrollAtEnd;
    if (!shouldSkipThresholdChecks) {
      state.isEndReached = checkThreshold(
        distanceFromEnd,
        isContentLess,
        onEndReachedThreshold * scrollLength,
        state.isEndReached,
        state.endReachedSnapshot,
        {
          contentSize,
          dataLength: (_a3 = state.props.data) == null ? void 0 : _a3.length,
          scrollPosition: scroll
        },
        (distance) => {
          var _a4, _b;
          return (_b = (_a4 = state.props).onEndReached) == null ? void 0 : _b.call(_a4, { distanceFromEnd: distance });
        },
        (snapshot) => {
          state.endReachedSnapshot = snapshot;
        },
        true
      );
    }
  }
}

// src/utils/isInMVCPActiveMode.native.ts
function isInMVCPActiveMode(state) {
  return state.dataChangeNeedsScrollUpdate;
}

// src/utils/checkAtTop.ts
function checkAtTop(ctx) {
  const state = ctx == null ? void 0 : ctx.state;
  if (!state) {
    return;
  }
  const {
    dataChangeEpoch,
    isStartReached,
    props: { data, onStartReachedThreshold },
    scroll,
    scrollLength,
    startReachedSnapshot,
    startReachedSnapshotDataChangeEpoch,
    totalSize
  } = state;
  const dataLength = data.length;
  const threshold = onStartReachedThreshold * scrollLength;
  const dataChanged = startReachedSnapshotDataChangeEpoch !== dataChangeEpoch;
  const withinThreshold = threshold > 0 && Math.abs(scroll) <= threshold;
  const allowReentryOnDataChange = !!isStartReached && withinThreshold && !!dataChanged && !isInMVCPActiveMode(state);
  if (isStartReached && threshold > 0 && scroll > threshold && startReachedSnapshot && (dataChanged || startReachedSnapshot.contentSize !== totalSize || startReachedSnapshot.dataLength !== dataLength)) {
    state.isStartReached = false;
    state.startReachedSnapshot = void 0;
    state.startReachedSnapshotDataChangeEpoch = void 0;
  }
  set$(ctx, "isAtStart", scroll <= EDGE_POSITION_EPSILON);
  set$(ctx, "isNearStart", scroll <= threshold);
  const shouldSkipThresholdChecks = hasActiveInitialScroll(state) || !!state.scrollingTo;
  const shouldDeferDataChangeRefire = isStartReached && withinThreshold && dataChanged && !allowReentryOnDataChange;
  if (!shouldSkipThresholdChecks && !shouldDeferDataChangeRefire) {
    state.isStartReached = checkThreshold(
      scroll,
      false,
      threshold,
      state.isStartReached,
      allowReentryOnDataChange ? void 0 : startReachedSnapshot,
      {
        contentSize: totalSize,
        dataLength,
        scrollPosition: scroll
      },
      (distance) => {
        var _a3, _b;
        return (_b = (_a3 = state.props).onStartReached) == null ? void 0 : _b.call(_a3, { distanceFromStart: distance });
      },
      (snapshot) => {
        state.startReachedSnapshot = snapshot;
        state.startReachedSnapshotDataChangeEpoch = snapshot ? dataChangeEpoch : void 0;
      },
      allowReentryOnDataChange
    );
  }
}

// src/utils/checkThresholds.ts
function checkThresholds(ctx) {
  checkAtBottom(ctx);
  checkAtTop(ctx);
}

// src/core/recalculateSettledScroll.ts
function recalculateSettledScroll(ctx) {
  var _a3, _b;
  const state = ctx.state;
  if ((_a3 = state.props) == null ? void 0 : _a3.data) {
    (_b = state.triggerCalculateItemsInView) == null ? void 0 : _b.call(state, { forceFullItemPositions: true });
  }
  checkThresholds(ctx);
}

// src/core/adaptiveRender.ts
var DEFAULT_ADAPTIVE_RENDER_ENTER_VELOCITY = 3;
var DEFAULT_ADAPTIVE_RENDER_EXIT_VELOCITY = 1;
var DEFAULT_ADAPTIVE_RENDER_EXIT_DELAY = 250;
var DEFAULT_WEB_ADAPTIVE_RENDER_ENTER_VELOCITY = 6;
var DEFAULT_WEB_ADAPTIVE_RENDER_EXIT_VELOCITY = 3;
var DEFAULT_WEB_ADAPTIVE_RENDER_EXIT_DELAY = 250;
function clearAdaptiveRenderExitTimeout(ctx) {
  const state = ctx.state;
  const previousTimeout = state.timeoutAdaptiveRender;
  if (previousTimeout !== void 0) {
    clearTimeout(previousTimeout);
    state.timeouts.delete(previousTimeout);
    state.timeoutAdaptiveRender = void 0;
  }
}
function scheduleAdaptiveRenderExit(ctx, exitDelay) {
  const state = ctx.state;
  clearAdaptiveRenderExitTimeout(ctx);
  if (exitDelay <= 0) {
    setAdaptiveRender(ctx, "normal", "scroll");
  } else {
    const timeout = setTimeout(() => {
      state.timeouts.delete(timeout);
      state.timeoutAdaptiveRender = void 0;
      setAdaptiveRender(ctx, "normal", "scroll");
    }, exitDelay);
    state.timeoutAdaptiveRender = timeout;
    state.timeouts.add(timeout);
  }
}
function setAdaptiveRender(ctx, mode, reason) {
  var _a3, _b;
  const previousMode = peek$(ctx, "adaptiveRender");
  if (previousMode !== mode) {
    set$(ctx, "adaptiveRender", mode);
    (_b = (_a3 = ctx.state.props.adaptiveRender) == null ? void 0 : _a3.onChange) == null ? void 0 : _b.call(_a3, mode, reason);
  }
}
function resetAdaptiveRender(ctx) {
  var _a3, _b;
  clearAdaptiveRenderExitTimeout(ctx);
  const mode = (_b = (_a3 = ctx.state.props.adaptiveRender) == null ? void 0 : _a3.initialMode) != null ? _b : "normal";
  if (peek$(ctx, "adaptiveRender") !== mode) {
    setAdaptiveRender(ctx, mode, "initial");
  }
}
function updateAdaptiveRender(ctx, scrollVelocity, options) {
  var _a3, _b, _c;
  const state = ctx.state;
  const adaptiveRender = state.props.adaptiveRender;
  const currentMode = peek$(ctx, "adaptiveRender");
  if (peek$(ctx, "readyToRender")) {
    if (adaptiveRender) {
      const isWeb = Platform.OS === "web";
      const enterVelocity = (_a3 = adaptiveRender.enterVelocity) != null ? _a3 : isWeb ? DEFAULT_WEB_ADAPTIVE_RENDER_ENTER_VELOCITY : DEFAULT_ADAPTIVE_RENDER_ENTER_VELOCITY;
      const exitVelocity = (_b = adaptiveRender.exitVelocity) != null ? _b : isWeb ? DEFAULT_WEB_ADAPTIVE_RENDER_EXIT_VELOCITY : DEFAULT_ADAPTIVE_RENDER_EXIT_VELOCITY;
      const exitDelay = (_c = adaptiveRender.exitDelay) != null ? _c : isWeb ? DEFAULT_WEB_ADAPTIVE_RENDER_EXIT_DELAY : DEFAULT_ADAPTIVE_RENDER_EXIT_DELAY;
      const threshold = currentMode === "light" ? exitVelocity : enterVelocity;
      const nextMode = (options == null ? void 0 : options.forceLight) || Math.abs(scrollVelocity) > threshold ? "light" : "normal";
      const previousMode = state.timeoutAdaptiveRender !== void 0 ? "normal" : currentMode;
      if (nextMode !== previousMode) {
        if (nextMode === "light") {
          setAdaptiveRender(ctx, "light", "scroll");
          scheduleAdaptiveRenderExit(ctx, exitDelay);
        } else if (currentMode === "light") {
          scheduleAdaptiveRenderExit(ctx, exitDelay);
        }
      }
    } else {
      resetAdaptiveRender(ctx);
    }
  }
}

// src/utils/getEffectiveDrawDistance.ts
var INITIAL_DRAW_DISTANCE = 50;
function getEffectiveDrawDistance(ctx, mode) {
  var _a3;
  const drawDistance = ctx.state.props.drawDistance;
  const initialScroll = ctx.state.initialScroll;
  const needsFullInitialDrawDistance = initialScroll !== void 0 && ((_a3 = initialScroll.viewPosition) != null ? _a3 : 0) > 0;
  const shouldCapDrawDistance = mode === "visible-first" || mode !== "full" && !peek$(ctx, "readyToRender") && !needsFullInitialDrawDistance;
  return shouldCapDrawDistance ? Math.min(drawDistance, INITIAL_DRAW_DISTANCE) : drawDistance;
}
function scheduleFullDrawDistancePrewarm(ctx) {
  const { state } = ctx;
  if (state.props.drawDistance <= INITIAL_DRAW_DISTANCE || state.queuedFullDrawDistancePrewarm !== void 0) {
    return;
  }
  state.queuedFullDrawDistancePrewarm = requestAnimationFrame(() => {
    var _a3;
    state.queuedFullDrawDistancePrewarm = void 0;
    (_a3 = state.triggerCalculateItemsInView) == null ? void 0 : _a3.call(state);
  });
}

// src/utils/setInitialRenderState.ts
function resetInitialRenderState(ctx, {
  resetLayout,
  resetInitialScroll
}) {
  const { state } = ctx;
  if (resetLayout) {
    state.didContainersLayout = false;
    state.queuedInitialLayout = false;
  }
  if (resetInitialScroll) {
    state.didFinishInitialScroll = false;
  }
  set$(ctx, "readyToRender", false);
  resetAdaptiveRender(ctx);
}
function setInitialRenderState(ctx, {
  didLayout,
  didInitialScroll
}) {
  const { state } = ctx;
  const {
    loadStartTime,
    props: { onLoad }
  } = state;
  if (didLayout) {
    state.didContainersLayout = true;
  }
  if (didInitialScroll) {
    state.didFinishInitialScroll = true;
  }
  const isReadyToRender = Boolean(state.didContainersLayout && state.didFinishInitialScroll);
  if (isReadyToRender && !peek$(ctx, "readyToRender")) {
    set$(ctx, "readyToRender", true);
    setAdaptiveRender(ctx, "normal", "ready");
    if (state.props.drawDistance > INITIAL_DRAW_DISTANCE) {
      scheduleFullDrawDistancePrewarm(ctx);
    }
    if (!state.didLoad) {
      state.didLoad = true;
      if (onLoad) {
        onLoad({ elapsedTimeInMs: Date.now() - loadStartTime });
      }
    }
  }
}

// src/core/finishInitialScroll.ts
var PRESERVED_INITIAL_SCROLL_FALLBACK_CLEAR_DELAY_MS = 2e3;
function syncInitialScrollOffset(state, offset) {
  state.scroll = offset;
  state.scrollPending = offset;
  state.scrollPrev = offset;
}
function clearPreservedInitialScrollTargetTimeout(state) {
  if (state.timeoutPreservedInitialScrollClear !== void 0) {
    clearTimeout(state.timeoutPreservedInitialScrollClear);
    state.timeoutPreservedInitialScrollClear = void 0;
  }
}
function clearPreservedInitialScrollTarget(state) {
  clearPreservedInitialScrollTargetTimeout(state);
  state.clearPreservedInitialScrollOnNextFinish = void 0;
  state.initialScroll = void 0;
  setInitialScrollSession(state);
}
function finishInitialScroll(ctx, options) {
  var _a3, _b, _c;
  const state = ctx.state;
  if ((options == null ? void 0 : options.resolvedOffset) !== void 0) {
    syncInitialScrollOffset(state, options.resolvedOffset);
  } else if ((options == null ? void 0 : options.syncObservedOffset) && ((_a3 = state.initialScrollSession) == null ? void 0 : _a3.kind) === "offset") {
    const observedOffset = (_c = (_b = state.refScroller.current) == null ? void 0 : _b.getCurrentScrollOffset) == null ? void 0 : _c.call(_b);
    if (typeof observedOffset === "number" && Number.isFinite(observedOffset)) {
      syncInitialScrollOffset(state, observedOffset);
    }
  }
  const complete = () => {
    var _a4, _b2, _c2, _d, _e;
    const shouldReleaseDeferredPublicOnScroll = Platform.OS === "web" && ((_a4 = state.initialScrollSession) == null ? void 0 : _a4.kind) === "bootstrap";
    const finalScrollOffset = (_d = (_c2 = (_b2 = options == null ? void 0 : options.resolvedOffset) != null ? _b2 : state.scrollPending) != null ? _c2 : state.scroll) != null ? _d : 0;
    initialScrollWatchdog.clear(state);
    if ((options == null ? void 0 : options.preserveTarget) && state.initialScroll) {
      state.clearPreservedInitialScrollOnNextFinish = void 0;
      setInitialScrollSession(state);
      clearPreservedInitialScrollTargetTimeout(state);
      if (options == null ? void 0 : options.schedulePreservedTargetClear) {
        state.timeoutPreservedInitialScrollClear = setTimeout(() => {
          var _a5;
          state.timeoutPreservedInitialScrollClear = void 0;
          if (!state.didFinishInitialScroll || ((_a5 = state.scrollingTo) == null ? void 0 : _a5.isInitialScroll) || !state.initialScroll) {
            return;
          }
          clearPreservedInitialScrollTarget(state);
        }, PRESERVED_INITIAL_SCROLL_FALLBACK_CLEAR_DELAY_MS);
      }
    } else {
      clearPreservedInitialScrollTarget(state);
    }
    if (options == null ? void 0 : options.recalculateItems) {
      recalculateSettledScroll(ctx);
    }
    setInitialRenderState(ctx, { didInitialScroll: true });
    if (shouldReleaseDeferredPublicOnScroll) {
      releaseDeferredPublicOnScroll(ctx, finalScrollOffset);
    }
    (_e = options == null ? void 0 : options.onFinished) == null ? void 0 : _e.call(options);
  };
  if (options == null ? void 0 : options.waitForCompletionFrame) {
    requestAnimationFrame(complete);
    return;
  }
  complete();
}

// src/core/calculateOffsetForIndex.ts
function calculateOffsetForIndex(ctx, index) {
  const state = ctx.state;
  return index !== void 0 ? state.positions[index] || 0 : 0;
}

// src/core/getTopOffsetAdjustment.ts
function getTopOffsetAdjustment(ctx) {
  return (peek$(ctx, "stylePaddingTop") || 0) + (peek$(ctx, "alignItemsAtEndPadding") || 0) + (peek$(ctx, "headerSize") || 0);
}

// src/utils/getId.ts
function getId(state, index) {
  const { data, keyExtractor } = state.props;
  if (!data) {
    return "";
  }
  const ret = index < data.length ? keyExtractor ? keyExtractor(data[index], index) : index : null;
  const id = ret;
  state.idCache[index] = id;
  return id;
}

// src/core/updateContentMetricsState.ts
function getRawContentLength(ctx) {
  var _a3, _b, _c;
  const { state, values } = ctx;
  return (values.get("headerSize") || 0) + (values.get("footerSize") || 0) + ((_c = (_b = (_a3 = state.pendingTotalSize) != null ? _a3 : state.totalSize) != null ? _b : values.get("totalSize")) != null ? _c : 0) + (state.props.stylePaddingTop || 0) + (state.props.stylePaddingBottom || 0);
}
function getAlignItemsAtEndPadding(ctx) {
  const { state } = ctx;
  const shouldPad = !!state.props.alignItemsAtEndPaddingEnabled && !state.props.horizontal && state.props.data.length > 0 && state.scrollLength > 0;
  return shouldPad ? Math.max(0, state.scrollLength - getRawContentLength(ctx) - getContentInsetEnd(ctx)) : 0;
}
function updateContentMetricsState(ctx) {
  const previousPadding = peek$(ctx, "alignItemsAtEndPadding") || 0;
  const nextPadding = getAlignItemsAtEndPadding(ctx);
  if (previousPadding !== nextPadding) {
    set$(ctx, "alignItemsAtEndPadding", nextPadding);
  }
}

// src/core/addTotalSize.ts
function addTotalSize(ctx, key, add, notifyTotalSize = true) {
  const state = ctx.state;
  const prevTotalSize = state.totalSize;
  let totalSize = state.totalSize;
  if (key === null) {
    totalSize = add;
    if (state.timeoutSetPaddingTop) {
      clearTimeout(state.timeoutSetPaddingTop);
      state.timeoutSetPaddingTop = void 0;
    }
  } else {
    totalSize += add;
  }
  if (prevTotalSize !== totalSize) {
    if (!IsNewArchitecture && state.initialScroll && totalSize < prevTotalSize) {
      state.pendingTotalSize = totalSize;
    } else {
      state.pendingTotalSize = void 0;
      state.totalSize = totalSize;
      if (notifyTotalSize) {
        set$(ctx, "totalSize", totalSize);
      }
      updateContentMetricsState(ctx);
    }
  } else if (notifyTotalSize && ctx.values.get("totalSize") !== totalSize) {
    set$(ctx, "totalSize", totalSize);
  }
}

// src/core/setSize.ts
function setSize(ctx, itemKey, size, notifyTotalSize = true) {
  const state = ctx.state;
  const { sizes } = state;
  const previousSize = sizes.get(itemKey);
  const diff = previousSize !== void 0 ? size - previousSize : size;
  if (diff !== 0) {
    addTotalSize(ctx, itemKey, diff, notifyTotalSize);
  }
  sizes.set(itemKey, size);
}

// src/utils/getItemSize.ts
function getKnownOrFixedSize(ctx, key, index, data, resolved) {
  var _a3, _b;
  const state = ctx.state;
  const { getFixedItemSize, getItemType } = state.props;
  let size = key ? state.sizesKnown.get(key) : void 0;
  if (size === void 0 && key && getFixedItemSize) {
    const itemType = (_b = resolved == null ? void 0 : resolved.itemType) != null ? _b : getItemType ? (_a3 = getItemType(data, index)) != null ? _a3 : "" : "";
    const fixedSize = (resolved == null ? void 0 : resolved.didResolveFixedItemSize) ? resolved.fixedItemSize : getFixedItemSize(data, index, itemType);
    if (fixedSize !== void 0) {
      size = fixedSize + ctx.scrollAxisGap;
      state.sizesKnown.set(key, size);
    }
  }
  return size;
}
function getKnownOrFixedItemSize(ctx, index) {
  const key = getId(ctx.state, index);
  return getKnownOrFixedSize(ctx, key, index, ctx.state.props.data[index]);
}
function areKnownOrFixedItemSizesAvailable(ctx, startIndex, endIndex) {
  for (let index = startIndex; index <= endIndex; index++) {
    if (getKnownOrFixedItemSize(ctx, index) === void 0) {
      return false;
    }
  }
  return true;
}
function getItemSize(ctx, key, index, data, useAverageSize, preferCachedSize, notifyTotalSize, resolved) {
  var _a3, _b, _c, _d;
  const state = ctx.state;
  const {
    sizes,
    averageSizes,
    props: { estimatedItemSize, getItemType },
    scrollingTo
  } = state;
  const sizeKnown = state.sizesKnown.get(key);
  if (sizeKnown !== void 0) {
    return sizeKnown;
  }
  let size;
  const renderedSize = sizes.get(key);
  if (preferCachedSize) {
    if (renderedSize !== void 0) {
      return renderedSize;
    }
  }
  size = getKnownOrFixedSize(ctx, key, index, data, resolved);
  if (size !== void 0) {
    setSize(ctx, key, size, notifyTotalSize);
    return size;
  }
  const itemType = (_b = resolved == null ? void 0 : resolved.itemType) != null ? _b : getItemType ? (_a3 = getItemType(data, index)) != null ? _a3 : "" : "";
  if (useAverageSize && !scrollingTo) {
    const averageSizeForType = (_c = averageSizes[itemType]) == null ? void 0 : _c.avg;
    if (averageSizeForType !== void 0) {
      size = roundSize(averageSizeForType);
    }
  }
  if (size === void 0 && renderedSize !== void 0) {
    return renderedSize;
  }
  if (size === void 0 && useAverageSize && scrollingTo) {
    const averageSizeForType = (_d = scrollingTo.averageSizeSnapshot) == null ? void 0 : _d[itemType];
    if (averageSizeForType !== void 0) {
      size = roundSize(averageSizeForType);
    }
  }
  if (size === void 0) {
    size = estimatedItemSize + ctx.scrollAxisGap;
  }
  setSize(ctx, key, size, notifyTotalSize);
  return size;
}
function getItemSizeAtIndex(ctx, index) {
  if (index === void 0 || index < 0) {
    return void 0;
  }
  const targetId = getId(ctx.state, index);
  return getItemSize(ctx, targetId, index, ctx.state.props.data[index]);
}

// src/core/calculateOffsetWithOffsetPosition.ts
function calculateOffsetWithOffsetPosition(ctx, offsetParam, params) {
  var _a3;
  const state = ctx.state;
  const { index, viewOffset, viewPosition } = params;
  let offset = offsetParam;
  if (viewOffset) {
    offset -= viewOffset;
  }
  if (index !== void 0) {
    const topOffsetAdjustment = getTopOffsetAdjustment(ctx);
    if (topOffsetAdjustment) {
      offset += topOffsetAdjustment;
    }
  }
  if (viewPosition !== void 0 && index !== void 0) {
    const dataLength = state.props.data.length;
    if (dataLength === 0) {
      return offset;
    }
    const isOutOfBounds = index < 0 || index >= dataLength;
    const fallbackEstimatedSize = (_a3 = state.props.estimatedItemSize) != null ? _a3 : 0;
    const itemSize = isOutOfBounds ? fallbackEstimatedSize : getItemSize(ctx, getId(state, index), index, state.props.data[index]);
    const trailingInset = getContentInsetEnd(ctx);
    offset -= viewPosition * (state.scrollLength - trailingInset - itemSize);
    if (!isOutOfBounds && index === state.props.data.length - 1) {
      const footerSize = peek$(ctx, "footerSize") || 0;
      offset += footerSize;
    }
  }
  return offset;
}

// src/core/clampScrollOffset.ts
function clampScrollOffset(ctx, offset, scrollTarget) {
  const state = ctx.state;
  const contentSize = getContentSize(ctx);
  let clampedOffset = offset;
  if (Number.isFinite(contentSize) && Number.isFinite(state.scrollLength) && (Platform.OS !== "android" || state.lastLayout)) {
    const baseMaxOffset = Math.max(0, contentSize - state.scrollLength);
    const viewOffset = scrollTarget == null ? void 0 : scrollTarget.viewOffset;
    const extraEndOffset = typeof viewOffset === "number" && viewOffset < 0 ? -viewOffset : 0;
    const maxOffset = baseMaxOffset + extraEndOffset;
    clampedOffset = Math.min(offset, maxOffset);
  }
  clampedOffset = Math.max(0, clampedOffset);
  return clampedOffset;
}

// src/core/finishScrollTo.ts
function finishScrollTo(ctx) {
  var _a3, _b;
  const state = ctx.state;
  if (state == null ? void 0 : state.scrollingTo) {
    const resolvePendingScroll = state.pendingScrollResolve;
    state.pendingScrollResolve = void 0;
    const scrollingTo = state.scrollingTo;
    state.scrollHistory.length = 0;
    state.scrollingTo = void 0;
    state.scrollTargetPinnedRange = void 0;
    if (state.pendingTotalSize !== void 0) {
      addTotalSize(ctx, null, state.pendingTotalSize);
    }
    if (PlatformAdjustBreaksScroll) {
      state.scrollAdjustHandler.commitPendingAdjust(scrollingTo);
    }
    if (scrollingTo.isInitialScroll || state.initialScroll) {
      const isOffsetSession = ((_a3 = state.initialScrollSession) == null ? void 0 : _a3.kind) === "offset";
      const shouldPreserveResizeTarget = !!scrollingTo.isInitialScroll && !state.clearPreservedInitialScrollOnNextFinish && state.props.data.length > 0 && ((_b = state.initialScroll) == null ? void 0 : _b.viewPosition) === 1;
      finishInitialScroll(ctx, {
        onFinished: () => {
          resolvePendingScroll == null ? void 0 : resolvePendingScroll();
        },
        preserveTarget: isOffsetSession && state.props.data.length === 0 || shouldPreserveResizeTarget,
        recalculateItems: true,
        schedulePreservedTargetClear: shouldPreserveResizeTarget,
        syncObservedOffset: isOffsetSession,
        waitForCompletionFrame: !!scrollingTo.waitForInitialScrollCompletionFrame
      });
      return;
    }
    recalculateSettledScroll(ctx);
    resolvePendingScroll == null ? void 0 : resolvePendingScroll();
  }
}

// src/core/checkFinishedScroll.ts
var INITIAL_SCROLL_MAX_FALLBACK_CHECKS = 20;
var INITIAL_SCROLL_COMPLETION_TARGET_EPSILON = 1;
var INITIAL_SCROLL_ZERO_TARGET_EPSILON = 1;
var SILENT_INITIAL_SCROLL_RETRY_DELAY_MS = 16;
var SILENT_INITIAL_SCROLL_TARGET_EPSILON = 1;
function checkFinishedScroll(ctx, options) {
  const scrollingTo = ctx.state.scrollingTo;
  if (options == null ? void 0 : options.onlyIfAligned) {
    if (!(scrollingTo == null ? void 0 : scrollingTo.isInitialScroll) || scrollingTo.animated) {
      return;
    }
    if (!getResolvedScrollCompletionState(ctx, scrollingTo).isAtResolvedTarget) {
      return;
    }
  }
  ctx.state.animFrameCheckFinishedScroll = requestAnimationFrame(() => checkFinishedScrollFrame(ctx));
}
function hasScrollCompletionOwnership(state, options) {
  const { clampedTargetOffset, scrollingTo } = options;
  return !scrollingTo.isInitialScroll || state.hasScrolled || clampedTargetOffset <= INITIAL_SCROLL_COMPLETION_TARGET_EPSILON;
}
function isSilentInitialDispatch(state, scrollingTo) {
  return !!(scrollingTo == null ? void 0 : scrollingTo.isInitialScroll) && initialScrollCompletion.didDispatchNativeScroll(state) && !state.hasScrolled;
}
function getInitialScrollWatchdogTargetOffset(state) {
  var _a3;
  return (_a3 = initialScrollWatchdog.get(state)) == null ? void 0 : _a3.targetOffset;
}
function isNativeInitialNonZeroTarget(state) {
  const targetOffset = getInitialScrollWatchdogTargetOffset(state);
  return !state.didFinishInitialScroll && initialScrollWatchdog.hasNonZeroTargetOffset(targetOffset);
}
function shouldFinishInitialScrollWithoutNativeProgress(state, scrollingTo) {
  var _a3, _b;
  if (!scrollingTo.isInitialScroll || scrollingTo.animated || !state.didContainersLayout) {
    return false;
  }
  if (((_a3 = state.initialScrollSession) == null ? void 0 : _a3.kind) === "bootstrap") {
    return false;
  }
  const targetOffset = (_b = scrollingTo.targetOffset) != null ? _b : scrollingTo.offset;
  if (initialScrollWatchdog.hasNonZeroTargetOffset(targetOffset) && initialScrollCompletion.didDispatchNativeScroll(state) && !state.hasScrolled) {
    return false;
  }
  if (initialScrollWatchdog.isAtZeroTargetOffset(targetOffset) || Math.abs(state.scroll - targetOffset) > 1 || Math.abs(state.scrollPending - targetOffset) > 1) {
    return false;
  }
  return !!scrollingTo.waitForInitialScrollCompletionFrame || isNativeInitialNonZeroTarget(state);
}
function shouldFinishInitialZeroTargetScroll(ctx) {
  var _a3;
  const { state } = ctx;
  return !!((_a3 = state.scrollingTo) == null ? void 0 : _a3.isInitialScroll) && state.props.data.length > 0 && getContentSize(ctx) <= state.scrollLength && state.scrollPending <= INITIAL_SCROLL_ZERO_TARGET_EPSILON;
}
function isEndAlignedLastItemTarget(ctx, scrollingTo) {
  return scrollingTo.index === ctx.state.props.data.length - 1 && scrollingTo.viewPosition === 1;
}
function getCurrentTargetOffset(ctx, scrollingTo) {
  var _a3;
  const index = scrollingTo.index;
  const shouldRecomputeEndTarget = isEndAlignedLastItemTarget(ctx, scrollingTo);
  const requestedTargetOffset = shouldRecomputeEndTarget && index !== void 0 ? calculateOffsetWithOffsetPosition(ctx, calculateOffsetForIndex(ctx, index), scrollingTo) : (_a3 = scrollingTo.targetOffset) != null ? _a3 : clampScrollOffset(ctx, scrollingTo.offset - (scrollingTo.viewOffset || 0), scrollingTo);
  return clampScrollOffset(ctx, requestedTargetOffset, scrollingTo);
}
function getResolvedScrollCompletionState(ctx, scrollingTo) {
  const { state } = ctx;
  const scroll = state.scrollPending;
  const adjust = state.scrollAdjustHandler.getAdjust();
  const clampedTargetOffset = getCurrentTargetOffset(ctx, scrollingTo);
  const maxOffset = clampScrollOffset(ctx, scroll, scrollingTo);
  const diff1 = Math.abs(scroll - clampedTargetOffset);
  const adjustedTargetOffset = clampedTargetOffset + adjust;
  const diff2 = Math.abs(scroll - adjustedTargetOffset);
  const canUseAdjustedCompletion = !scrollingTo.animated || Platform.OS === "ios";
  return {
    clampedTargetOffset,
    isAtResolvedTarget: Math.abs(scroll - maxOffset) < 1 && (diff1 < 1 || canUseAdjustedCompletion && diff2 < 1)
  };
}
function checkFinishedScrollFrame(ctx) {
  const scrollingTo = ctx.state.scrollingTo;
  if (!scrollingTo) {
    return;
  }
  const { state } = ctx;
  state.animFrameCheckFinishedScroll = void 0;
  const completionState = getResolvedScrollCompletionState(ctx, scrollingTo);
  if (completionState.isAtResolvedTarget && hasScrollCompletionOwnership(state, {
    clampedTargetOffset: completionState.clampedTargetOffset,
    scrollingTo
  })) {
    finishScrollTo(ctx);
  }
}
function scrollToFallbackOffset(ctx, offset) {
  var _a3;
  (_a3 = ctx.state.refScroller.current) == null ? void 0 : _a3.scrollTo({
    animated: false,
    x: ctx.state.props.horizontal ? offset : 0,
    y: ctx.state.props.horizontal ? 0 : offset
  });
}
function checkFinishedScrollFallback(ctx) {
  const state = ctx.state;
  const scrollingTo = state.scrollingTo;
  const shouldFinishInitialZeroTarget = shouldFinishInitialZeroTargetScroll(ctx);
  const silentInitialDispatch = isSilentInitialDispatch(state, scrollingTo);
  const canFinishInitialWithoutNativeProgress = scrollingTo !== void 0 ? shouldFinishInitialScrollWithoutNativeProgress(state, scrollingTo) : false;
  const slowTimeout = (scrollingTo == null ? void 0 : scrollingTo.isInitialScroll) && !shouldFinishInitialZeroTarget && !canFinishInitialWithoutNativeProgress || !state.didContainersLayout;
  const initialDelay = shouldFinishInitialZeroTarget || canFinishInitialWithoutNativeProgress ? 0 : silentInitialDispatch ? SILENT_INITIAL_SCROLL_RETRY_DELAY_MS : slowTimeout ? 500 : 100;
  state.timeoutCheckFinishedScrollFallback = setTimeout(() => {
    let numChecks = 0;
    const scheduleFallbackCheck = (delay) => {
      state.timeoutCheckFinishedScrollFallback = setTimeout(checkHasScrolled, delay);
    };
    const checkHasScrolled = () => {
      var _a3, _b, _c, _d;
      state.timeoutCheckFinishedScrollFallback = void 0;
      const isStillScrollingTo = state.scrollingTo;
      if (isStillScrollingTo) {
        numChecks++;
        const isNativeInitialPending = isNativeInitialNonZeroTarget(state) && !state.hasScrolled;
        const maxChecks = silentInitialDispatch ? 5 : isNativeInitialPending ? INITIAL_SCROLL_MAX_FALLBACK_CHECKS : 5;
        const shouldFinishZeroTarget = shouldFinishInitialZeroTargetScroll(ctx);
        const canFinishInitialScrollWithoutNativeProgress = shouldFinishInitialScrollWithoutNativeProgress(
          state,
          isStillScrollingTo
        );
        const completionState = getResolvedScrollCompletionState(ctx, isStillScrollingTo);
        const canFinishAfterSilentNativeDispatch = Platform.OS === "android" && silentInitialDispatch && completionState.isAtResolvedTarget && numChecks >= 1;
        const shouldRetrySilentInitialNativeScroll = Platform.OS === "android" && canFinishAfterSilentNativeDispatch && !initialScrollCompletion.didRetrySilentInitialScroll(state);
        const shouldFinishAfterObservedScroll = state.hasScrolled && (!isStillScrollingTo.isInitialScroll || completionState.isAtResolvedTarget);
        const shouldRetryUnalignedInitialScroll = isStillScrollingTo.isInitialScroll && !completionState.isAtResolvedTarget && numChecks <= maxChecks;
        const shouldRetryUnalignedEndScroll = Platform.OS === "ios" && !isStillScrollingTo.isInitialScroll && isEndAlignedLastItemTarget(ctx, isStillScrollingTo) && !completionState.isAtResolvedTarget && numChecks <= maxChecks;
        if (shouldRetrySilentInitialNativeScroll) {
          const targetOffset = (_b = (_a3 = getInitialScrollWatchdogTargetOffset(state)) != null ? _a3 : isStillScrollingTo.targetOffset) != null ? _b : 0;
          const jiggleOffset = targetOffset >= SILENT_INITIAL_SCROLL_TARGET_EPSILON ? targetOffset - SILENT_INITIAL_SCROLL_TARGET_EPSILON : targetOffset + SILENT_INITIAL_SCROLL_TARGET_EPSILON;
          initialScrollCompletion.markSilentInitialScrollRetry(state);
          scrollToFallbackOffset(ctx, jiggleOffset);
          requestAnimationFrame(() => {
            scrollToFallbackOffset(ctx, targetOffset);
          });
          scheduleFallbackCheck(SILENT_INITIAL_SCROLL_RETRY_DELAY_MS);
        } else if (shouldRetryUnalignedEndScroll) {
          scrollToFallbackOffset(ctx, completionState.clampedTargetOffset);
          scheduleFallbackCheck(100);
        } else if (shouldFinishZeroTarget || shouldFinishAfterObservedScroll || canFinishInitialScrollWithoutNativeProgress || canFinishAfterSilentNativeDispatch || numChecks > maxChecks) {
          finishScrollTo(ctx);
        } else if ((isNativeInitialPending || shouldRetryUnalignedInitialScroll) && numChecks <= maxChecks) {
          const targetOffset = (_d = (_c = getInitialScrollWatchdogTargetOffset(state)) != null ? _c : isStillScrollingTo.targetOffset) != null ? _d : state.scrollPending;
          scrollToFallbackOffset(ctx, targetOffset);
          scheduleFallbackCheck(silentInitialDispatch ? SILENT_INITIAL_SCROLL_RETRY_DELAY_MS : 100);
        } else {
          scheduleFallbackCheck(silentInitialDispatch ? SILENT_INITIAL_SCROLL_RETRY_DELAY_MS : 100);
        }
      }
    };
    checkHasScrolled();
  }, initialDelay);
}

// src/core/doScrollTo.native.ts
function doScrollTo(ctx, params) {
  const state = ctx.state;
  const { animated, horizontal, isInitialScroll, offset } = params;
  const isAnimated = !!animated;
  const { refScroller } = state;
  const scroller = refScroller.current;
  if (!scroller) {
    return;
  }
  const isHorizontal = !!horizontal;
  const contentSize = isHorizontal ? getContentSize(ctx) : void 0;
  const nativeOffset = toNativeHorizontalOffset(state, offset, contentSize);
  scroller.scrollTo({
    animated: isAnimated,
    x: isHorizontal ? nativeOffset : 0,
    y: isHorizontal ? 0 : offset
  });
  if (isInitialScroll) {
    initialScrollCompletion.markInitialScrollNativeDispatch(state);
  }
  if (!isAnimated) {
    state.scroll = offset;
    checkFinishedScrollFallback(ctx);
  }
}

// src/core/doMaintainScrollAtEnd.ts
function doMaintainScrollAtEnd(ctx) {
  const state = ctx.state;
  const {
    didContainersLayout,
    pendingNativeMVCPAdjust,
    refScroller,
    props: { maintainScrollAtEnd }
  } = state;
  const isWithinMaintainScrollAtEndThreshold = peek$(ctx, "isWithinMaintainScrollAtEndThreshold");
  const shouldMaintainScrollAtEnd = !!(isWithinMaintainScrollAtEndThreshold && maintainScrollAtEnd && didContainersLayout);
  if (pendingNativeMVCPAdjust) {
    state.pendingMaintainScrollAtEnd = shouldMaintainScrollAtEnd;
    return false;
  }
  if (shouldMaintainScrollAtEnd) {
    state.pendingMaintainScrollAtEnd = false;
    const contentSize = getContentSize(ctx);
    if (contentSize < state.scrollLength) {
      state.scroll = 0;
    }
    if (!state.maintainingScrollAtEnd) {
      const pendingState = maintainScrollAtEnd.animated ? "pending-animated" : "pending-instant";
      const activeState = maintainScrollAtEnd.animated ? "animated" : "instant";
      state.maintainingScrollAtEnd = pendingState;
      requestAnimationFrame(() => {
        if (peek$(ctx, "isWithinMaintainScrollAtEndThreshold")) {
          state.maintainingScrollAtEnd = activeState;
          const scroller = refScroller.current;
          if (state.props.horizontal && isHorizontalRTL(state)) {
            const currentContentSize = getContentSize(ctx);
            const logicalEndOffset = getLogicalHorizontalMaxOffset(state, currentContentSize);
            const nativeOffset = toNativeHorizontalOffset(state, logicalEndOffset, currentContentSize);
            scroller == null ? void 0 : scroller.scrollTo({
              animated: maintainScrollAtEnd.animated,
              x: nativeOffset,
              y: 0
            });
          } else {
            scroller == null ? void 0 : scroller.scrollToEnd({
              animated: maintainScrollAtEnd.animated
            });
          }
          setTimeout(
            () => {
              if (state.maintainingScrollAtEnd === activeState) {
                state.maintainingScrollAtEnd = void 0;
                if (state.pendingMaintainScrollAtEnd) {
                  doMaintainScrollAtEnd(ctx);
                }
              }
            },
            maintainScrollAtEnd.animated ? 500 : 0
          );
        } else if (state.maintainingScrollAtEnd === pendingState) {
          state.maintainingScrollAtEnd = void 0;
        }
      });
    } else {
      state.pendingMaintainScrollAtEnd = true;
    }
    return true;
  }
  state.pendingMaintainScrollAtEnd = false;
  return false;
}

// src/utils/requestAdjust.ts
function requestAdjust(ctx, positionDiff, dataChanged) {
  const state = ctx.state;
  if (Math.abs(positionDiff) > 0.1) {
    const needsScrollWorkaround = Platform.OS === "android" && !IsNewArchitecture && dataChanged && state.scroll <= positionDiff;
    const doit = () => {
      if (needsScrollWorkaround) {
        doScrollTo(ctx, { horizontal: state.props.horizontal, offset: state.scroll });
      } else {
        state.scrollAdjustHandler.requestAdjust(positionDiff);
        if (state.adjustingFromInitialMount) {
          state.adjustingFromInitialMount--;
        }
      }
    };
    state.scroll += positionDiff;
    state.scrollForNextCalculateItemsInView = void 0;
    const readyToRender = peek$(ctx, "readyToRender");
    if (readyToRender) {
      doit();
      if (Platform.OS !== "web") {
        const threshold = state.scroll - positionDiff / 2;
        if (!state.ignoreScrollFromMVCP) {
          state.ignoreScrollFromMVCP = {};
        }
        if (positionDiff > 0) {
          state.ignoreScrollFromMVCP.lt = threshold;
        } else {
          state.ignoreScrollFromMVCP.gt = threshold;
        }
        if (state.ignoreScrollFromMVCPTimeout) {
          clearTimeout(state.ignoreScrollFromMVCPTimeout);
        }
        const delay = needsScrollWorkaround ? 250 : 100;
        state.ignoreScrollFromMVCPTimeout = setTimeout(() => {
          var _a3;
          state.ignoreScrollFromMVCP = void 0;
          const shouldForceUpdate = state.ignoreScrollFromMVCPIgnored && state.scrollProcessingEnabled !== false;
          if (shouldForceUpdate) {
            state.ignoreScrollFromMVCPIgnored = false;
            state.scrollPending = state.scroll;
            (_a3 = state.reprocessCurrentScroll) == null ? void 0 : _a3.call(state);
          }
        }, delay);
      }
    } else {
      state.adjustingFromInitialMount = (state.adjustingFromInitialMount || 0) + 1;
      requestAnimationFrame(doit);
    }
  }
}

// src/core/mvcp.ts
var MVCP_POSITION_EPSILON = 0.1;
var MVCP_ANCHOR_LOCK_TTL_MS = 300;
var MVCP_ANCHOR_LOCK_QUIET_PASSES_TO_RELEASE = 2;
var NATIVE_END_CLAMP_EPSILON = 1;
function resolveAnchorLock(state, enableMVCPAnchorLock, mvcpData, now) {
  if (!enableMVCPAnchorLock) {
    state.mvcpAnchorLock = void 0;
    return void 0;
  }
  const lock = state.mvcpAnchorLock;
  if (!lock) {
    return void 0;
  }
  const isExpired = now > lock.expiresAt;
  const isMissing = state.indexByKey.get(lock.id) === void 0;
  if (isExpired || isMissing || !mvcpData) {
    state.mvcpAnchorLock = void 0;
    return void 0;
  }
  return lock;
}
function updateAnchorLock(state, params) {
  if (Platform.OS === "web") {
    const { anchorId, anchorPosition, dataChanged, now, positionDiff } = params;
    const enableMVCPAnchorLock = !!dataChanged || !!state.mvcpAnchorLock;
    const mvcpData = state.props.maintainVisibleContentPosition.data;
    if (!enableMVCPAnchorLock || !mvcpData || state.scrollingTo || !anchorId || anchorPosition === void 0) {
      return;
    }
    const existingLock = state.mvcpAnchorLock;
    const quietPasses = !dataChanged && Math.abs(positionDiff) <= MVCP_POSITION_EPSILON && (existingLock == null ? void 0 : existingLock.id) === anchorId ? existingLock.quietPasses + 1 : 0;
    if (!dataChanged && quietPasses >= MVCP_ANCHOR_LOCK_QUIET_PASSES_TO_RELEASE) {
      state.mvcpAnchorLock = void 0;
      return;
    }
    state.mvcpAnchorLock = {
      expiresAt: now + MVCP_ANCHOR_LOCK_TTL_MS,
      id: anchorId,
      position: anchorPosition,
      quietPasses
    };
  }
}
function shouldQueueNativeMVCPAdjust(dataChanged, state, positionDiff, prevTotalSize, prevScroll, scrollTarget) {
  if (!dataChanged || Platform.OS === "web" || !state.props.maintainVisibleContentPosition.data || scrollTarget !== void 0 || positionDiff >= -MVCP_POSITION_EPSILON) {
    return false;
  }
  const distanceFromEnd = prevTotalSize - prevScroll - state.scrollLength;
  return distanceFromEnd < Math.abs(positionDiff) - MVCP_POSITION_EPSILON;
}
function getPredictedNativeClamp(state, unresolvedAmount, totalSize) {
  if (Math.abs(unresolvedAmount) <= MVCP_POSITION_EPSILON) {
    return 0;
  }
  const maxScroll = Math.max(0, totalSize - state.scrollLength);
  const clampDelta = maxScroll - state.scroll;
  if (unresolvedAmount < 0) {
    return Math.max(unresolvedAmount, Math.min(0, clampDelta));
  }
  if (unresolvedAmount > 0) {
    return Math.min(unresolvedAmount, Math.max(0, clampDelta));
  }
  return 0;
}
function getProgressTowardAmount(targetDelta, nativeDelta) {
  return targetDelta < 0 ? -nativeDelta : nativeDelta;
}
function settlePendingNativeMVCPAdjust(ctx, remainingAfterManual, nativeDelta) {
  const state = ctx.state;
  state.pendingNativeMVCPAdjust = void 0;
  const remaining = remainingAfterManual - nativeDelta;
  if (Math.abs(remaining) > MVCP_POSITION_EPSILON) {
    requestAdjust(ctx, remaining, true);
  }
}
function maybeApplyPredictedNativeMVCPAdjust(ctx) {
  const state = ctx.state;
  const pending = state.pendingNativeMVCPAdjust;
  if (!pending || Math.abs(pending.manualApplied) > MVCP_POSITION_EPSILON) {
    return;
  }
  const totalSize = getContentSize(ctx);
  const predictedNativeClamp = getPredictedNativeClamp(state, pending.amount, totalSize);
  if (Math.abs(predictedNativeClamp) <= MVCP_POSITION_EPSILON) {
    return;
  }
  const manualDesired = pending.amount - predictedNativeClamp;
  if (Math.abs(manualDesired) <= MVCP_POSITION_EPSILON) {
    return;
  }
  pending.manualApplied = manualDesired;
  requestAdjust(ctx, manualDesired, true);
  pending.furthestProgressTowardAmount = 0;
}
function resolvePendingNativeMVCPAdjust(ctx, newScroll) {
  const state = ctx.state;
  const pending = state.pendingNativeMVCPAdjust;
  if (!pending) {
    return false;
  }
  const remainingAfterManual = pending.amount - pending.manualApplied;
  const nativeDelta = newScroll - (pending.startScroll + pending.manualApplied);
  const isWrongDirection = remainingAfterManual < 0 && nativeDelta > MVCP_POSITION_EPSILON || remainingAfterManual > 0 && nativeDelta < -MVCP_POSITION_EPSILON;
  const progressTowardAmount = getProgressTowardAmount(remainingAfterManual, nativeDelta);
  if (Math.abs(remainingAfterManual) <= MVCP_POSITION_EPSILON) {
    state.pendingNativeMVCPAdjust = void 0;
    return true;
  }
  if (isWrongDirection) {
    state.pendingNativeMVCPAdjust = void 0;
    return false;
  }
  if (progressTowardAmount + MVCP_POSITION_EPSILON >= Math.abs(remainingAfterManual)) {
    settlePendingNativeMVCPAdjust(ctx, remainingAfterManual, nativeDelta);
    return true;
  }
  const expectedNativeClampScroll = Math.max(0, getContentSize(ctx) - state.scrollLength);
  const distanceToClamp = Math.abs(newScroll - expectedNativeClampScroll);
  const isAtExpectedNativeClamp = distanceToClamp <= NATIVE_END_CLAMP_EPSILON;
  if (isAtExpectedNativeClamp) {
    settlePendingNativeMVCPAdjust(ctx, remainingAfterManual, nativeDelta);
    return true;
  }
  if (state.pendingMaintainScrollAtEnd && peek$(ctx, "isWithinMaintainScrollAtEndThreshold") && progressTowardAmount > MVCP_POSITION_EPSILON) {
    settlePendingNativeMVCPAdjust(ctx, remainingAfterManual, nativeDelta);
    return true;
  }
  if (progressTowardAmount > pending.furthestProgressTowardAmount + MVCP_POSITION_EPSILON) {
    pending.furthestProgressTowardAmount = progressTowardAmount;
    return false;
  }
  if (pending.furthestProgressTowardAmount > MVCP_POSITION_EPSILON && progressTowardAmount < pending.furthestProgressTowardAmount - MVCP_POSITION_EPSILON) {
    state.pendingNativeMVCPAdjust = void 0;
    return false;
  }
  return false;
}
function prepareMVCP(ctx, dataChanged) {
  const state = ctx.state;
  const { idsInView, positions, props } = state;
  const {
    maintainVisibleContentPosition: { data: mvcpData, size: mvcpScroll, shouldRestorePosition }
  } = props;
  const isWeb = Platform.OS === "web";
  const now = Date.now();
  const enableMVCPAnchorLock = isWeb && (!!dataChanged || !!state.mvcpAnchorLock);
  const scrollingTo = state.scrollingTo;
  if (isWeb && dataChanged && state.pendingScrollToEnd && scrollingTo === void 0) {
    state.mvcpAnchorLock = void 0;
    return void 0;
  }
  const anchorLock = isWeb ? resolveAnchorLock(state, enableMVCPAnchorLock, mvcpData, now) : void 0;
  let prevPosition;
  let targetId;
  const idsInViewWithPositions = [];
  const scrollTarget = scrollingTo == null ? void 0 : scrollingTo.index;
  const scrollingToViewPosition = scrollingTo == null ? void 0 : scrollingTo.viewPosition;
  const isEndAnchoredScrollTarget = scrollTarget !== void 0 && state.props.data.length > 0 && scrollTarget >= state.props.data.length - 1 && (scrollingToViewPosition != null ? scrollingToViewPosition : 0) > 0;
  const shouldMVCP = dataChanged ? mvcpData : mvcpScroll;
  const indexByKey = state.indexByKey;
  const prevScroll = state.scroll;
  const prevTotalSize = getContentSize(ctx);
  if (shouldMVCP) {
    if (!isWeb && state.pendingNativeMVCPAdjust && scrollTarget === void 0) {
      maybeApplyPredictedNativeMVCPAdjust(ctx);
      return void 0;
    }
    if (anchorLock && scrollTarget === void 0) {
      targetId = anchorLock.id;
      prevPosition = anchorLock.position;
    } else if (scrollTarget !== void 0) {
      if (!IsNewArchitecture && (scrollingTo == null ? void 0 : scrollingTo.isInitialScroll)) {
        return void 0;
      }
      targetId = getId(state, scrollTarget);
    } else if (idsInView.length > 0 && state.didContainersLayout && !dataChanged) {
      targetId = idsInView.find((id) => indexByKey.get(id) !== void 0);
    }
    if (dataChanged && idsInView.length > 0 && state.didContainersLayout) {
      for (let i = 0; i < idsInView.length; i++) {
        const id = idsInView[i];
        const index = indexByKey.get(id);
        if (index !== void 0) {
          const position = positions[index];
          if (position !== void 0) {
            idsInViewWithPositions.push({ id, position });
          }
        }
      }
    }
    if (targetId !== void 0 && prevPosition === void 0) {
      const targetIndex = indexByKey.get(targetId);
      if (targetIndex !== void 0) {
        prevPosition = positions[targetIndex];
      }
    }
    return () => {
      let positionDiff = 0;
      let anchorIdForLock = anchorLock == null ? void 0 : anchorLock.id;
      let anchorPositionForLock;
      let skipTargetAnchor = false;
      const data = state.props.data;
      const shouldValidateLockedAnchor = isWeb && dataChanged && mvcpData && scrollTarget === void 0 && targetId !== void 0 && (anchorLock == null ? void 0 : anchorLock.id) === targetId && shouldRestorePosition !== void 0;
      if (shouldValidateLockedAnchor && targetId !== void 0) {
        const index = indexByKey.get(targetId);
        if (index !== void 0) {
          const item = data[index];
          skipTargetAnchor = item === void 0 || !shouldRestorePosition(item, index, data);
          if (skipTargetAnchor && (anchorLock == null ? void 0 : anchorLock.id) === targetId) {
            state.mvcpAnchorLock = void 0;
          }
        }
      }
      const shouldUseFallbackVisibleAnchor = dataChanged && mvcpData && scrollTarget === void 0 && (() => {
        if (targetId === void 0 || skipTargetAnchor) {
          return true;
        }
        const targetIndex = indexByKey.get(targetId);
        return targetIndex === void 0 || positions[targetIndex] === void 0;
      })();
      if (shouldUseFallbackVisibleAnchor) {
        for (let i = 0; i < idsInViewWithPositions.length; i++) {
          const { id, position } = idsInViewWithPositions[i];
          const index = indexByKey.get(id);
          if (index !== void 0 && shouldRestorePosition) {
            const item = data[index];
            if (item === void 0 || !shouldRestorePosition(item, index, data)) {
              continue;
            }
          }
          const newPosition = index !== void 0 ? positions[index] : void 0;
          if (newPosition !== void 0) {
            positionDiff = newPosition - position;
            anchorIdForLock = id;
            anchorPositionForLock = newPosition;
            break;
          }
        }
      }
      if (!skipTargetAnchor && targetId !== void 0 && prevPosition !== void 0) {
        const targetIndex = indexByKey.get(targetId);
        const newPosition = targetIndex !== void 0 ? positions[targetIndex] : void 0;
        if (newPosition !== void 0) {
          const totalSize = getContentSize(ctx);
          let diff = newPosition - prevPosition;
          if (diff !== 0 && isEndAnchoredScrollTarget && state.scroll + state.scrollLength > totalSize) {
            if (diff > 0) {
              diff = Math.max(0, totalSize - state.scroll - state.scrollLength);
            } else {
              const maxScroll = Math.max(0, totalSize - state.scrollLength);
              state.scroll = maxScroll;
              state.scrollPending = maxScroll;
              diff = 0;
            }
          }
          positionDiff = diff;
          anchorIdForLock = targetId;
          anchorPositionForLock = newPosition;
        }
      }
      if (scrollingToViewPosition && scrollingToViewPosition > 0) {
        const newSize = getItemSize(ctx, targetId, scrollTarget, state.props.data[scrollTarget]);
        const prevSize = scrollingTo == null ? void 0 : scrollingTo.itemSize;
        if (newSize !== void 0 && prevSize !== void 0 && newSize !== prevSize) {
          const diff = newSize - prevSize;
          if (diff !== 0) {
            positionDiff += diff * scrollingToViewPosition;
            scrollingTo.itemSize = newSize;
          }
        }
      }
      updateAnchorLock(state, {
        anchorId: anchorIdForLock,
        anchorPosition: anchorPositionForLock,
        dataChanged,
        now,
        positionDiff
      });
      if (shouldQueueNativeMVCPAdjust(dataChanged, state, positionDiff, prevTotalSize, prevScroll, scrollTarget)) {
        state.pendingNativeMVCPAdjust = {
          amount: positionDiff,
          furthestProgressTowardAmount: 0,
          manualApplied: 0,
          startScroll: prevScroll
        };
        maybeApplyPredictedNativeMVCPAdjust(ctx);
        return;
      }
      if (Math.abs(positionDiff) > MVCP_POSITION_EPSILON) {
        const shouldSkipAdjustForMaintainedEnd = (state.maintainingScrollAtEnd === "pending-animated" || state.maintainingScrollAtEnd === "animated") && peek$(ctx, "isWithinMaintainScrollAtEndThreshold");
        if (!shouldSkipAdjustForMaintainedEnd) {
          requestAdjust(ctx, positionDiff, dataChanged && mvcpData);
        }
      }
    };
  }
}

// src/platform/flushSync.native.ts
var flushSync = (fn) => {
  fn();
};

// src/utils/getScrollVelocity.ts
var MAX_SCROLL_VELOCITY_WINDOW_MS = 1e3;
var SCROLL_VELOCITY_HALF_LIFE_MS = 200;
var getScrollVelocity = (state) => {
  const { scrollHistory } = state;
  const newestIndex = scrollHistory.length - 1;
  if (newestIndex < 1) {
    return 0;
  }
  const newest = scrollHistory[newestIndex];
  if (Date.now() - newest.time > MAX_SCROLL_VELOCITY_WINDOW_MS) {
    return 0;
  }
  let direction = 0;
  let weightedVelocity = 0;
  let totalWeight = 0;
  for (let i = newestIndex; i > 0; i--) {
    const current = scrollHistory[i];
    const previous = scrollHistory[i - 1];
    const scrollDiff = current.scroll - previous.scroll;
    const timeDiff = current.time - previous.time;
    const deltaSign = Math.sign(scrollDiff);
    if (deltaSign !== 0) {
      if (direction === 0) {
        direction = deltaSign;
      } else if (deltaSign !== direction) {
        break;
      }
    }
    if (newest.time - previous.time > MAX_SCROLL_VELOCITY_WINDOW_MS) {
      break;
    }
    if (scrollDiff === 0 || timeDiff <= 0) {
      continue;
    }
    const age = newest.time - current.time;
    const weight = Math.exp(-age / SCROLL_VELOCITY_HALF_LIFE_MS);
    weightedVelocity += scrollDiff / timeDiff * weight;
    totalWeight += weight;
  }
  return totalWeight > 0 ? weightedVelocity / totalWeight : 0;
};

// src/core/updateScroll.ts
function updateScroll(ctx, newScroll, forceUpdate, options) {
  var _a3;
  const state = ctx.state;
  const { ignoreScrollFromMVCP, lastScrollAdjustForHistory, scrollAdjustHandler, scrollHistory, scrollingTo } = state;
  const prevScroll = state.scroll;
  if ((options == null ? void 0 : options.markHasScrolled) !== false) {
    state.hasScrolled = true;
  }
  const currentTime = Date.now();
  state.lastBatchingAction = currentTime;
  const adjust = scrollAdjustHandler.getAdjust();
  const adjustChanged = lastScrollAdjustForHistory !== void 0 && Math.abs(adjust - lastScrollAdjustForHistory) > 0.1;
  if (adjustChanged) {
    scrollHistory.length = 0;
  }
  state.lastScrollAdjustForHistory = adjust;
  if (scrollingTo === void 0 && !(scrollHistory.length === 0 && newScroll === state.scroll)) {
    if (!adjustChanged) {
      scrollHistory.push({ scroll: newScroll, time: currentTime });
    }
  }
  if (scrollHistory.length > 5) {
    scrollHistory.shift();
  }
  if (ignoreScrollFromMVCP && !scrollingTo) {
    const { lt, gt } = ignoreScrollFromMVCP;
    if (lt && newScroll < lt || gt && newScroll > gt) {
      state.ignoreScrollFromMVCPIgnored = true;
      return;
    }
  }
  state.scrollPrev = prevScroll;
  state.scrollPrevTime = state.scrollTime;
  state.scroll = newScroll;
  state.scrollTime = currentTime;
  const scrollDelta = Math.abs(newScroll - prevScroll);
  const didResolvePendingNativeMVCPAdjust = resolvePendingNativeMVCPAdjust(ctx, newScroll);
  const scrollLength = state.scrollLength;
  const isLargeUserScrollJump = scrollLength > 0 && scrollingTo === void 0 && scrollDelta > scrollLength && !state.pendingNativeMVCPAdjust;
  const scrollVelocity = getScrollVelocity(state);
  updateAdaptiveRender(ctx, scrollVelocity, { forceLight: isLargeUserScrollJump });
  const lastCalculated = state.scrollLastCalculate;
  const useAggressiveItemRecalculation = isInMVCPActiveMode(state);
  const shouldUpdate = useAggressiveItemRecalculation || didResolvePendingNativeMVCPAdjust || forceUpdate || lastCalculated === void 0 || Math.abs(state.scroll - lastCalculated) > 2;
  if (shouldUpdate) {
    state.scrollLastCalculate = state.scroll;
    state.ignoreScrollFromMVCPIgnored = false;
    state.lastScrollDelta = scrollDelta;
    const runCalculateItems = () => {
      var _a4;
      const calculateItemsParams = {
        doMVCP: scrollingTo !== void 0,
        scrollVelocity
      };
      if (isLargeUserScrollJump) {
        calculateItemsParams.drawDistanceMode = "visible-first";
      }
      (_a4 = state.triggerCalculateItemsInView) == null ? void 0 : _a4.call(state, calculateItemsParams);
      checkThresholds(ctx);
    };
    if (isLargeUserScrollJump) {
      state.mvcpAnchorLock = void 0;
      state.pendingNativeMVCPAdjust = void 0;
      state.userScrollAnchorReset = { keys: /* @__PURE__ */ new Set() };
      if (state.queuedMVCPRecalculate !== void 0) {
        cancelAnimationFrame(state.queuedMVCPRecalculate);
        state.queuedMVCPRecalculate = void 0;
      }
      flushSync(runCalculateItems);
      scheduleFullDrawDistancePrewarm(ctx);
    } else {
      runCalculateItems();
    }
    const shouldMaintainScrollAtEndAfterPendingSettle = !!state.pendingMaintainScrollAtEnd || !!((_a3 = state.props.maintainScrollAtEnd) == null ? void 0 : _a3.onDataChange);
    if (didResolvePendingNativeMVCPAdjust && shouldMaintainScrollAtEndAfterPendingSettle) {
      state.pendingMaintainScrollAtEnd = false;
      doMaintainScrollAtEnd(ctx);
    }
    state.dataChangeNeedsScrollUpdate = false;
    state.lastScrollDelta = 0;
  }
}

// src/core/scrollTo.ts
function getAverageSizeSnapshot(state) {
  if (Object.keys(state.averageSizes).length === 0) {
    return void 0;
  }
  const snapshot = {};
  for (const itemType in state.averageSizes) {
    const averages = state.averageSizes[itemType];
    snapshot[itemType] = averages.avg;
  }
  return snapshot;
}
function syncInitialScrollNativeWatchdog(state, options) {
  var _a3;
  const { isInitialScroll, requestedOffset, targetOffset } = options;
  const existingWatchdog = initialScrollWatchdog.get(state);
  const shouldWatchInitialNativeScroll = !state.didFinishInitialScroll && (isInitialScroll || !!existingWatchdog) && initialScrollWatchdog.hasNonZeroTargetOffset(targetOffset);
  const shouldClearInitialNativeScrollWatchdog = !state.didFinishInitialScroll && !!existingWatchdog && initialScrollWatchdog.isAtZeroTargetOffset(requestedOffset);
  if (shouldWatchInitialNativeScroll) {
    state.hasScrolled = false;
    initialScrollWatchdog.set(state, {
      startScroll: (_a3 = existingWatchdog == null ? void 0 : existingWatchdog.startScroll) != null ? _a3 : state.scroll,
      targetOffset
    });
    return;
  }
  if (shouldClearInitialNativeScrollWatchdog) {
    initialScrollWatchdog.clear(state);
  }
}
function findPositionIndexAtOrBeforeOffset(ctx, offset) {
  const state = ctx.state;
  const dataLength = state.props.data.length;
  let low = 0;
  let high = dataLength - 1;
  let match;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const top = state.positions[mid];
    if (top === void 0) {
      high = mid - 1;
    } else {
      if (top <= offset) {
        match = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  }
  return match;
}
function getItemBottom(ctx, index) {
  var _a3;
  const top = ctx.state.positions[index];
  if (top === void 0) {
    return void 0;
  }
  const itemSize = (_a3 = getItemSizeAtIndex(ctx, index)) != null ? _a3 : 0;
  return top + (Number.isFinite(itemSize) ? itemSize : 0);
}
function getTargetViewportRenderRange(ctx, targetOffset, targetIndex) {
  const state = ctx.state;
  const dataLength = state.props.data.length;
  if (dataLength === 0) {
    return void 0;
  }
  const viewportStart = Math.max(0, targetOffset);
  const viewportEnd = Math.max(viewportStart, targetOffset + state.scrollLength);
  let start = targetIndex !== void 0 ? Math.max(0, Math.min(dataLength - 1, targetIndex)) : findPositionIndexAtOrBeforeOffset(ctx, viewportStart);
  if (start === void 0) {
    return void 0;
  }
  if (targetIndex !== void 0 && state.positions[start] === void 0) {
    return { end: start, start };
  }
  if (targetIndex === void 0) {
    const startBottom = getItemBottom(ctx, start);
    if (startBottom === void 0 || startBottom <= viewportStart) {
      return void 0;
    }
  }
  while (start > 0) {
    const top = state.positions[start];
    if (top === void 0 || top <= viewportStart || state.positions[start - 1] === void 0) {
      break;
    }
    start--;
  }
  while (start > 0) {
    const previousBottom = getItemBottom(ctx, start - 1);
    if (previousBottom === void 0 || previousBottom <= viewportStart) {
      break;
    }
    start--;
  }
  let end = start;
  while (end + 1 < dataLength) {
    const nextTop = state.positions[end + 1];
    if (nextTop === void 0 || nextTop > viewportEnd) {
      break;
    }
    end++;
  }
  return { end, start };
}
function pinScrollTargetRenderRange(ctx, targetOffset, targetIndex) {
  const range = getTargetViewportRenderRange(ctx, targetOffset, targetIndex);
  if (range) {
    ctx.state.scrollTargetPinnedRange = range;
    ctx.state.scrollForNextCalculateItemsInView = void 0;
  } else {
    ctx.state.scrollTargetPinnedRange = void 0;
  }
}
function scrollTo(ctx, params) {
  var _a3, _b;
  const state = ctx.state;
  const { noScrollingTo, forceScroll, ...scrollTarget } = params;
  const {
    animated,
    isInitialScroll,
    offset: scrollTargetOffset,
    precomputedWithViewOffset,
    waitForInitialScrollCompletionFrame
  } = scrollTarget;
  const {
    props: { horizontal }
  } = state;
  if (state.animFrameCheckFinishedScroll) {
    cancelAnimationFrame(ctx.state.animFrameCheckFinishedScroll);
  }
  if (state.timeoutCheckFinishedScrollFallback) {
    clearTimeout(ctx.state.timeoutCheckFinishedScrollFallback);
  }
  const requestedOffset = precomputedWithViewOffset ? scrollTargetOffset : calculateOffsetWithOffsetPosition(ctx, scrollTargetOffset, scrollTarget);
  const shouldPreserveRawInitialOffsetRequest = !!isInitialScroll && ((_a3 = state.initialScrollSession) == null ? void 0 : _a3.kind) === "offset";
  const targetOffset = clampScrollOffset(ctx, requestedOffset, scrollTarget);
  const offset = shouldPreserveRawInitialOffsetRequest ? requestedOffset : targetOffset;
  state.scrollHistory.length = 0;
  if (!noScrollingTo) {
    if (isInitialScroll) {
      initialScrollCompletion.resetFlags(state);
    }
    const averageSizeSnapshot = getAverageSizeSnapshot(state);
    state.scrollingTo = {
      ...scrollTarget,
      ...averageSizeSnapshot ? { averageSizeSnapshot } : {},
      targetOffset,
      waitForInitialScrollCompletionFrame
    };
    if (!isInitialScroll) {
      pinScrollTargetRenderRange(ctx, targetOffset, scrollTarget.index);
    }
  }
  state.scrollPending = targetOffset;
  syncInitialScrollNativeWatchdog(state, { isInitialScroll, requestedOffset: offset, targetOffset });
  if (!isInitialScroll && !noScrollingTo && Math.abs(state.scroll - targetOffset) > 1) {
    if (animated) {
      if (state.scrollTargetPinnedRange) {
        (_b = state.triggerCalculateItemsInView) == null ? void 0 : _b.call(state);
      }
    } else {
      updateScroll(ctx, targetOffset, true, { markHasScrolled: false });
    }
  }
  if (forceScroll || !isInitialScroll || Platform.OS === "android") {
    doScrollTo(ctx, { animated, horizontal, isInitialScroll, offset });
  } else {
    state.scroll = offset;
  }
}

// src/core/scrollToIndex.ts
function clampScrollIndex(index, dataLength) {
  if (dataLength <= 0) {
    return -1;
  }
  if (index >= dataLength) {
    return dataLength - 1;
  }
  if (index < 0) {
    return 0;
  }
  return index;
}
function scrollToIndex(ctx, {
  index,
  viewOffset = 0,
  animated = true,
  forceScroll,
  isInitialScroll,
  viewPosition
}) {
  const state = ctx.state;
  const { data } = state.props;
  index = clampScrollIndex(index, data.length);
  const itemSize = getItemSizeAtIndex(ctx, index);
  const firstIndexOffset = calculateOffsetForIndex(ctx, index);
  const isLast = index === data.length - 1;
  if (isLast && viewPosition === void 0) {
    viewPosition = 1;
  }
  state.scrollForNextCalculateItemsInView = void 0;
  scrollTo(ctx, {
    animated,
    forceScroll,
    index,
    isInitialScroll,
    itemSize,
    offset: firstIndexOffset,
    viewOffset,
    viewPosition: viewPosition != null ? viewPosition : 0
  });
}

// src/core/initialScroll.ts
function dispatchInitialScroll(ctx, params) {
  const { forceScroll, resolvedOffset, target, waitForCompletionFrame } = params;
  const requestedIndex = target.index;
  const index = requestedIndex !== void 0 ? clampScrollIndex(requestedIndex, ctx.state.props.data.length) : void 0;
  const itemSize = getItemSizeAtIndex(ctx, index);
  scrollTo(ctx, {
    animated: false,
    forceScroll,
    index: index !== void 0 && index >= 0 ? index : void 0,
    isInitialScroll: true,
    itemSize,
    offset: resolvedOffset,
    precomputedWithViewOffset: true,
    viewOffset: target.viewOffset,
    viewPosition: target.viewPosition,
    waitForInitialScrollCompletionFrame: waitForCompletionFrame
  });
}
function setInitialScrollTarget(ctx, target, options) {
  var _a3;
  const { state } = ctx;
  state.clearPreservedInitialScrollOnNextFinish = void 0;
  if (state.timeoutPreservedInitialScrollClear !== void 0) {
    clearTimeout(state.timeoutPreservedInitialScrollClear);
    state.timeoutPreservedInitialScrollClear = void 0;
  }
  state.initialScroll = target;
  if (options == null ? void 0 : options.resetDidFinish) {
    resetInitialRenderState(ctx, { resetInitialScroll: true });
  }
  setInitialScrollSession(state, {
    kind: ((_a3 = state.initialScrollSession) == null ? void 0 : _a3.kind) === "offset" ? "offset" : "bootstrap"
  });
}
function resolveInitialScrollOffset(ctx, initialScroll) {
  var _a3, _b;
  const state = ctx.state;
  if (((_a3 = state.initialScrollSession) == null ? void 0 : _a3.kind) === "offset") {
    return (_b = initialScroll.contentOffset) != null ? _b : 0;
  }
  const baseOffset = initialScroll.index !== void 0 ? calculateOffsetForIndex(ctx, initialScroll.index) : 0;
  const resolvedOffset = calculateOffsetWithOffsetPosition(ctx, baseOffset, initialScroll);
  return clampScrollOffset(ctx, resolvedOffset, initialScroll);
}
function getAdvanceableInitialScrollState(state, options) {
  const { didFinishInitialScroll, queuedInitialLayout, scrollingTo } = state;
  const initialScroll = state.initialScroll;
  const isInitialScrollInProgress = !!(scrollingTo == null ? void 0 : scrollingTo.isInitialScroll);
  const shouldWaitForInitialLayout = !!(options == null ? void 0 : options.requiresMeasuredLayout) && !queuedInitialLayout && !isInitialScrollInProgress;
  if (!initialScroll || shouldWaitForInitialLayout || didFinishInitialScroll || scrollingTo && !isInitialScrollInProgress) {
    return void 0;
  }
  return {
    initialScroll,
    isInitialScrollInProgress,
    queuedInitialLayout,
    scrollingTo
  };
}
function advanceMeasuredInitialScroll(ctx, options) {
  var _a3, _b, _c;
  const state = ctx.state;
  const advanceableState = getAdvanceableInitialScrollState(state, {
    requiresMeasuredLayout: true
  });
  if (!advanceableState) {
    return false;
  }
  const { initialScroll, isInitialScrollInProgress, queuedInitialLayout } = advanceableState;
  const scrollingTo = isInitialScrollInProgress ? advanceableState.scrollingTo : void 0;
  const resolvedOffset = resolveInitialScrollOffset(ctx, initialScroll);
  const activeInitialTargetOffset = scrollingTo ? (_a3 = scrollingTo.targetOffset) != null ? _a3 : scrollingTo.offset : void 0;
  const didOffsetChange = initialScroll.contentOffset === void 0 || Math.abs(initialScroll.contentOffset - resolvedOffset) > 1;
  const didActiveInitialTargetChange = activeInitialTargetOffset !== void 0 && Math.abs(activeInitialTargetOffset - resolvedOffset) > 1;
  const isAlreadyAtDesiredInitialTarget = activeInitialTargetOffset !== void 0 && Math.abs(state.scroll - resolvedOffset) <= 1 && Math.abs(state.scrollPending - resolvedOffset) <= 1;
  if (!(options == null ? void 0 : options.forceScroll) && !didOffsetChange && isInitialScrollInProgress && !didActiveInitialTargetChange) {
    return false;
  }
  if ((options == null ? void 0 : options.forceScroll) && isAlreadyAtDesiredInitialTarget) {
    return false;
  }
  if (didOffsetChange && ((_b = state.initialScrollSession) == null ? void 0 : _b.kind) !== "offset") {
    setInitialScrollTarget(ctx, { ...initialScroll, contentOffset: resolvedOffset });
  }
  const forceScroll = (_c = options == null ? void 0 : options.forceScroll) != null ? _c : !!queuedInitialLayout || isInitialScrollInProgress && didOffsetChange;
  dispatchInitialScroll(ctx, {
    forceScroll,
    resolvedOffset,
    target: initialScroll
  });
  return true;
}
function advanceOffsetInitialScroll(ctx, options) {
  var _a3, _b;
  const state = ctx.state;
  const advanceableState = getAdvanceableInitialScrollState(state);
  if (!advanceableState) {
    return false;
  }
  const { initialScroll, queuedInitialLayout } = advanceableState;
  const resolvedOffset = (_a3 = initialScroll.contentOffset) != null ? _a3 : 0;
  const isAlreadyAtDesiredInitialTarget = Math.abs(state.scroll - resolvedOffset) <= 1 && Math.abs(state.scrollPending - resolvedOffset) <= 1;
  if ((options == null ? void 0 : options.forceScroll) && isAlreadyAtDesiredInitialTarget) {
    return false;
  }
  const hasMeasuredScrollLayout = !!state.lastLayout && state.scrollLength > 0;
  const forceScroll = (_b = options == null ? void 0 : options.forceScroll) != null ? _b : hasMeasuredScrollLayout || !!queuedInitialLayout;
  dispatchInitialScroll(ctx, {
    forceScroll,
    resolvedOffset,
    target: initialScroll
  });
  return true;
}
function advanceCurrentInitialScrollSession(ctx, options) {
  var _a3;
  return ((_a3 = ctx.state.initialScrollSession) == null ? void 0 : _a3.kind) === "offset" ? advanceOffsetInitialScroll(ctx, {
    forceScroll: options == null ? void 0 : options.forceScroll
  }) : advanceMeasuredInitialScroll(ctx, {
    forceScroll: options == null ? void 0 : options.forceScroll
  });
}

// src/utils/checkAllSizesKnown.ts
function checkAllSizesKnown(state, start, end) {
  if (start == null || end == null || start < 0 || end < start) {
    return false;
  }
  let hasMountedIndex = false;
  for (const key of state.containerItemKeys.keys()) {
    const index = state.indexByKey.get(key);
    if (index !== void 0 && index >= start && index <= end) {
      hasMountedIndex = true;
      const id = getId(state, index);
      if (id === void 0 || !state.sizesKnown.has(id)) {
        return false;
      }
    }
  }
  return hasMountedIndex;
}

// src/core/bootstrapInitialScroll.ts
var DEFAULT_BOOTSTRAP_REVEAL_EPSILON = 1;
var DEFAULT_BOOTSTRAP_REVEAL_MAX_FRAMES = 8;
var DEFAULT_BOOTSTRAP_REVEAL_MAX_PASSES = 24;
var BOOTSTRAP_REVEAL_ABORT_WARNING = "LegendList bootstrap initial scroll aborted after exceeding convergence bounds.";
function getBootstrapInitialScrollSession(state) {
  var _a3;
  return ((_a3 = state.initialScrollSession) == null ? void 0 : _a3.kind) === "bootstrap" ? state.initialScrollSession.bootstrap : void 0;
}
function isOffsetInitialScrollSession(state) {
  var _a3;
  return ((_a3 = state.initialScrollSession) == null ? void 0 : _a3.kind) === "offset";
}
function doVisibleIndicesMatch(previous, next) {
  if (!previous || previous.length !== next.length) {
    return false;
  }
  for (let i = 0; i < previous.length; i++) {
    if (previous[i] !== next[i]) {
      return false;
    }
  }
  return true;
}
function getBootstrapRevealVisibleIndices(options) {
  const { dataLength, getSize, offset, positions, scrollLength, startIndex: requestedStartIndex } = options;
  const endOffset = offset + scrollLength;
  const visibleIndices = [];
  let index = requestedStartIndex !== void 0 ? Math.max(0, Math.min(dataLength - 1, requestedStartIndex)) : 0;
  while (index > 0) {
    const previousIndex = index - 1;
    const previousPosition = positions[previousIndex];
    if (previousPosition === void 0) {
      index = previousIndex;
      continue;
    }
    const previousSize = getSize(previousIndex);
    if (previousSize === void 0) {
      index = previousIndex;
      continue;
    }
    if (previousPosition + previousSize <= offset) {
      break;
    }
    index = previousIndex;
  }
  for (; index < dataLength; index++) {
    const position = positions[index];
    if (position === void 0) {
      continue;
    }
    const size = getSize(index);
    if (size === void 0) {
      continue;
    }
    if (position < endOffset && position + size > offset) {
      visibleIndices.push(index);
    } else if (visibleIndices.length > 0 && position >= endOffset) {
      break;
    }
  }
  return visibleIndices;
}
function shouldAbortBootstrapReveal(options) {
  const {
    mountFrameCount,
    maxFrames = DEFAULT_BOOTSTRAP_REVEAL_MAX_FRAMES,
    maxPasses = DEFAULT_BOOTSTRAP_REVEAL_MAX_PASSES,
    passCount
  } = options;
  return mountFrameCount >= maxFrames || passCount >= maxPasses;
}
function abortBootstrapRevealIfNeeded(ctx, options) {
  if (!shouldAbortBootstrapReveal(options)) {
    return false;
  }
  if (IS_DEV) {
    console.warn(BOOTSTRAP_REVEAL_ABORT_WARNING);
  }
  abortBootstrapInitialScroll(ctx);
  return true;
}
function clearBootstrapInitialScrollSession(state) {
  var _a3;
  const bootstrapInitialScroll = getBootstrapInitialScrollSession(state);
  const frameHandle = bootstrapInitialScroll == null ? void 0 : bootstrapInitialScroll.frameHandle;
  if (frameHandle !== void 0 && typeof cancelAnimationFrame === "function") {
    cancelAnimationFrame(frameHandle);
  }
  if (bootstrapInitialScroll) {
    bootstrapInitialScroll.frameHandle = void 0;
  }
  setInitialScrollSession(state, {
    bootstrap: null,
    kind: (_a3 = state.initialScrollSession) == null ? void 0 : _a3.kind
  });
}
function startBootstrapInitialScrollSession(state, options) {
  var _a3, _b, _c;
  const previousBootstrapInitialScroll = getBootstrapInitialScrollSession(state);
  setInitialScrollSession(state, {
    bootstrap: {
      frameHandle: previousBootstrapInitialScroll == null ? void 0 : previousBootstrapInitialScroll.frameHandle,
      // Re-arming during the initial mount should spend from the same watchdog budget.
      mountFrameCount: (_a3 = previousBootstrapInitialScroll == null ? void 0 : previousBootstrapInitialScroll.mountFrameCount) != null ? _a3 : 0,
      passCount: 0,
      previousResolvedOffset: void 0,
      scroll: options.scroll,
      seedContentOffset: (_c = (_b = options.seedContentOffset) != null ? _b : previousBootstrapInitialScroll == null ? void 0 : previousBootstrapInitialScroll.seedContentOffset) != null ? _c : options.scroll,
      targetIndexSeed: options.targetIndexSeed,
      visibleIndices: void 0
    },
    kind: "bootstrap"
  });
}
function resetBootstrapInitialScrollSession(state, options) {
  var _a3, _b, _c;
  const bootstrapInitialScroll = getBootstrapInitialScrollSession(state);
  if (!bootstrapInitialScroll) {
    if ((options == null ? void 0 : options.scroll) !== void 0) {
      startBootstrapInitialScrollSession(state, {
        scroll: options.scroll,
        seedContentOffset: options.seedContentOffset,
        targetIndexSeed: options.targetIndexSeed
      });
    }
  } else {
    bootstrapInitialScroll.passCount = 0;
    bootstrapInitialScroll.previousResolvedOffset = void 0;
    bootstrapInitialScroll.scroll = (_a3 = options == null ? void 0 : options.scroll) != null ? _a3 : bootstrapInitialScroll.scroll;
    bootstrapInitialScroll.seedContentOffset = (_b = options == null ? void 0 : options.seedContentOffset) != null ? _b : bootstrapInitialScroll.seedContentOffset;
    bootstrapInitialScroll.targetIndexSeed = (_c = options == null ? void 0 : options.targetIndexSeed) != null ? _c : bootstrapInitialScroll.targetIndexSeed;
    bootstrapInitialScroll.visibleIndices = void 0;
    setInitialScrollSession(state, {
      bootstrap: bootstrapInitialScroll,
      kind: "bootstrap"
    });
  }
}
function queueBootstrapInitialScrollReevaluation(state) {
  requestAnimationFrame(() => {
    var _a3;
    if (getBootstrapInitialScrollSession(state)) {
      (_a3 = state.triggerCalculateItemsInView) == null ? void 0 : _a3.call(state, { forceFullItemPositions: true });
    }
  });
}
function ensureBootstrapInitialScrollFrameTicker(ctx) {
  const state = ctx.state;
  const bootstrapInitialScroll = getBootstrapInitialScrollSession(state);
  if (!bootstrapInitialScroll || bootstrapInitialScroll.frameHandle !== void 0) {
    return;
  }
  const tick = () => {
    const activeBootstrapInitialScroll = getBootstrapInitialScrollSession(state);
    if (!activeBootstrapInitialScroll) {
      return;
    }
    activeBootstrapInitialScroll.frameHandle = void 0;
    activeBootstrapInitialScroll.mountFrameCount += 1;
    if (abortBootstrapRevealIfNeeded(ctx, {
      mountFrameCount: activeBootstrapInitialScroll.mountFrameCount,
      passCount: activeBootstrapInitialScroll.passCount
    })) {
      return;
    }
    ensureBootstrapInitialScrollFrameTicker(ctx);
  };
  bootstrapInitialScroll.frameHandle = requestAnimationFrame(tick);
}
function rearmBootstrapInitialScroll(ctx, options) {
  resetBootstrapInitialScrollSession(ctx.state, options);
  ensureBootstrapInitialScrollFrameTicker(ctx);
  queueBootstrapInitialScrollReevaluation(ctx.state);
}
function createInitialScrollAtEndTarget(options) {
  const { dataLength, footerSize, preserveForFooterLayout, stylePaddingBottom } = options;
  return {
    contentOffset: void 0,
    index: Math.max(0, dataLength - 1),
    preserveForBottomPadding: true,
    preserveForFooterLayout,
    viewOffset: -stylePaddingBottom - footerSize,
    viewPosition: 1
  };
}
function shouldPreserveInitialScrollForBottomPadding(target) {
  return !!(target == null ? void 0 : target.preserveForBottomPadding);
}
function shouldPreserveInitialScrollForFooterLayout(target) {
  return !!(target == null ? void 0 : target.preserveForFooterLayout);
}
function isRetargetableBottomAlignedInitialScrollTarget(target) {
  return !!(target && target.viewPosition === 1 && (shouldPreserveInitialScrollForBottomPadding(target) || shouldPreserveInitialScrollForFooterLayout(target)));
}
function createRetargetedBottomAlignedInitialScroll(options) {
  const { dataLength, footerSize, initialScrollAtEnd, stylePaddingBottom, target } = options;
  const preserveForFooterLayout = shouldPreserveInitialScrollForFooterLayout(target);
  return {
    ...target,
    contentOffset: void 0,
    index: initialScrollAtEnd ? Math.max(0, dataLength - 1) : target.index,
    preserveForBottomPadding: true,
    preserveForFooterLayout,
    viewOffset: -stylePaddingBottom - (preserveForFooterLayout ? footerSize : 0),
    viewPosition: 1
  };
}
function areEquivalentBootstrapInitialScrollTargets(current, next) {
  return current.index === next.index && current.preserveForBottomPadding === next.preserveForBottomPadding && current.preserveForFooterLayout === next.preserveForFooterLayout && current.viewOffset === next.viewOffset && current.viewPosition === next.viewPosition;
}
function clearPendingInitialScrollFooterLayout(ctx, options) {
  const { dataLength, stylePaddingBottom, target } = options;
  if (!shouldPreserveInitialScrollForFooterLayout(target)) {
    return;
  }
  const clearedFooterTarget = createInitialScrollAtEndTarget({
    dataLength,
    footerSize: 0,
    preserveForFooterLayout: void 0,
    stylePaddingBottom
  });
  setInitialScrollTarget(ctx, clearedFooterTarget);
}
function clearFinishedViewportRetargetableInitialScroll(state) {
  clearPreservedInitialScrollTarget(state);
}
function didFinishedInitialScrollMoveAwayFromTarget(ctx, target, epsilon = DEFAULT_BOOTSTRAP_REVEAL_EPSILON) {
  const state = ctx.state;
  if (!state.didFinishInitialScroll) {
    return false;
  }
  const currentOffset = getObservedBootstrapInitialScrollOffset(state);
  return Math.abs(currentOffset - resolveInitialScrollOffset(ctx, target)) > epsilon;
}
function getObservedBootstrapInitialScrollOffset(state) {
  var _a3, _b, _c, _d;
  const observedOffset = (_b = (_a3 = state.refScroller.current) == null ? void 0 : _a3.getCurrentScrollOffset) == null ? void 0 : _b.call(_a3);
  return typeof observedOffset === "number" && Number.isFinite(observedOffset) ? observedOffset : (_d = (_c = state.scrollPending) != null ? _c : state.scroll) != null ? _d : 0;
}
function getPreservedEndAnchorOffsetDiff(ctx) {
  var _a3;
  const state = ctx.state;
  const initialScroll = state.initialScroll;
  if (!state.didFinishInitialScroll || ((_a3 = state.scrollingTo) == null ? void 0 : _a3.isInitialScroll) || !initialScroll || initialScroll.viewPosition !== 1 || state.props.data.length === 0 || isOffsetInitialScrollSession(state)) {
    return;
  }
  const currentOffset = typeof state.lastNativeScroll === "number" && Number.isFinite(state.lastNativeScroll) ? state.lastNativeScroll : getObservedBootstrapInitialScrollOffset(state);
  return resolveInitialScrollOffset(ctx, initialScroll) - currentOffset;
}
function schedulePreservedEndAnchorCorrection(ctx) {
  if (getPreservedEndAnchorOffsetDiff(ctx) === void 0) {
    return false;
  }
  const correction = {};
  schedulePreservedEndAnchorCorrectionFrame(ctx, correction);
  return true;
}
function schedulePreservedEndAnchorCorrectionFrame(ctx, correction) {
  const state = ctx.state;
  state.preservedEndAnchorCorrection = correction;
  requestAnimationFrame(() => {
    var _a3;
    const activeCorrection = state.preservedEndAnchorCorrection;
    if (activeCorrection !== correction) {
      return;
    }
    const offsetDiff = getPreservedEndAnchorOffsetDiff(ctx);
    if (offsetDiff === void 0 || Math.abs(offsetDiff) <= DEFAULT_BOOTSTRAP_REVEAL_EPSILON) {
      state.preservedEndAnchorCorrection = void 0;
      return;
    }
    const hasObservedNativeScrollAfterRequest = !activeCorrection.lastRequestTime || ((_a3 = state.lastNativeScrollTime) != null ? _a3 : 0) > activeCorrection.lastRequestTime;
    if (hasObservedNativeScrollAfterRequest) {
      activeCorrection.lastRequestTime = Date.now();
      requestAdjust(ctx, offsetDiff);
    }
    schedulePreservedEndAnchorCorrectionFrame(ctx, correction);
  });
}
function clearFinishedBootstrapInitialScrollTargetIfMovedAway(ctx) {
  var _a3, _b;
  const state = ctx.state;
  const initialScroll = state.initialScroll;
  if (!state.didFinishInitialScroll || ((_a3 = state.scrollingTo) == null ? void 0 : _a3.isInitialScroll) || (initialScroll == null ? void 0 : initialScroll.viewPosition) !== 1 || state.preservedEndAnchorCorrection) {
    return;
  }
  if (didFinishedInitialScrollMoveAwayFromTarget(ctx, initialScroll)) {
    const shouldKeepEndTargetAlive = isRetargetableBottomAlignedInitialScrollTarget(initialScroll) && peek$(ctx, "isAtEnd");
    if (!shouldKeepEndTargetAlive) {
      if (shouldPreserveInitialScrollForFooterLayout(initialScroll)) {
        clearPendingInitialScrollFooterLayout(ctx, {
          dataLength: state.props.data.length,
          stylePaddingBottom: (_b = state.props.stylePaddingBottom) != null ? _b : 0,
          target: initialScroll
        });
      } else {
        clearFinishedViewportRetargetableInitialScroll(state);
      }
    }
  }
}
function startBootstrapInitialScrollOnMount(ctx, options) {
  var _a3, _b, _c;
  const { initialScrollAtEnd, target } = options;
  const state = ctx.state;
  const offset = resolveInitialScrollOffset(ctx, target);
  const shouldFinishAtOrigin = offset === 0 && !initialScrollAtEnd && (isOffsetInitialScrollSession(state) ? Math.abs((_a3 = target.contentOffset) != null ? _a3 : 0) <= 1 : target.index === 0 && ((_b = target.viewPosition) != null ? _b : 0) === 0 && Math.abs((_c = target.viewOffset) != null ? _c : 0) <= 1);
  const shouldFinishWithPreservedTarget = state.props.data.length === 0 && target.index !== void 0;
  if (shouldFinishAtOrigin) {
    clearBootstrapInitialScrollSession(state);
    finishInitialScroll(ctx, {
      resolvedOffset: offset
    });
  } else if (shouldFinishWithPreservedTarget) {
    clearBootstrapInitialScrollSession(state);
    finishInitialScroll(ctx, {
      preserveTarget: true,
      resolvedOffset: offset
    });
  } else {
    startBootstrapInitialScrollSession(state, {
      scroll: offset,
      seedContentOffset: Platform.OS === "web" ? 0 : offset,
      targetIndexSeed: target.index
    });
    ensureBootstrapInitialScrollFrameTicker(ctx);
  }
}
function handleBootstrapInitialScrollDataChange(ctx, options) {
  const { dataLength, didDataChange, initialScrollAtEnd, previousDataLength, stylePaddingBottom } = options;
  const state = ctx.state;
  const initialScroll = state.initialScroll;
  if (isOffsetInitialScrollSession(state) || !initialScroll) {
    return;
  }
  const shouldResetDidFinish = !!(state.didFinishInitialScroll && previousDataLength === 0 && dataLength > 0 && initialScroll.index !== void 0);
  const bootstrapInitialScroll = getBootstrapInitialScrollSession(state);
  const shouldClearFinishedResizePreservation = !initialScrollAtEnd && didDataChange && dataLength > 0 && state.didFinishInitialScroll && !bootstrapInitialScroll && !shouldResetDidFinish;
  if (shouldClearFinishedResizePreservation) {
    clearPreservedInitialScrollTarget(state);
    return;
  }
  const shouldRetargetBottomAligned = dataLength > 0 && (initialScrollAtEnd || isRetargetableBottomAlignedInitialScrollTarget(initialScroll));
  if (!didDataChange && !shouldResetDidFinish && !shouldRetargetBottomAligned) {
    return;
  }
  if (shouldRetargetBottomAligned) {
    const updatedInitialScroll = initialScrollAtEnd ? createInitialScrollAtEndTarget({
      dataLength,
      footerSize: peek$(ctx, "footerSize") || 0,
      preserveForFooterLayout: shouldPreserveInitialScrollForFooterLayout(initialScroll),
      stylePaddingBottom
    }) : createRetargetedBottomAlignedInitialScroll({
      dataLength,
      footerSize: peek$(ctx, "footerSize") || 0,
      initialScrollAtEnd,
      stylePaddingBottom,
      target: initialScroll
    });
    if (!shouldResetDidFinish && didFinishedInitialScrollMoveAwayFromTarget(ctx, initialScroll)) {
      clearPendingInitialScrollFooterLayout(ctx, {
        dataLength,
        stylePaddingBottom,
        target: initialScroll
      });
      return;
    }
    if (!areEquivalentBootstrapInitialScrollTargets(initialScroll, updatedInitialScroll) || !!bootstrapInitialScroll || shouldResetDidFinish || didDataChange) {
      setInitialScrollTarget(ctx, updatedInitialScroll, {
        resetDidFinish: shouldResetDidFinish
      });
      rearmBootstrapInitialScroll(ctx, {
        scroll: resolveInitialScrollOffset(ctx, updatedInitialScroll),
        seedContentOffset: shouldResetDidFinish && !bootstrapInitialScroll ? getObservedBootstrapInitialScrollOffset(state) : void 0,
        targetIndexSeed: updatedInitialScroll.index
      });
      return;
    }
  }
  if (!didDataChange) {
    return;
  }
  if (bootstrapInitialScroll || shouldResetDidFinish) {
    setInitialScrollTarget(ctx, initialScroll, {
      resetDidFinish: shouldResetDidFinish
    });
    rearmBootstrapInitialScroll(ctx, {
      scroll: resolveInitialScrollOffset(ctx, initialScroll),
      seedContentOffset: shouldResetDidFinish && !bootstrapInitialScroll ? getObservedBootstrapInitialScrollOffset(state) : void 0,
      targetIndexSeed: initialScroll.index
    });
  }
}
function handleBootstrapInitialScrollFooterLayout(ctx, options) {
  const { dataLength, footerSize, initialScrollAtEnd, stylePaddingBottom } = options;
  const state = ctx.state;
  if (!initialScrollAtEnd) {
    return;
  }
  const initialScroll = state.initialScroll;
  if (isOffsetInitialScrollSession(state) || dataLength === 0 || !initialScroll) {
    return;
  }
  const shouldProcessFooterLayout = !!getBootstrapInitialScrollSession(state) || shouldPreserveInitialScrollForFooterLayout(initialScroll);
  if (!shouldProcessFooterLayout) {
    return;
  }
  if (didFinishedInitialScrollMoveAwayFromTarget(ctx, initialScroll)) {
    clearPendingInitialScrollFooterLayout(ctx, {
      dataLength,
      stylePaddingBottom,
      target: initialScroll
    });
  } else {
    const updatedInitialScroll = createInitialScrollAtEndTarget({
      dataLength,
      footerSize,
      preserveForFooterLayout: shouldPreserveInitialScrollForFooterLayout(initialScroll),
      stylePaddingBottom
    });
    const didTargetChange = initialScroll.index !== updatedInitialScroll.index || initialScroll.viewPosition !== updatedInitialScroll.viewPosition || initialScroll.viewOffset !== updatedInitialScroll.viewOffset;
    if (!didTargetChange) {
      clearPendingInitialScrollFooterLayout(ctx, {
        dataLength,
        stylePaddingBottom,
        target: initialScroll
      });
    } else {
      const didFinishInitialScroll = !!state.didFinishInitialScroll;
      setInitialScrollTarget(ctx, updatedInitialScroll, {
        resetDidFinish: didFinishInitialScroll
      });
      rearmBootstrapInitialScroll(ctx, {
        scroll: resolveInitialScrollOffset(ctx, updatedInitialScroll),
        targetIndexSeed: updatedInitialScroll.index
      });
    }
  }
}
function handleBootstrapInitialScrollLayoutChange(ctx) {
  var _a3, _b, _c;
  const state = ctx.state;
  const initialScroll = state.initialScroll;
  const bootstrapInitialScroll = getBootstrapInitialScrollSession(state);
  if (initialScroll && state.props.data.length > 0 && !isOffsetInitialScrollSession(state) && (bootstrapInitialScroll || initialScroll.viewPosition === 1)) {
    const resolvedOffset = resolveInitialScrollOffset(ctx, initialScroll);
    const scrollingTo = ((_a3 = state.scrollingTo) == null ? void 0 : _a3.isInitialScroll) ? state.scrollingTo : void 0;
    if (!bootstrapInitialScroll && (scrollingTo || state.didFinishInitialScroll)) {
      const currentOffset = scrollingTo ? (_b = scrollingTo.targetOffset) != null ? _b : scrollingTo.offset : getObservedBootstrapInitialScrollOffset(state);
      const offsetDiff = resolvedOffset - currentOffset;
      if (Math.abs(offsetDiff) > DEFAULT_BOOTSTRAP_REVEAL_EPSILON) {
        if (state.didFinishInitialScroll) {
          schedulePreservedEndAnchorCorrection(ctx);
        } else if (scrollingTo) {
          const existingWatchdog = initialScrollWatchdog.get(state);
          scrollingTo.offset = resolvedOffset;
          scrollingTo.targetOffset = resolvedOffset;
          state.initialScroll = {
            ...initialScroll,
            contentOffset: resolvedOffset
          };
          state.hasScrolled = false;
          initialScrollWatchdog.set(state, {
            startScroll: (_c = existingWatchdog == null ? void 0 : existingWatchdog.startScroll) != null ? _c : state.scroll,
            targetOffset: resolvedOffset
          });
          requestAdjust(ctx, offsetDiff);
        }
      }
    } else {
      rearmBootstrapInitialScroll(ctx, {
        scroll: resolvedOffset,
        targetIndexSeed: initialScroll.index
      });
    }
  }
}
function evaluateBootstrapInitialScroll(ctx) {
  var _a3, _b;
  const state = ctx.state;
  const bootstrapInitialScroll = getBootstrapInitialScrollSession(state);
  const initialScroll = state.initialScroll;
  if (!bootstrapInitialScroll || !initialScroll || isOffsetInitialScrollSession(state) || ((_a3 = state.scrollingTo) == null ? void 0 : _a3.isInitialScroll)) {
    return;
  }
  bootstrapInitialScroll.passCount += 1;
  if (abortBootstrapRevealIfNeeded(ctx, {
    mountFrameCount: bootstrapInitialScroll.mountFrameCount,
    passCount: bootstrapInitialScroll.passCount
  })) {
    return;
  }
  if (initialScroll.index !== void 0 && state.startBuffered >= 0 && state.endBuffered >= 0 && initialScroll.index >= state.startBuffered && initialScroll.index <= state.endBuffered) {
    bootstrapInitialScroll.targetIndexSeed = void 0;
  }
  const resolvedOffset = resolveInitialScrollOffset(ctx, initialScroll);
  const areMountedBufferedIndicesMeasured = checkAllSizesKnown(state, state.startBuffered, state.endBuffered);
  const didResolvedOffsetChange = Math.abs(bootstrapInitialScroll.scroll - resolvedOffset) > 1;
  const { data } = state.props;
  const visibleIndices = getBootstrapRevealVisibleIndices({
    dataLength: data.length,
    getSize: (index) => {
      var _a4, _b2;
      const id = (_a4 = state.idCache[index]) != null ? _a4 : getId(state, index);
      return (_b2 = state.sizes.get(id)) != null ? _b2 : getItemSize(ctx, id, index, data[index]);
    },
    offset: resolvedOffset,
    positions: state.positions,
    scrollLength: state.scrollLength,
    startIndex: (_b = bootstrapInitialScroll.targetIndexSeed) != null ? _b : state.startBuffered >= 0 ? state.startBuffered : void 0
  });
  const areVisibleIndicesMeasured = visibleIndices.length > 0 && visibleIndices.every((index) => {
    var _a4;
    const id = (_a4 = state.idCache[index]) != null ? _a4 : getId(state, index);
    return state.sizesKnown.has(id);
  });
  const previousResolvedOffset = bootstrapInitialScroll.previousResolvedOffset;
  const previousVisibleIndices = bootstrapInitialScroll.visibleIndices;
  bootstrapInitialScroll.previousResolvedOffset = resolvedOffset;
  bootstrapInitialScroll.visibleIndices = visibleIndices;
  if (didResolvedOffsetChange) {
    bootstrapInitialScroll.scroll = resolvedOffset;
    queueBootstrapInitialScrollReevaluation(state);
    return;
  }
  if (!areMountedBufferedIndicesMeasured || !areVisibleIndicesMeasured) {
    return;
  }
  const didRevealSettle = previousResolvedOffset !== void 0 && Math.abs(previousResolvedOffset - resolvedOffset) <= DEFAULT_BOOTSTRAP_REVEAL_EPSILON && doVisibleIndicesMatch(previousVisibleIndices, visibleIndices);
  if (!didRevealSettle) {
    queueBootstrapInitialScrollReevaluation(state);
    return;
  }
  if (Platform.OS !== "web" && Platform.OS !== "android" && Math.abs(bootstrapInitialScroll.seedContentOffset - resolvedOffset) <= 1 && Math.abs(getObservedBootstrapInitialScrollOffset(state) - resolvedOffset) <= 1) {
    finishBootstrapInitialScrollWithoutScroll(ctx, resolvedOffset);
  } else {
    clearBootstrapInitialScrollSession(state);
    dispatchInitialScroll(ctx, {
      forceScroll: true,
      resolvedOffset,
      target: initialScroll,
      waitForCompletionFrame: Platform.OS === "web"
    });
  }
}
function finishBootstrapInitialScrollWithoutScroll(ctx, resolvedOffset) {
  var _a3;
  const state = ctx.state;
  clearBootstrapInitialScrollSession(state);
  const shouldPreserveResizeTarget = !state.clearPreservedInitialScrollOnNextFinish && state.props.data.length > 0 && ((_a3 = state.initialScroll) == null ? void 0 : _a3.viewPosition) === 1;
  finishInitialScroll(ctx, {
    preserveTarget: shouldPreserveResizeTarget,
    recalculateItems: true,
    resolvedOffset,
    schedulePreservedTargetClear: shouldPreserveResizeTarget
  });
}
function abortBootstrapInitialScroll(ctx) {
  var _a3, _b, _c, _d;
  const state = ctx.state;
  const bootstrapInitialScroll = getBootstrapInitialScrollSession(state);
  const initialScroll = state.initialScroll;
  if (bootstrapInitialScroll && initialScroll && !isOffsetInitialScrollSession(state) && state.refScroller.current) {
    clearBootstrapInitialScrollSession(state);
    dispatchInitialScroll(ctx, {
      forceScroll: true,
      resolvedOffset: bootstrapInitialScroll.scroll,
      target: initialScroll,
      waitForCompletionFrame: Platform.OS === "web"
    });
  } else {
    finishBootstrapInitialScrollWithoutScroll(
      ctx,
      (_d = (_c = (_b = (_a3 = getBootstrapInitialScrollSession(state)) == null ? void 0 : _a3.scroll) != null ? _b : state.scrollPending) != null ? _c : state.scroll) != null ? _d : 0
    );
  }
}

// src/core/initialScrollLifecycle.ts
function retargetActiveInitialScrollAtEnd(ctx) {
  var _a3;
  const state = ctx.state;
  const initialScroll = state.initialScroll;
  if (state.didFinishInitialScroll) {
    return schedulePreservedEndAnchorCorrection(ctx);
  }
  if (!initialScroll || ((_a3 = state.initialScrollSession) == null ? void 0 : _a3.kind) === "offset" || initialScroll.viewPosition !== 1 || state.props.data.length === 0) {
    return false;
  }
  return advanceCurrentInitialScrollSession(ctx, { forceScroll: true });
}
function handleInitialScrollLayoutReady(ctx) {
  var _a3;
  if (!ctx.state.initialScroll) {
    return;
  }
  const runScroll = () => advanceCurrentInitialScrollSession(ctx, { forceScroll: true });
  runScroll();
  if (((_a3 = ctx.state.initialScrollSession) == null ? void 0 : _a3.kind) !== "offset") {
    requestAnimationFrame(runScroll);
  }
  checkFinishedScroll(ctx, { onlyIfAligned: true });
}
function initializeInitialScrollOnMount(ctx, options) {
  var _a3, _b;
  const {
    alwaysDispatchInitialScroll,
    dataLength,
    hasFooterComponent,
    initialContentOffset,
    initialScrollAtEnd,
    useBootstrapInitialScroll
  } = options;
  const state = ctx.state;
  const initialScroll = state.initialScroll;
  const resolvedInitialContentOffset = initialContentOffset != null ? initialContentOffset : 0;
  const preserveForFooterLayout = useBootstrapInitialScroll && initialScrollAtEnd && hasFooterComponent;
  if (initialScroll && (initialScroll.contentOffset === void 0 || !!initialScroll.preserveForFooterLayout !== preserveForFooterLayout && ((_a3 = state.initialScrollSession) == null ? void 0 : _a3.kind) !== "offset")) {
    setInitialScrollTarget(ctx, {
      ...initialScroll,
      contentOffset: resolvedInitialContentOffset,
      preserveForFooterLayout
    });
  }
  if (useBootstrapInitialScroll && initialScroll && ((_b = state.initialScrollSession) == null ? void 0 : _b.kind) !== "offset") {
    startBootstrapInitialScrollOnMount(ctx, {
      initialScrollAtEnd,
      target: state.initialScroll
    });
    return;
  }
  const hasPendingDataDependentInitialScroll = !!initialScroll && dataLength === 0 && !(resolvedInitialContentOffset === 0 && !initialScrollAtEnd);
  if (!alwaysDispatchInitialScroll && !resolvedInitialContentOffset && !hasPendingDataDependentInitialScroll) {
    if (initialScroll && !initialScrollAtEnd) {
      finishInitialScroll(ctx, {
        resolvedOffset: resolvedInitialContentOffset
      });
    } else {
      setInitialRenderState(ctx, { didInitialScroll: true });
    }
  }
}
function handleInitialScrollDataChange(ctx, options) {
  var _a3, _b, _c;
  const {
    dataLength,
    didDataChange,
    didStartFreshData,
    initialScrollAtEnd,
    latestInitialScroll,
    latestInitialScrollSessionKind,
    stylePaddingBottom,
    useBootstrapInitialScroll
  } = options;
  const state = ctx.state;
  const previousInitialScrollDataLength = (_b = (_a3 = state.initialScrollSession) == null ? void 0 : _a3.previousDataLength) != null ? _b : 0;
  const shouldUseLatestInitialScroll = dataLength > 0 && (!state.hasHadNonEmptyData || didStartFreshData);
  if (dataLength > 0) {
    state.hasHadNonEmptyData = true;
  }
  if (shouldUseLatestInitialScroll) {
    if (latestInitialScroll) {
      setInitialScrollTarget(ctx, latestInitialScroll);
      setInitialScrollSession(state, {
        kind: latestInitialScrollSessionKind,
        previousDataLength: previousInitialScrollDataLength
      });
    } else {
      clearPreservedInitialScrollTarget(state);
    }
  }
  if (state.initialScrollSession) {
    state.initialScrollSession.previousDataLength = dataLength;
  }
  setInitialScrollSession(state);
  if (useBootstrapInitialScroll) {
    handleBootstrapInitialScrollDataChange(ctx, {
      dataLength,
      didDataChange,
      initialScrollAtEnd,
      previousDataLength: previousInitialScrollDataLength,
      stylePaddingBottom
    });
    return;
  }
  const shouldReplayFinishedOffsetInitialScroll = previousInitialScrollDataLength === 0 && dataLength > 0 && !!state.initialScroll && ((_c = ctx.state.initialScrollSession) == null ? void 0 : _c.kind) === "offset" && !!state.didFinishInitialScroll;
  if (previousInitialScrollDataLength !== 0 || dataLength === 0 || !state.initialScroll || !state.queuedInitialLayout || state.didFinishInitialScroll && !shouldReplayFinishedOffsetInitialScroll) {
    return;
  }
  if (shouldReplayFinishedOffsetInitialScroll) {
    resetInitialRenderState(ctx, { resetInitialScroll: true });
  }
  advanceCurrentInitialScrollSession(ctx);
}

// src/core/resetLayoutCachesForDataChange.ts
function resetLayoutCachesForDataChange(state) {
  state.indexByKey.clear();
  state.idCache.length = 0;
  state.positions.length = 0;
  state.columns.length = 0;
  state.columnSpans.length = 0;
}

// src/core/syncMountedContainer.ts
function syncMountedContainer(ctx, containerIndex, itemIndex, options) {
  var _a3, _b, _c, _d, _e, _f, _g, _h, _i;
  const state = ctx.state;
  const {
    columns,
    columnSpans,
    positions,
    props: { data, itemsAreEqual, keyExtractor }
  } = state;
  const item = data[itemIndex];
  if (item === void 0) {
    return { didChangePosition: false, didRefreshData: false };
  }
  const itemKey = (_a3 = state.idCache[itemIndex]) != null ? _a3 : getId(state, itemIndex);
  const updateLayout = (_b = options == null ? void 0 : options.updateLayout) != null ? _b : true;
  let didChangePosition = false;
  let didRefreshData = false;
  if (updateLayout) {
    const positionValue = positions[itemIndex];
    if (positionValue === void 0) {
      set$(ctx, `containerPosition${containerIndex}`, POSITION_OUT_OF_VIEW);
      return { didChangePosition: false, didRefreshData: false };
    }
    const logicalPosition = (positionValue || 0) - ((_c = options == null ? void 0 : options.scrollAdjustPending) != null ? _c : 0);
    const itemSize = (_d = state.sizes.get(itemKey)) != null ? _d : getItemSize(ctx, itemKey, itemIndex, item);
    const position = toPhysicalHorizontalItemPosition(state, logicalPosition, itemSize, peek$(ctx, "totalSize"));
    const column = columns[itemIndex] || 1;
    const span = columnSpans[itemIndex] || 1;
    const prevPos = peek$(ctx, `containerPosition${containerIndex}`);
    const prevColumn = peek$(ctx, `containerColumn${containerIndex}`);
    const prevSpan = peek$(ctx, `containerSpan${containerIndex}`);
    if (position > POSITION_OUT_OF_VIEW && position !== prevPos) {
      set$(ctx, `containerPosition${containerIndex}`, position);
      didChangePosition = true;
    }
    if (column >= 0 && column !== prevColumn) {
      set$(ctx, `containerColumn${containerIndex}`, column);
    }
    if (span !== prevSpan) {
      set$(ctx, `containerSpan${containerIndex}`, span);
    }
  }
  const prevData = peek$(ctx, `containerItemData${containerIndex}`);
  if (prevData !== item) {
    const pendingDataComparison = ((_e = state.pendingDataComparison) == null ? void 0 : _e.previousData) === state.previousData && ((_f = state.pendingDataComparison) == null ? void 0 : _f.nextData) === data ? state.pendingDataComparison : void 0;
    const cachedComparison = (_g = pendingDataComparison == null ? void 0 : pendingDataComparison.byIndex[itemIndex]) != null ? _g : 0;
    if (cachedComparison === 2) {
      set$(ctx, `containerItemData${containerIndex}`, item);
      didRefreshData = true;
    } else if (cachedComparison !== 1) {
      const nextItemKey = (_h = peek$(ctx, `containerItemKey${containerIndex}`)) != null ? _h : itemKey;
      const prevKey = keyExtractor == null ? void 0 : keyExtractor(prevData, itemIndex);
      if (prevData === void 0 || !keyExtractor || prevKey !== nextItemKey) {
        set$(ctx, `containerItemData${containerIndex}`, item);
        didRefreshData = true;
      } else if (!itemsAreEqual) {
        set$(ctx, `containerItemData${containerIndex}`, item);
        didRefreshData = true;
      } else {
        const isEqual = itemsAreEqual(prevData, item, itemIndex, data);
        if (!state.pendingDataComparison || state.pendingDataComparison.previousData !== state.previousData || state.pendingDataComparison.nextData !== data) {
          if (state.previousData) {
            state.pendingDataComparison = {
              byIndex: [],
              nextData: data,
              previousData: state.previousData
            };
          }
        }
        if ((_i = state.pendingDataComparison) == null ? void 0 : _i.byIndex) {
          state.pendingDataComparison.byIndex[itemIndex] = isEqual ? 1 : 2;
        }
        if (!isEqual) {
          set$(ctx, `containerItemData${containerIndex}`, item);
          didRefreshData = true;
        }
      }
    }
  }
  return { didChangePosition, didRefreshData };
}

// src/core/prepareColumnStartState.ts
function prepareColumnStartState(ctx, startIndex, useAverageSize) {
  var _a3;
  const state = ctx.state;
  const numColumns = peek$(ctx, "numColumns");
  let rowStartIndex = startIndex;
  const columnAtStart = state.columns[startIndex];
  if (columnAtStart !== 1) {
    rowStartIndex = findRowStartIndex(state, numColumns, startIndex);
  }
  let currentRowTop = 0;
  const column = state.columns[rowStartIndex];
  if (rowStartIndex > 0) {
    const prevIndex = rowStartIndex - 1;
    const prevPosition = (_a3 = state.positions[prevIndex]) != null ? _a3 : 0;
    const prevRowStart = findRowStartIndex(state, numColumns, prevIndex);
    const prevRowHeight = calculateRowMaxSize(ctx, prevRowStart, prevIndex, useAverageSize);
    currentRowTop = prevPosition + prevRowHeight;
  }
  return {
    column,
    currentRowTop,
    startIndex: rowStartIndex
  };
}
function findRowStartIndex(state, numColumns, index) {
  if (numColumns <= 1) {
    return Math.max(0, index);
  }
  let rowStart = Math.max(0, index);
  while (rowStart > 0) {
    const columnForIndex = state.columns[rowStart];
    if (columnForIndex === 1) {
      break;
    }
    rowStart--;
  }
  return rowStart;
}
function calculateRowMaxSize(ctx, startIndex, endIndex, useAverageSize) {
  const state = ctx.state;
  if (endIndex < startIndex) {
    return 0;
  }
  const { data } = state.props;
  if (!data) {
    return 0;
  }
  let maxSize = 0;
  for (let i = startIndex; i <= endIndex; i++) {
    if (i < 0 || i >= data.length) {
      continue;
    }
    const id = state.idCache[i];
    const size = getItemSize(ctx, id, i, data[i], useAverageSize);
    if (size > maxSize) {
      maxSize = size;
    }
  }
  return maxSize;
}

// src/core/updateTotalSize.ts
function updateTotalSize(ctx) {
  var _a3, _b;
  const state = ctx.state;
  const {
    positions,
    props: { data }
  } = state;
  const numColumns = (_a3 = peek$(ctx, "numColumns")) != null ? _a3 : 1;
  if (data.length === 0) {
    addTotalSize(ctx, null, 0);
  } else {
    const lastIndex = data.length - 1;
    const lastId = getId(state, lastIndex);
    const lastPosition = positions[lastIndex];
    if (lastId !== void 0 && lastPosition !== void 0) {
      if (numColumns > 1) {
        let rowStart = lastIndex;
        while (rowStart > 0) {
          const column = state.columns[rowStart];
          if (column === 1 || column === void 0) {
            break;
          }
          rowStart -= 1;
        }
        let maxSize = 0;
        for (let i = rowStart; i <= lastIndex; i++) {
          const rowId = (_b = state.idCache[i]) != null ? _b : getId(state, i);
          const size = getItemSize(ctx, rowId, i, data[i]);
          if (size > maxSize) {
            maxSize = size;
          }
        }
        addTotalSize(ctx, null, lastPosition + maxSize);
      } else {
        const lastSize = getItemSize(ctx, lastId, lastIndex, data[lastIndex]);
        if (lastSize !== void 0) {
          const totalSize = lastPosition + lastSize;
          addTotalSize(ctx, null, totalSize);
        }
      }
    }
  }
}

// src/utils/updateSnapToOffsets.ts
function updateSnapToOffsets(ctx) {
  const state = ctx.state;
  const {
    props: { snapToIndices }
  } = state;
  const contentSize = state.props.horizontal ? getContentSize(ctx) : void 0;
  const snapToOffsets = Array(snapToIndices.length);
  for (let i = 0; i < snapToIndices.length; i++) {
    const idx = snapToIndices[i];
    getId(state, idx);
    const logicalOffset = state.positions[idx];
    snapToOffsets[i] = toNativeHorizontalOffset(state, logicalOffset, contentSize);
  }
  set$(ctx, "snapToOffsets", snapToOffsets);
}

// src/core/updateItemPositions.ts
function updateItemPositions(ctx, dataChanged, {
  doMVCP,
  forceFullUpdate = false,
  optimizeForVisibleWindow = false,
  scrollBottomBuffered,
  scrollVelocity,
  startIndex
} = {
  doMVCP: false,
  forceFullUpdate: false,
  optimizeForVisibleWindow: false,
  scrollBottomBuffered: -1,
  startIndex: 0
}) {
  var _a3, _b, _c, _d, _e;
  const state = ctx.state;
  const hasPositionListeners = ctx.positionListeners.size > 0;
  const {
    columns,
    columnSpans,
    indexByKey,
    positions,
    idCache,
    sizesKnown,
    props: { data, overrideItemLayout, snapToIndices },
    scrollingTo
  } = state;
  const dataLength = data.length;
  const numColumns = (_a3 = peek$(ctx, "numColumns")) != null ? _a3 : 1;
  const hasColumns = numColumns > 1;
  const indexByKeyForChecking = IS_DEV ? /* @__PURE__ */ new Map() : void 0;
  const extraData = peek$(ctx, "extraData");
  const layoutConfig = overrideItemLayout ? { span: 1 } : void 0;
  const lastScrollDelta = state.lastScrollDelta;
  const velocity = scrollVelocity != null ? scrollVelocity : getScrollVelocity(state);
  const shouldOptimize = !forceFullUpdate && !dataChanged && (optimizeForVisibleWindow || Math.abs(velocity) > 0 || Platform.OS === "web" && state.scrollLength > 0 && lastScrollDelta > state.scrollLength);
  const maxVisibleArea = scrollBottomBuffered + 1e3;
  const useAverageSize = true;
  const preferCachedSize = !doMVCP || dataChanged || state.scrollAdjustHandler.getAdjust() !== 0 || ((_b = peek$(ctx, "scrollAdjustPending")) != null ? _b : 0) !== 0;
  const notifyTotalSizeWhileCachingSizes = false;
  let currentRowTop = 0;
  let column = 1;
  let maxSizeInRow = 0;
  if (dataChanged) {
    columnSpans.length = 0;
  }
  if (!hasColumns) {
    if (columns.length) {
      columns.length = 0;
    }
    if (columnSpans.length) {
      columnSpans.length = 0;
    }
  }
  if (startIndex > 0) {
    if (hasColumns) {
      const { startIndex: processedStartIndex, currentRowTop: initialRowTop } = prepareColumnStartState(
        ctx,
        startIndex,
        useAverageSize
      );
      startIndex = processedStartIndex;
      currentRowTop = initialRowTop;
    } else if (startIndex < dataLength) {
      const prevIndex = startIndex - 1;
      const prevId = getId(state, prevIndex);
      const prevPosition = (_c = positions[prevIndex]) != null ? _c : 0;
      const prevSize = (_d = sizesKnown.get(prevId)) != null ? _d : getItemSize(
        ctx,
        prevId,
        prevIndex,
        data[prevIndex],
        useAverageSize,
        preferCachedSize,
        notifyTotalSizeWhileCachingSizes
      );
      currentRowTop = prevPosition + prevSize;
    }
  }
  const needsIndexByKey = dataChanged || indexByKey.size === 0;
  const canOverrideSpan = hasColumns && !!overrideItemLayout && !!layoutConfig;
  let didBreakEarly = false;
  let breakAt;
  for (let i = startIndex; i < dataLength; i++) {
    if (shouldOptimize && breakAt !== void 0 && i > breakAt) {
      didBreakEarly = true;
      break;
    }
    if (shouldOptimize && breakAt === void 0 && !scrollingTo && !dataChanged && currentRowTop > maxVisibleArea) {
      const itemsPerRow = hasColumns ? numColumns : 1;
      breakAt = i + itemsPerRow + 10;
    }
    const id = (_e = idCache[i]) != null ? _e : getId(state, i);
    let span = 1;
    if (canOverrideSpan) {
      layoutConfig.span = 1;
      overrideItemLayout(layoutConfig, data[i], i, numColumns, extraData);
      const requestedSpan = layoutConfig.span;
      if (requestedSpan !== void 0 && Number.isFinite(requestedSpan)) {
        span = Math.max(1, Math.min(numColumns, Math.round(requestedSpan)));
      }
    }
    if (hasColumns && column + span - 1 > numColumns) {
      currentRowTop += maxSizeInRow;
      column = 1;
      maxSizeInRow = 0;
    }
    const knownSize = sizesKnown.get(id);
    const size = knownSize !== void 0 ? knownSize : getItemSize(ctx, id, i, data[i], useAverageSize, preferCachedSize, notifyTotalSizeWhileCachingSizes);
    if (IS_DEV && needsIndexByKey) {
      if (indexByKeyForChecking.has(id)) {
        console.error(
          `[legend-list] Error: Detected overlapping key (${id}) which causes missing items and gaps and other terrrible things. Check that keyExtractor returns unique values.`
        );
      }
      indexByKeyForChecking.set(id, i);
    }
    if (currentRowTop !== positions[i]) {
      positions[i] = currentRowTop;
      if (hasPositionListeners) {
        notifyPosition$(ctx, id, currentRowTop);
      }
    }
    if (needsIndexByKey) {
      indexByKey.set(id, i);
    }
    if (!hasColumns) {
      currentRowTop += size;
    } else {
      columns[i] = column;
      columnSpans[i] = span;
      if (size > maxSizeInRow) {
        maxSizeInRow = size;
      }
      column += span;
      if (column > numColumns) {
        currentRowTop += maxSizeInRow;
        column = 1;
        maxSizeInRow = 0;
      }
    }
  }
  if (!didBreakEarly) {
    updateTotalSize(ctx);
  }
  if (snapToIndices) {
    updateSnapToOffsets(ctx);
  }
}

// src/core/viewability.ts
function ensureViewabilityState(ctx, configId) {
  let map = ctx.mapViewabilityConfigStates;
  if (!map) {
    map = /* @__PURE__ */ new Map();
    ctx.mapViewabilityConfigStates = map;
  }
  let state = map.get(configId);
  if (!state) {
    state = {
      end: -1,
      endBuffered: -1,
      previousEnd: -1,
      previousStart: -1,
      start: -1,
      startBuffered: -1,
      viewableItems: []
    };
    map.set(configId, state);
  }
  return state;
}
function setupViewability(props) {
  let { viewabilityConfig, viewabilityConfigCallbackPairs, onViewableItemsChanged } = props;
  if (viewabilityConfig || onViewableItemsChanged) {
    viewabilityConfigCallbackPairs = [
      ...viewabilityConfigCallbackPairs || [],
      {
        onViewableItemsChanged,
        viewabilityConfig: viewabilityConfig || {
          viewAreaCoveragePercentThreshold: 0
        }
      }
    ];
  }
  return viewabilityConfigCallbackPairs;
}
function updateViewableItems(state, ctx, viewabilityConfigCallbackPairs, scrollSize, start, end, startBuffered = start, endBuffered = end) {
  const {
    timeouts,
    props: { data }
  } = state;
  for (const viewabilityConfigCallbackPair of viewabilityConfigCallbackPairs) {
    const viewabilityState = ensureViewabilityState(ctx, viewabilityConfigCallbackPair.viewabilityConfig.id);
    viewabilityState.start = start;
    viewabilityState.end = end;
    viewabilityState.startBuffered = startBuffered;
    viewabilityState.endBuffered = endBuffered;
    if (viewabilityConfigCallbackPair.viewabilityConfig.minimumViewTime) {
      const timer = setTimeout(() => {
        timeouts.delete(timer);
        updateViewableItemsWithConfig(data, viewabilityConfigCallbackPair, state, ctx, scrollSize);
      }, viewabilityConfigCallbackPair.viewabilityConfig.minimumViewTime);
      timeouts.add(timer);
    } else {
      updateViewableItemsWithConfig(data, viewabilityConfigCallbackPair, state, ctx, scrollSize);
    }
  }
}
function updateViewableItemsWithConfig(data, viewabilityConfigCallbackPair, state, ctx, scrollSize) {
  const { viewabilityConfig, onViewableItemsChanged } = viewabilityConfigCallbackPair;
  const configId = viewabilityConfig.id;
  const viewabilityState = ensureViewabilityState(ctx, configId);
  const { viewableItems: previousViewableItems, start, end, startBuffered, endBuffered } = viewabilityState;
  let staleViewabilityAmountIds;
  for (const [containerId, value] of ctx.mapViewabilityAmountValues) {
    const nextValue = computeViewability(
      state,
      ctx,
      viewabilityConfig,
      containerId,
      value.key,
      scrollSize,
      value.item,
      value.index
    );
    if (nextValue.sizeVisible < 0) {
      staleViewabilityAmountIds != null ? staleViewabilityAmountIds : staleViewabilityAmountIds = [];
      staleViewabilityAmountIds.push(containerId);
    }
  }
  const changed = [];
  const previousViewableKeys = /* @__PURE__ */ new Set();
  if (previousViewableItems) {
    for (const viewToken of previousViewableItems) {
      previousViewableKeys.add(viewToken.key);
      const containerId = findContainerId(ctx, viewToken.key);
      if (!checkIsViewable(
        state,
        ctx,
        viewabilityConfig,
        containerId,
        viewToken.key,
        scrollSize,
        viewToken.item,
        viewToken.index
      )) {
        viewToken.isViewable = false;
        changed.push(viewToken);
      }
    }
  }
  const viewableItems = [];
  for (let i = start; i <= end; i++) {
    const item = data[i];
    if (item) {
      const key = getId(state, i);
      const containerId = findContainerId(ctx, key);
      if (checkIsViewable(state, ctx, viewabilityConfig, containerId, key, scrollSize, item, i)) {
        const viewToken = {
          containerId,
          index: i,
          isViewable: true,
          item,
          key
        };
        viewableItems.push(viewToken);
        if (!previousViewableKeys.has(viewToken.key)) {
          changed.push(viewToken);
        }
      }
    }
  }
  Object.assign(viewabilityState, {
    previousEnd: end,
    previousStart: start,
    viewableItems
  });
  if (changed.length > 0) {
    viewabilityState.viewableItems = viewableItems;
    for (let i = 0; i < changed.length; i++) {
      const change = changed[i];
      maybeUpdateViewabilityCallback(ctx, configId, change.containerId, change);
    }
    if (onViewableItemsChanged) {
      onViewableItemsChanged({ changed, end, endBuffered, start, startBuffered, viewableItems });
    }
  }
  if (staleViewabilityAmountIds) {
    for (const containerId of staleViewabilityAmountIds) {
      const value = ctx.mapViewabilityAmountValues.get(containerId);
      if (value && value.sizeVisible < 0) {
        ctx.mapViewabilityAmountValues.delete(containerId);
      }
    }
  }
}
function areViewabilityAmountTokensEqual(prev, next) {
  return !!prev && prev.containerId === next.containerId && prev.index === next.index && prev.isViewable === next.isViewable && prev.item === next.item && prev.key === next.key && prev.percentOfScroller === next.percentOfScroller && prev.percentVisible === next.percentVisible && prev.scrollSize === next.scrollSize && prev.size === next.size && prev.sizeVisible === next.sizeVisible;
}
function computeViewability(state, ctx, viewabilityConfig, containerId, key, scrollSize, item, index) {
  const { sizes, scroll: scrollState } = state;
  const topPad = (peek$(ctx, "stylePaddingTop") || 0) + (peek$(ctx, "alignItemsAtEndPadding") || 0) + (peek$(ctx, "headerSize") || 0);
  const { itemVisiblePercentThreshold, viewAreaCoveragePercentThreshold } = viewabilityConfig;
  const viewAreaMode = viewAreaCoveragePercentThreshold != null;
  const viewablePercentThreshold = viewAreaMode ? viewAreaCoveragePercentThreshold : itemVisiblePercentThreshold;
  const scroll = scrollState - topPad;
  const position = state.positions[index];
  const size = sizes.get(key) || 0;
  if (position === void 0) {
    const value2 = {
      containerId,
      index,
      isViewable: false,
      item,
      key,
      percentOfScroller: 0,
      percentVisible: 0,
      scrollSize,
      size,
      sizeVisible: -1
    };
    const prev2 = ctx.mapViewabilityAmountValues.get(containerId);
    if (!areViewabilityAmountTokensEqual(prev2, value2)) {
      ctx.mapViewabilityAmountValues.set(containerId, value2);
      const cb = ctx.mapViewabilityAmountCallbacks.get(containerId);
      if (cb) {
        cb(value2);
      }
    }
    return value2;
  }
  const top = position - scroll;
  const bottom = top + size;
  const isEntirelyVisible = top >= 0 && bottom <= scrollSize && bottom > top;
  const sizeVisible = isEntirelyVisible ? size : Math.min(bottom, scrollSize) - Math.max(top, 0);
  const percentVisible = size ? isEntirelyVisible ? 100 : 100 * (sizeVisible / size) : 0;
  const percentOfScroller = size ? 100 * (sizeVisible / scrollSize) : 0;
  const percent = isEntirelyVisible ? 100 : viewAreaMode ? percentOfScroller : percentVisible;
  const isViewable = percent >= viewablePercentThreshold;
  const value = {
    containerId,
    index,
    isViewable,
    item,
    key,
    percentOfScroller,
    percentVisible,
    scrollSize,
    size,
    sizeVisible
  };
  const prev = ctx.mapViewabilityAmountValues.get(containerId);
  if (!areViewabilityAmountTokensEqual(prev, value)) {
    ctx.mapViewabilityAmountValues.set(containerId, value);
    const cb = ctx.mapViewabilityAmountCallbacks.get(containerId);
    if (cb) {
      cb(value);
    }
  }
  return value;
}
function checkIsViewable(state, ctx, viewabilityConfig, containerId, key, scrollSize, item, index) {
  let value = ctx.mapViewabilityAmountValues.get(containerId);
  if (!value || value.key !== key || value.index !== index) {
    value = computeViewability(state, ctx, viewabilityConfig, containerId, key, scrollSize, item, index);
  }
  return value.isViewable;
}
function maybeUpdateViewabilityCallback(ctx, configId, containerId, viewToken) {
  const key = containerId + configId;
  ctx.mapViewabilityValues.set(key, viewToken);
  const cb = ctx.mapViewabilityCallbacks.get(key);
  cb == null ? void 0 : cb(viewToken);
}
var unstableBatchedUpdates = ReactNative__namespace.unstable_batchedUpdates;
var batchedUpdates = typeof unstableBatchedUpdates === "function" ? unstableBatchedUpdates : (fn) => fn();

// src/utils/containerPool.ts
var MIN_INITIAL_CONTAINER_POOL_SIZE = 32;
var MAX_INITIAL_SPARE_CONTAINERS = 64;
var AUTOMATIC_INITIAL_POOL_MULTIPLIER = 3;
function getInitialContainerPoolSize(dataLength, numContainers) {
  if (dataLength <= 0 || numContainers <= 0) {
    return 0;
  }
  const ratioPoolSize = Math.ceil(numContainers * AUTOMATIC_INITIAL_POOL_MULTIPLIER);
  const cappedSparePoolSize = numContainers + MAX_INITIAL_SPARE_CONTAINERS;
  const targetPoolSize = Math.max(
    numContainers,
    Math.min(ratioPoolSize, cappedSparePoolSize),
    Math.min(dataLength, MIN_INITIAL_CONTAINER_POOL_SIZE)
  );
  const maxUsefulPoolSize = Math.max(dataLength, numContainers);
  return Math.min(maxUsefulPoolSize, targetPoolSize);
}
function getExpandedContainerPoolSize(dataLength, numContainers) {
  if (dataLength <= 0 || numContainers <= 0) {
    return 0;
  }
  return Math.min(Math.max(dataLength, numContainers), Math.max(numContainers, Math.ceil(numContainers * 1.5)));
}

// src/utils/findAvailableContainers.ts
function findAvailableContainers(ctx, needNewContainers, startBuffered, endBuffered, pendingRemoval, getRequiredItemType, protectedKeys) {
  const numNeeded = needNewContainers.length;
  if (numNeeded === 0) {
    return [];
  }
  const numContainers = peek$(ctx, "numContainers");
  const state = ctx.state;
  const { stickyContainerPool, containerItemTypes } = state;
  const shouldAvoidAssignedContainerReuse = state.props.recycleItems && !!state.props.positionComponentInternal;
  const allocations = [];
  const pendingRemovalSet = pendingRemoval.length > 0 ? new Set(pendingRemoval) : void 0;
  let pendingRemovalChanged = false;
  let nextNewContainerIndex = numContainers;
  const usedContainers = /* @__PURE__ */ new Set();
  let availableContainers;
  const stickyHeaderIndicesSet = state.props.stickyHeaderIndicesSet;
  const canReuseContainer = (containerIndex, requiredType) => {
    if (!requiredType) return true;
    const existingType = containerItemTypes.get(containerIndex);
    if (!existingType) return true;
    return existingType === requiredType;
  };
  const pushAllocation = (itemIndex, itemType, containerIndex) => {
    allocations.push({
      containerIndex,
      itemIndex,
      itemType
    });
    usedContainers.add(containerIndex);
    if (pendingRemovalSet == null ? void 0 : pendingRemovalSet.delete(containerIndex)) {
      pendingRemovalChanged = true;
    }
  };
  const pushNewContainer = (itemIndex, itemType, isSticky) => {
    const newContainerIndex = nextNewContainerIndex++;
    pushAllocation(itemIndex, itemType, newContainerIndex);
    if (isSticky) {
      stickyContainerPool.add(newContainerIndex);
    }
    return newContainerIndex;
  };
  const canUseContainer = (containerIndex, itemType) => {
    if (usedContainers.has(containerIndex) || stickyContainerPool.has(containerIndex)) {
      return false;
    }
    const key = peek$(ctx, `containerItemKey${containerIndex}`);
    const isPending = !!(pendingRemovalSet == null ? void 0 : pendingRemovalSet.has(containerIndex));
    return (key === void 0 || isPending) && canReuseContainer(containerIndex, itemType);
  };
  const findStickyContainer = (itemType) => {
    let foundContainer;
    for (const containerIndex of stickyContainerPool) {
      if (!usedContainers.has(containerIndex)) {
        const key = peek$(ctx, `containerItemKey${containerIndex}`);
        const isPendingRemoval = !!(pendingRemovalSet == null ? void 0 : pendingRemovalSet.has(containerIndex));
        if ((key === void 0 || isPendingRemoval) && canReuseContainer(containerIndex, itemType)) {
          foundContainer = containerIndex;
          break;
        }
      }
    }
    return foundContainer;
  };
  const findUnassignedOrPendingContainer = (itemType) => {
    let foundContainer;
    for (let containerIndex = 0; containerIndex < numContainers && foundContainer === void 0; containerIndex++) {
      if (canUseContainer(containerIndex, itemType)) {
        foundContainer = containerIndex;
      }
    }
    return foundContainer;
  };
  const getAvailableContainers = () => {
    if (!availableContainers) {
      availableContainers = [];
      if (!shouldAvoidAssignedContainerReuse) {
        for (let containerIndex = 0; containerIndex < numContainers; containerIndex++) {
          if (usedContainers.has(containerIndex) || stickyContainerPool.has(containerIndex)) {
            continue;
          }
          const key = peek$(ctx, `containerItemKey${containerIndex}`);
          if (key === void 0) continue;
          if ((protectedKeys == null ? void 0 : protectedKeys.has(key)) && state.indexByKey.has(key)) continue;
          const index = state.indexByKey.get(key);
          const isOutOfView = index < startBuffered || index > endBuffered;
          if (isOutOfView) {
            const distance = index < startBuffered ? startBuffered - index : index - endBuffered;
            availableContainers.push({ distance, index: containerIndex });
          }
        }
        availableContainers.sort(comparatorByDistance);
      }
    }
    return availableContainers;
  };
  const findAvailableContainer = (itemType) => {
    const containers = getAvailableContainers();
    let matchIndex = -1;
    for (let i = 0; i < containers.length && matchIndex === -1; i++) {
      const containerIndex = containers[i].index;
      if (!usedContainers.has(containerIndex) && canReuseContainer(containerIndex, itemType)) {
        matchIndex = i;
      }
    }
    return matchIndex === -1 ? void 0 : containers.splice(matchIndex, 1)[0].index;
  };
  for (const itemIndex of needNewContainers) {
    const itemType = getRequiredItemType == null ? void 0 : getRequiredItemType(itemIndex);
    const isSticky = stickyHeaderIndicesSet.has(itemIndex);
    let containerIndex;
    if (isSticky) {
      containerIndex = findStickyContainer(itemType);
    } else {
      containerIndex = findUnassignedOrPendingContainer(itemType);
      if (containerIndex === void 0) {
        containerIndex = findAvailableContainer(itemType);
      }
    }
    if (containerIndex !== void 0) {
      pushAllocation(itemIndex, itemType, containerIndex);
    } else {
      pushNewContainer(itemIndex, itemType, isSticky);
    }
  }
  if (pendingRemovalChanged) {
    pendingRemoval.length = 0;
    if (pendingRemovalSet) {
      for (const value of pendingRemovalSet) {
        pendingRemoval.push(value);
      }
    }
  }
  if (IS_DEV && nextNewContainerIndex > peek$(ctx, "numContainersPooled")) {
    console.warn(
      "[legend-list] No unused container available, so creating one on demand. This can be a minor performance issue and is likely caused by the estimatedItemSize being too large. Consider decreasing estimatedItemSize.",
      {
        debugInfo: {
          numContainers,
          numContainersPooled: peek$(ctx, "numContainersPooled"),
          numNeeded,
          stillNeeded: nextNewContainerIndex - numContainers
        }
      }
    );
  }
  return allocations;
}
function comparatorByDistance(a, b) {
  return b.distance - a.distance;
}

// src/utils/setDidLayout.ts
function setDidLayout(ctx) {
  const state = ctx.state;
  state.queuedInitialLayout = true;
  checkAtBottom(ctx);
  setInitialRenderState(ctx, { didLayout: true });
}

// src/core/calculateItemsInView.ts
var RENDER_RANGE_PROJECTION_FULL_VELOCITY = 4;
var RENDER_RANGE_PROJECTION_SETTLE_DELAY = 100;
function getProjectedBufferAdjustment(scrollVelocity, trailingBuffer) {
  if (trailingBuffer <= 0) {
    return 0;
  }
  const velocityProgress = Math.min(1, Math.abs(scrollVelocity) / RENDER_RANGE_PROJECTION_FULL_VELOCITY);
  return Math.sign(scrollVelocity) * trailingBuffer * velocityProgress;
}
function scheduleRenderRangeProjectionSettle(ctx) {
  const state = ctx.state;
  const previousTimeout = state.timeoutRenderRangeProjectionSettle;
  if (previousTimeout !== void 0) {
    clearTimeout(previousTimeout);
    state.timeouts.delete(previousTimeout);
  }
  const timeout = setTimeout(() => {
    var _a3;
    state.timeoutRenderRangeProjectionSettle = void 0;
    state.timeouts.delete(timeout);
    state.scrollHistory.length = 0;
    (_a3 = state.triggerCalculateItemsInView) == null ? void 0 : _a3.call(state);
  }, RENDER_RANGE_PROJECTION_SETTLE_DELAY);
  state.timeoutRenderRangeProjectionSettle = timeout;
  state.timeouts.add(timeout);
}
function findCurrentStickyIndex(stickyArray, scroll, state) {
  const positions = state.positions;
  for (let i = stickyArray.length - 1; i >= 0; i--) {
    const stickyIndex = stickyArray[i];
    const stickyPos = positions[stickyIndex];
    if (stickyPos !== void 0 && scroll >= stickyPos) {
      return i;
    }
  }
  return -1;
}
function isStickyIndexActive(ctx, targetIndex) {
  const state = ctx.state;
  let isActive = false;
  for (const containerIndex of state.stickyContainerPool) {
    const key = peek$(ctx, `containerItemKey${containerIndex}`);
    const itemIndex = key ? state.indexByKey.get(key) : void 0;
    if (itemIndex === targetIndex) {
      isActive = true;
      break;
    }
  }
  return isActive;
}
function handleStickyActivation(ctx, stickyArray, currentStickyIdx, needNewContainers, needNewContainersSet, startBuffered, endBuffered) {
  var _a3;
  const state = ctx.state;
  set$(ctx, "activeStickyIndex", currentStickyIdx >= 0 ? stickyArray[currentStickyIdx] : -1);
  for (let offset = 0; offset <= 1; offset++) {
    const idx = currentStickyIdx - offset;
    if (idx < 0) continue;
    const stickyIndex = stickyArray[idx];
    if (isStickyIndexActive(ctx, stickyIndex)) continue;
    const stickyId = (_a3 = state.idCache[stickyIndex]) != null ? _a3 : getId(state, stickyIndex);
    if (stickyId && !state.containerItemKeys.has(stickyId) && (stickyIndex < startBuffered || stickyIndex > endBuffered) && !needNewContainersSet.has(stickyIndex)) {
      needNewContainersSet.add(stickyIndex);
      needNewContainers.push(stickyIndex);
    }
  }
}
function handleStickyRecycling(ctx, stickyArray, scroll, drawDistance, currentStickyIdx, pendingRemoval, isPinnedRenderIndex) {
  var _a3, _b;
  const state = ctx.state;
  for (const containerIndex of state.stickyContainerPool) {
    const itemKey = peek$(ctx, `containerItemKey${containerIndex}`);
    const itemIndex = itemKey ? state.indexByKey.get(itemKey) : void 0;
    if (itemIndex === void 0) continue;
    if (isPinnedRenderIndex(itemIndex)) continue;
    const arrayIdx = stickyArray.indexOf(itemIndex);
    if (arrayIdx === -1) {
      state.stickyContainerPool.delete(containerIndex);
      set$(ctx, `containerSticky${containerIndex}`, false);
      continue;
    }
    const isRecentSticky = arrayIdx >= currentStickyIdx - 1 && arrayIdx <= currentStickyIdx + 1;
    if (isRecentSticky) continue;
    const nextIndex = stickyArray[arrayIdx + 1];
    let shouldRecycle = false;
    if (nextIndex) {
      const nextPos = state.positions[nextIndex];
      shouldRecycle = nextPos !== void 0 && scroll > nextPos + drawDistance * 2;
    } else {
      const currentId = (_a3 = state.idCache[itemIndex]) != null ? _a3 : getId(state, itemIndex);
      if (currentId) {
        const currentPos = state.positions[itemIndex];
        const currentSize = (_b = state.sizes.get(currentId)) != null ? _b : getItemSize(ctx, currentId, itemIndex, state.props.data[itemIndex]);
        shouldRecycle = currentPos !== void 0 && scroll > currentPos + currentSize + drawDistance * 3;
      }
    }
    if (shouldRecycle) {
      pendingRemoval.push(containerIndex);
    }
  }
}
function trackVisibleRange(range, i, top, size, scroll, scrollBottom) {
  let didPassVisibleEnd = false;
  if (range.startNoBuffer === null && top + size > scroll) {
    range.startNoBuffer = i;
  }
  if (range.firstFullyOnScreenIndex === void 0 && top >= scroll - 10 && top <= scrollBottom) {
    range.firstFullyOnScreenIndex = i;
  }
  if (range.startNoBuffer !== null) {
    if (top <= scrollBottom) {
      range.endNoBuffer = i;
    } else {
      didPassVisibleEnd = true;
    }
  }
  return didPassVisibleEnd;
}
function getIdsInVisibleRange(state, range) {
  var _a3, _b;
  const idsInView = [];
  const firstVisibleAnchorIndex = (_a3 = range.firstFullyOnScreenIndex) != null ? _a3 : range.startNoBuffer;
  if (firstVisibleAnchorIndex !== null && firstVisibleAnchorIndex !== void 0 && range.endNoBuffer !== null) {
    for (let i = firstVisibleAnchorIndex; i <= range.endNoBuffer; i++) {
      const id = (_b = state.idCache[i]) != null ? _b : getId(state, i);
      idsInView.push(id);
    }
  }
  return idsInView;
}
function maybeEmitFirstVisibleItemChanged(state, index) {
  var _a3;
  const onFirstVisibleItemChanged = state.props.onFirstVisibleItemChanged;
  if (!onFirstVisibleItemChanged || index === null || index < 0 || index >= state.props.data.length) {
    return;
  }
  const key = (_a3 = state.idCache[index]) != null ? _a3 : getId(state, index);
  const previous = state.lastFirstVisibleItemCallback;
  if ((previous == null ? void 0 : previous.index) === index && previous.key === key) {
    return;
  }
  state.lastFirstVisibleItemCallback = { index, key };
  onFirstVisibleItemChanged({ index, item: state.props.data[index], key });
}
function findFirstVisibleIndexInCachedRange(ctx, scroll) {
  var _a3, _b;
  const state = ctx.state;
  const {
    endBuffered,
    idCache,
    positions,
    props: { data },
    sizes,
    startBuffered
  } = state;
  if (startBuffered === null || endBuffered === null || startBuffered < 0 || endBuffered < startBuffered) {
    return null;
  }
  for (let i = startBuffered; i <= endBuffered && i < data.length; i++) {
    const id = (_a3 = idCache[i]) != null ? _a3 : getId(state, i);
    const size = (_b = sizes.get(id)) != null ? _b : getItemSize(ctx, id, i, data[i]);
    const top = positions[i];
    if (top + size > scroll) {
      return i;
    }
  }
  return null;
}
function updateViewabilityForCachedRange(ctx, viewabilityConfigCallbackPairs, scrollLength, scroll, scrollBottom) {
  var _a3, _b;
  const state = ctx.state;
  const {
    endBuffered,
    idCache,
    positions,
    props: { data },
    sizes,
    startBuffered
  } = state;
  if (startBuffered === null || endBuffered === null || startBuffered < 0 || endBuffered < startBuffered) {
    return;
  }
  const visibleRange = {
    endNoBuffer: null,
    firstFullyOnScreenIndex: void 0,
    startNoBuffer: null
  };
  for (let i = startBuffered; i <= endBuffered && i < data.length; i++) {
    const id = (_a3 = idCache[i]) != null ? _a3 : getId(state, i);
    const size = (_b = sizes.get(id)) != null ? _b : getItemSize(ctx, id, i, data[i]);
    const top = positions[i];
    const didPassVisibleEnd = trackVisibleRange(visibleRange, i, top, size, scroll, scrollBottom);
    if (didPassVisibleEnd) {
      break;
    }
  }
  Object.assign(state, {
    endNoBuffer: visibleRange.endNoBuffer,
    firstFullyOnScreenIndex: visibleRange.firstFullyOnScreenIndex,
    idsInView: getIdsInVisibleRange(state, visibleRange),
    startNoBuffer: visibleRange.startNoBuffer
  });
  maybeEmitFirstVisibleItemChanged(state, visibleRange.startNoBuffer);
  if (visibleRange.startNoBuffer !== null && visibleRange.endNoBuffer !== null) {
    updateViewableItems(
      state,
      ctx,
      viewabilityConfigCallbackPairs,
      scrollLength,
      visibleRange.startNoBuffer,
      visibleRange.endNoBuffer,
      startBuffered,
      endBuffered
    );
  }
}
function calculateItemsInView(ctx, params = {}) {
  const state = ctx.state;
  batchedUpdates(() => {
    var _a3, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
    const {
      columns,
      containerItemKeys,
      enableScrollForNextCalculateItemsInView,
      idCache,
      indexByKey,
      minIndexSizeChanged,
      positions,
      props: { alwaysRenderIndicesArr, alwaysRenderIndicesSet, getItemType, keyExtractor, onStickyHeaderChange },
      scrollForNextCalculateItemsInView,
      scrollLength,
      sizes,
      startBufferedId: startBufferedIdOrig,
      viewabilityConfigCallbackPairs
    } = state;
    const { data } = state.props;
    const stickyHeaderIndicesArr = state.props.stickyHeaderIndicesArr || [];
    const stickyHeaderIndicesSet = state.props.stickyHeaderIndicesSet || /* @__PURE__ */ new Set();
    const drawDistance = getEffectiveDrawDistance(ctx, params.drawDistanceMode);
    const { dataChanged, doMVCP, forceFullItemPositions } = params;
    const bootstrapInitialScrollState = ((_a3 = state.initialScrollSession) == null ? void 0 : _a3.kind) === "bootstrap" ? state.initialScrollSession.bootstrap : void 0;
    const suppressInitialScrollSideEffects = !!bootstrapInitialScrollState;
    const prevNumContainers = peek$(ctx, "numContainers");
    if (!data || scrollLength === 0 || !prevNumContainers) {
      return;
    }
    let totalSize = getContentSize(ctx);
    const topPad = peek$(ctx, "stylePaddingTop") + peek$(ctx, "alignItemsAtEndPadding") + peek$(ctx, "headerSize");
    const numColumns = peek$(ctx, "numColumns");
    const speed = (_b = params.scrollVelocity) != null ? _b : getScrollVelocity(state);
    const scrollExtra = 0;
    const { initialScroll, queuedInitialLayout } = state;
    const scrollState = suppressInitialScrollSideEffects ? (_c = bootstrapInitialScrollState == null ? void 0 : bootstrapInitialScrollState.scroll) != null ? _c : state.scroll : !queuedInitialLayout && hasActiveInitialScroll(state) && initialScroll ? (
      // Before the initial layout settles, keep viewport math anchored to the
      // current initial-scroll target instead of transient native adjustments.
      resolveInitialScrollOffset(ctx, initialScroll)
    ) : state.scroll;
    let scrollAdjustPending = 0;
    let scrollAdjustPad = 0;
    let scroll = 0;
    let scrollTopBuffered = 0;
    let scrollBottom = 0;
    let scrollBottomBuffered = 0;
    let nativeScrollState = scrollState;
    const updateScroll2 = (nextScrollState) => {
      var _a4;
      nativeScrollState = nextScrollState;
      scrollAdjustPending = (_a4 = peek$(ctx, "scrollAdjustPending")) != null ? _a4 : 0;
      scrollAdjustPad = scrollAdjustPending - topPad;
      scroll = Math.round(nextScrollState + scrollExtra + scrollAdjustPad);
      if (scroll + scrollLength > totalSize) {
        scroll = Math.max(0, totalSize - scrollLength);
      }
    };
    updateScroll2(scrollState);
    const previousStickyIndex = peek$(ctx, "activeStickyIndex");
    const resolveStickyState = () => {
      const currentStickyIdx = stickyHeaderIndicesArr.length > 0 ? findCurrentStickyIndex(stickyHeaderIndicesArr, scroll, state) : -1;
      const nextActiveStickyIndex = currentStickyIdx >= 0 ? stickyHeaderIndicesArr[currentStickyIdx] : -1;
      const stickyIndexDidChange = previousStickyIndex !== nextActiveStickyIndex;
      if (currentStickyIdx >= 0 || previousStickyIndex >= 0) {
        set$(ctx, "activeStickyIndex", nextActiveStickyIndex);
      }
      const shouldNotifyStickyHeaderChange = !!onStickyHeaderChange && stickyHeaderIndicesArr.length > 0 && stickyIndexDidChange;
      return {
        currentStickyIdx,
        finishCalculateItemsInView: shouldNotifyStickyHeaderChange ? () => {
          const item = data[nextActiveStickyIndex];
          if (item !== void 0) {
            onStickyHeaderChange == null ? void 0 : onStickyHeaderChange({ index: nextActiveStickyIndex, item });
          }
        } : void 0
      };
    };
    let stickyState = dataChanged ? void 0 : resolveStickyState();
    let scrollBufferTop = drawDistance;
    let scrollBufferBottom = drawDistance;
    if (speed > 0 || speed === 0 && scroll < Math.max(50, drawDistance)) {
      scrollBufferTop = drawDistance * 0.5;
      scrollBufferBottom = drawDistance * 1.5;
    } else {
      scrollBufferTop = drawDistance * 1.5;
      scrollBufferBottom = drawDistance * 0.5;
    }
    const shouldProjectRenderRange = !dataChanged && !forceFullItemPositions && !suppressInitialScrollSideEffects && !hasActiveInitialScroll(state) && !state.scrollingTo && !state.pendingNativeMVCPAdjust && !!peek$(ctx, "readyToRender");
    const projectedBufferAdjustment = shouldProjectRenderRange ? getProjectedBufferAdjustment(speed, Math.min(scrollBufferTop, scrollBufferBottom)) : 0;
    const updateScrollRange = () => {
      const scrollStart = Math.max(0, scroll);
      const overscrollBeforeContent = Math.max(0, -nativeScrollState);
      scrollBottom = Math.max(scrollStart, scroll + scrollLength + overscrollBeforeContent);
      scrollTopBuffered = scrollStart - scrollBufferTop + projectedBufferAdjustment;
      scrollBottomBuffered = scrollBottom + scrollBufferBottom + projectedBufferAdjustment;
    };
    updateScrollRange();
    if (projectedBufferAdjustment !== 0) {
      scheduleRenderRangeProjectionSettle(ctx);
    }
    if (enableScrollForNextCalculateItemsInView && !suppressInitialScrollSideEffects && !dataChanged && !forceFullItemPositions && scrollForNextCalculateItemsInView) {
      const { top, bottom } = scrollForNextCalculateItemsInView;
      if (top === null && bottom === null) {
        state.scrollForNextCalculateItemsInView = void 0;
      } else if ((top === null || scrollTopBuffered > top) && (bottom === null || scrollBottomBuffered < bottom)) {
        if (Platform.OS !== "web" || !isInMVCPActiveMode(state)) {
          if (viewabilityConfigCallbackPairs) {
            updateViewabilityForCachedRange(
              ctx,
              viewabilityConfigCallbackPairs,
              scrollLength,
              scroll,
              scrollBottom
            );
          } else if (state.props.onFirstVisibleItemChanged) {
            maybeEmitFirstVisibleItemChanged(state, findFirstVisibleIndexInCachedRange(ctx, scroll));
          }
          (_d = stickyState == null ? void 0 : stickyState.finishCalculateItemsInView) == null ? void 0 : _d.call(stickyState);
          return;
        }
      }
    }
    const checkMVCP = doMVCP && !suppressInitialScrollSideEffects ? prepareMVCP(ctx, dataChanged) : void 0;
    if (dataChanged) {
      resetLayoutCachesForDataChange(state);
    }
    const startIndex = forceFullItemPositions || dataChanged ? 0 : (_e = minIndexSizeChanged != null ? minIndexSizeChanged : state.startBuffered) != null ? _e : 0;
    const optimizeForVisibleWindow = !forceFullItemPositions && !dataChanged && numColumns > 1 && minIndexSizeChanged !== void 0;
    updateItemPositions(ctx, dataChanged, {
      doMVCP,
      forceFullUpdate: !!forceFullItemPositions,
      optimizeForVisibleWindow,
      scrollBottomBuffered,
      scrollVelocity: speed,
      startIndex
    });
    totalSize = getContentSize(ctx);
    if (minIndexSizeChanged !== void 0) {
      state.minIndexSizeChanged = void 0;
    }
    let protectedContainerKeys;
    if (dataChanged && doMVCP && state.props.maintainVisibleContentPosition.data && state.didContainersLayout && state.idsInView.length > 0) {
      const shouldRestorePosition = state.props.maintainVisibleContentPosition.shouldRestorePosition;
      protectedContainerKeys = /* @__PURE__ */ new Set();
      for (const id of state.idsInView) {
        const index = indexByKey.get(id);
        if (index === void 0) continue;
        if (shouldRestorePosition && !shouldRestorePosition(data[index], index, data)) continue;
        protectedContainerKeys.add(id);
      }
    }
    const scrollBeforeMVCP = state.scroll;
    const scrollAdjustPendingBeforeMVCP = (_f = peek$(ctx, "scrollAdjustPending")) != null ? _f : 0;
    checkMVCP == null ? void 0 : checkMVCP();
    const didMVCPAdjustScroll = !!checkMVCP && (state.scroll !== scrollBeforeMVCP || ((_g = peek$(ctx, "scrollAdjustPending")) != null ? _g : 0) !== scrollAdjustPendingBeforeMVCP);
    if (didMVCPAdjustScroll && (initialScroll || state.scrollingTo)) {
      updateScroll2(state.scroll);
      updateScrollRange();
    }
    if (dataChanged) {
      stickyState = resolveStickyState();
    }
    let startBuffered = null;
    let startBufferedId = null;
    let endBuffered = null;
    let loopStart = (_h = suppressInitialScrollSideEffects ? bootstrapInitialScrollState == null ? void 0 : bootstrapInitialScrollState.targetIndexSeed : void 0) != null ? _h : !dataChanged && startBufferedIdOrig ? indexByKey.get(startBufferedIdOrig) || 0 : 0;
    for (let i = loopStart; i >= 0; i--) {
      const id = (_i = idCache[i]) != null ? _i : getId(state, i);
      const top = positions[i];
      const size = (_j = sizes.get(id)) != null ? _j : getItemSize(ctx, id, i, data[i]);
      const bottom = top + size;
      if (bottom > scrollTopBuffered) {
        loopStart = i;
      } else {
        break;
      }
    }
    if (numColumns > 1) {
      while (loopStart > 0) {
        const loopColumn = columns[loopStart];
        if (loopColumn === 1 || loopColumn === void 0) {
          break;
        }
        loopStart -= 1;
      }
    }
    let foundEnd = false;
    let nextTop;
    let nextBottom;
    let maxIndexRendered = 0;
    for (let i = 0; i < prevNumContainers; i++) {
      const key = peek$(ctx, `containerItemKey${i}`);
      if (key !== void 0) {
        const index = indexByKey.get(key);
        maxIndexRendered = Math.max(maxIndexRendered, index);
      }
    }
    const visibleRange = {
      endNoBuffer: null,
      firstFullyOnScreenIndex: void 0,
      startNoBuffer: null
    };
    const dataLength = data.length;
    for (let i = Math.max(0, loopStart); i < dataLength && (!foundEnd || i <= maxIndexRendered); i++) {
      const id = (_k = idCache[i]) != null ? _k : getId(state, i);
      const size = (_l = sizes.get(id)) != null ? _l : getItemSize(ctx, id, i, data[i]);
      const top = positions[i];
      if (!foundEnd) {
        trackVisibleRange(visibleRange, i, top, size, scroll, scrollBottom);
        if (startBuffered === null && top + size > scrollTopBuffered) {
          startBuffered = i;
          startBufferedId = id;
          if (scrollTopBuffered < 0) {
            nextTop = null;
          } else {
            nextTop = top;
          }
        }
        if (visibleRange.startNoBuffer !== null) {
          if (top <= scrollBottomBuffered) {
            endBuffered = i;
            if (scrollBottomBuffered > totalSize) {
              nextBottom = null;
            } else {
              nextBottom = top + size;
            }
          } else {
            foundEnd = true;
          }
        }
      }
    }
    Object.assign(state, {
      endBuffered,
      endNoBuffer: visibleRange.endNoBuffer,
      firstFullyOnScreenIndex: visibleRange.firstFullyOnScreenIndex,
      idsInView: getIdsInVisibleRange(state, visibleRange),
      startBuffered,
      startBufferedId,
      startNoBuffer: visibleRange.startNoBuffer
    });
    if (enableScrollForNextCalculateItemsInView && nextTop !== void 0 && nextBottom !== void 0) {
      state.scrollForNextCalculateItemsInView = isNullOrUndefined(nextTop) && isNullOrUndefined(nextBottom) ? void 0 : {
        bottom: nextBottom,
        top: nextTop
      };
    }
    let numContainers = prevNumContainers;
    const pendingRemoval = [];
    if (dataChanged) {
      for (let i = 0; i < numContainers; i++) {
        const itemKey = peek$(ctx, `containerItemKey${i}`);
        if (!keyExtractor || itemKey && indexByKey.get(itemKey) === void 0) {
          pendingRemoval.push(i);
        }
      }
    }
    const scrollTargetPinnedRange = state.scrollTargetPinnedRange;
    let scrollTargetPinnedStart = 0;
    let scrollTargetPinnedEnd = -1;
    if (scrollTargetPinnedRange) {
      scrollTargetPinnedStart = Math.max(0, Math.min(scrollTargetPinnedRange.start, scrollTargetPinnedRange.end));
      scrollTargetPinnedEnd = Math.min(
        dataLength - 1,
        Math.max(scrollTargetPinnedRange.start, scrollTargetPinnedRange.end)
      );
    }
    const hasScrollTargetPinnedRange = scrollTargetPinnedStart <= scrollTargetPinnedEnd;
    const isPinnedRenderIndex = (index) => alwaysRenderIndicesSet.has(index) || hasScrollTargetPinnedRange && index >= scrollTargetPinnedStart && index <= scrollTargetPinnedEnd;
    if (startBuffered !== null && endBuffered !== null) {
      const needNewContainers = [];
      const needNewContainersSet = /* @__PURE__ */ new Set();
      const addPinnedIndex = (index) => {
        var _a4;
        if (index >= 0 && index < dataLength) {
          const id = (_a4 = idCache[index]) != null ? _a4 : getId(state, index);
          const containerIndex = containerItemKeys.get(id);
          if (containerIndex !== void 0) {
            state.stickyContainerPool.add(containerIndex);
          } else if (!isNullOrUndefined(id) && !needNewContainersSet.has(index)) {
            needNewContainersSet.add(index);
            needNewContainers.push(index);
          }
        }
      };
      for (let i = startBuffered; i <= endBuffered; i++) {
        const id = (_m = idCache[i]) != null ? _m : getId(state, i);
        if (!containerItemKeys.has(id)) {
          needNewContainersSet.add(i);
          needNewContainers.push(i);
        }
      }
      for (const index of alwaysRenderIndicesArr) {
        addPinnedIndex(index);
      }
      if (hasScrollTargetPinnedRange) {
        for (let index = scrollTargetPinnedStart; index <= scrollTargetPinnedEnd; index++) {
          addPinnedIndex(index);
        }
      }
      if (stickyHeaderIndicesArr.length > 0) {
        handleStickyActivation(
          ctx,
          stickyHeaderIndicesArr,
          (_n = stickyState == null ? void 0 : stickyState.currentStickyIdx) != null ? _n : -1,
          needNewContainers,
          needNewContainersSet,
          startBuffered,
          endBuffered
        );
      } else if (previousStickyIndex !== -1) {
        set$(ctx, "activeStickyIndex", -1);
      }
      if (needNewContainers.length > 0) {
        const getRequiredItemType = getItemType ? (i) => {
          const itemType = getItemType(data[i], i);
          return itemType !== void 0 ? String(itemType) : "";
        } : void 0;
        const availableContainerAllocations = findAvailableContainers(
          ctx,
          needNewContainers,
          startBuffered,
          endBuffered,
          pendingRemoval,
          getRequiredItemType,
          protectedContainerKeys
        );
        for (const allocation of availableContainerAllocations) {
          const i = allocation.itemIndex;
          const containerIndex = allocation.containerIndex;
          const id = (_o = idCache[i]) != null ? _o : getId(state, i);
          const oldKey = peek$(ctx, `containerItemKey${containerIndex}`);
          if (oldKey && oldKey !== id) {
            containerItemKeys.delete(oldKey);
          }
          set$(ctx, `containerItemKey${containerIndex}`, id);
          set$(ctx, `containerItemData${containerIndex}`, data[i]);
          if (allocation.itemType !== void 0) {
            state.containerItemTypes.set(containerIndex, allocation.itemType);
          }
          containerItemKeys.set(id, containerIndex);
          (_p = state.userScrollAnchorReset) == null ? void 0 : _p.keys.add(id);
          if (IsNewArchitecture) {
            (_q = state.pendingLayoutEffectMeasurements) != null ? _q : state.pendingLayoutEffectMeasurements = /* @__PURE__ */ new Set();
            state.pendingLayoutEffectMeasurements.add(id);
          }
          const containerSticky = `containerSticky${containerIndex}`;
          const isSticky = stickyHeaderIndicesSet.has(i);
          const isPinnedRender = isPinnedRenderIndex(i);
          if (isSticky) {
            set$(ctx, containerSticky, true);
            state.stickyContainerPool.add(containerIndex);
          } else {
            if (peek$(ctx, containerSticky)) {
              set$(ctx, containerSticky, false);
            }
            if (isPinnedRender) {
              state.stickyContainerPool.add(containerIndex);
            } else {
              state.stickyContainerPool.delete(containerIndex);
            }
          }
          if (containerIndex >= numContainers) {
            numContainers = containerIndex + 1;
          }
        }
        if (numContainers !== prevNumContainers) {
          set$(ctx, "numContainers", numContainers);
          if (numContainers > peek$(ctx, "numContainersPooled")) {
            set$(ctx, "numContainersPooled", getExpandedContainerPoolSize(dataLength, numContainers));
          }
        }
      }
      if (((_r = state.userScrollAnchorReset) == null ? void 0 : _r.keys.size) === 0) {
        state.userScrollAnchorReset = void 0;
      }
    }
    if (state.stickyContainerPool.size > 0) {
      handleStickyRecycling(
        ctx,
        stickyHeaderIndicesArr,
        scroll,
        drawDistance,
        (_s = stickyState == null ? void 0 : stickyState.currentStickyIdx) != null ? _s : -1,
        pendingRemoval,
        isPinnedRenderIndex
      );
    }
    const pendingRemovalSet = pendingRemoval.length > 0 ? new Set(pendingRemoval) : void 0;
    let didChangePositions = false;
    for (let i = 0; i < numContainers; i++) {
      const itemKey = peek$(ctx, `containerItemKey${i}`);
      if (pendingRemovalSet == null ? void 0 : pendingRemovalSet.has(i)) {
        if (itemKey !== void 0) {
          containerItemKeys.delete(itemKey);
        }
        state.containerItemTypes.delete(i);
        if (state.stickyContainerPool.has(i)) {
          set$(ctx, `containerSticky${i}`, false);
          state.stickyContainerPool.delete(i);
        }
        set$(ctx, `containerItemKey${i}`, void 0);
        set$(ctx, `containerItemData${i}`, void 0);
        set$(ctx, `containerPosition${i}`, POSITION_OUT_OF_VIEW);
        set$(ctx, `containerColumn${i}`, -1);
        set$(ctx, `containerSpan${i}`, 1);
      } else {
        const itemIndex = indexByKey.get(itemKey);
        if (itemIndex !== void 0) {
          didChangePositions = syncMountedContainer(ctx, i, itemIndex, {
            scrollAdjustPending,
            updateLayout: true
          }).didChangePosition || didChangePositions;
        }
      }
    }
    if (Platform.OS === "web" && didChangePositions) {
      set$(ctx, "lastPositionUpdate", Date.now());
    }
    if (suppressInitialScrollSideEffects) {
      evaluateBootstrapInitialScroll(ctx);
      return;
    }
    maybeEmitFirstVisibleItemChanged(state, visibleRange.startNoBuffer);
    if (!queuedInitialLayout && !state.didContainersLayout) {
      const isInitialLayoutReady = hasActiveInitialScroll(state) ? checkAllSizesKnown(state, state.startBuffered, state.endBuffered) : checkAllSizesKnown(state, state.startNoBuffer, state.endNoBuffer) || checkAllSizesKnown(state, state.startBuffered, state.endBuffered);
      if (isInitialLayoutReady) {
        setDidLayout(ctx);
        handleInitialScrollLayoutReady(ctx);
      }
    }
    if (viewabilityConfigCallbackPairs && visibleRange.startNoBuffer !== null && visibleRange.endNoBuffer !== null) {
      if (!didMVCPAdjustScroll) {
        updateViewableItems(
          ctx.state,
          ctx,
          viewabilityConfigCallbackPairs,
          scrollLength,
          visibleRange.startNoBuffer,
          visibleRange.endNoBuffer,
          startBuffered != null ? startBuffered : visibleRange.startNoBuffer,
          endBuffered != null ? endBuffered : visibleRange.endNoBuffer
        );
      }
    }
    (_t = stickyState == null ? void 0 : stickyState.finishCalculateItemsInView) == null ? void 0 : _t.call(stickyState);
  });
}

// src/core/updateAnchoredEndSpace.ts
function maybeUpdateAnchoredEndSpace(ctx) {
  var _a3, _b;
  const state = ctx.state;
  const anchoredEndSpace = state.props.anchoredEndSpace;
  const previousSize = peek$(ctx, "anchoredEndSpaceSize");
  const previousReadyAnchorIndex = state.anchoredEndSpaceReadyAnchorIndex;
  const previousReadyAnchorKey = state.anchoredEndSpaceReadyAnchorKey;
  const nextAnchorIndex = anchoredEndSpace == null ? void 0 : anchoredEndSpace.anchorIndex;
  let nextAnchorKey;
  let isReady = true;
  let nextSize = 0;
  if (anchoredEndSpace) {
    const { anchorIndex, anchorMaxSize, anchorOffset = 0 } = anchoredEndSpace;
    const { data } = state.props;
    if (anchorIndex >= 0 && anchorIndex < data.length && state.scrollLength > 0) {
      nextAnchorKey = getId(state, anchorIndex);
      let contentBelowAnchor = 0;
      const footerSize = ctx.values.get("footerSize") || 0;
      const stylePaddingBottom = state.props.stylePaddingBottom || 0;
      let hasUnknownTailSize = false;
      for (let index = anchorIndex; index < data.length; index++) {
        const size = getKnownOrFixedItemSize(ctx, index);
        const effectiveSize = index === anchorIndex && anchorMaxSize !== void 0 ? Math.min(size || 0, Math.max(0, anchorMaxSize)) : size;
        if (size === void 0) {
          hasUnknownTailSize = true;
        }
        if (effectiveSize !== null && effectiveSize !== void 0 && effectiveSize > 0) {
          contentBelowAnchor += effectiveSize;
        }
      }
      contentBelowAnchor += footerSize + stylePaddingBottom;
      isReady = !hasUnknownTailSize;
      nextSize = hasUnknownTailSize ? previousSize || 0 : Math.max(0, state.scrollLength - contentBelowAnchor - anchorOffset);
    } else if (anchorIndex >= 0) {
      isReady = false;
    }
  }
  const didSizeChange = previousSize !== nextSize;
  const didReadyAnchorChange = previousReadyAnchorIndex !== nextAnchorIndex || previousReadyAnchorKey !== nextAnchorKey;
  if (isReady && (didSizeChange || didReadyAnchorChange)) {
    state.anchoredEndSpaceReadyAnchorIndex = nextAnchorIndex;
    state.anchoredEndSpaceReadyAnchorKey = nextAnchorKey;
    if (didSizeChange) {
      set$(ctx, "anchoredEndSpaceSize", nextSize);
      (_a3 = anchoredEndSpace == null ? void 0 : anchoredEndSpace.onSizeChanged) == null ? void 0 : _a3.call(anchoredEndSpace, nextSize);
    }
    if (didSizeChange && (anchoredEndSpace == null ? void 0 : anchoredEndSpace.includeInEndInset)) {
      updateScroll(ctx, state.scroll, true);
    }
    (_b = anchoredEndSpace == null ? void 0 : anchoredEndSpace.onReady) == null ? void 0 : _b.call(anchoredEndSpace, { anchorIndex: nextAnchorIndex, anchorKey: nextAnchorKey, size: nextSize });
  }
  return nextSize;
}
var PixelRatio = ReactNative.PixelRatio;

// src/utils/layoutMeasurement.ts
var FLOATING_POINT_SLACK = 0.01;
var NATIVE_LAYOUT_MEASUREMENT_EPSILON = 1 / PixelRatio.get() + FLOATING_POINT_SLACK;
function isWithinEpsilon(delta) {
  return Math.abs(delta) <= NATIVE_LAYOUT_MEASUREMENT_EPSILON;
}
function isNativeLayoutNoise(delta) {
  return isWithinEpsilon(delta);
}

// src/core/updateItemSizes.ts
function runOrScheduleMVCPRecalculate(ctx) {
  var _a3;
  const state = ctx.state;
  if (state.userScrollAnchorReset !== void 0) {
    calculateItemsInView(ctx);
    if (((_a3 = state.userScrollAnchorReset) == null ? void 0 : _a3.keys.size) === 0) {
      state.userScrollAnchorReset = void 0;
    }
  } else if (Platform.OS === "web") {
    if (!state.mvcpAnchorLock) {
      if (state.queuedMVCPRecalculate !== void 0) {
        cancelAnimationFrame(state.queuedMVCPRecalculate);
        state.queuedMVCPRecalculate = void 0;
      }
      calculateItemsInView(ctx, { doMVCP: true });
    } else if (state.queuedMVCPRecalculate === void 0) {
      state.queuedMVCPRecalculate = requestAnimationFrame(() => {
        state.queuedMVCPRecalculate = void 0;
        calculateItemsInView(ctx, { doMVCP: true });
      });
    }
  } else {
    calculateItemsInView(ctx, { doMVCP: true });
  }
}
function updateOtherAxisSizeIfNeeded(ctx, sizeObj, horizontal) {
  const state = ctx.state;
  if (state.needsOtherAxisSize) {
    const otherAxisSize = horizontal ? sizeObj.height : sizeObj.width;
    const currentOtherAxisSize = peek$(ctx, "otherAxisSize");
    if (!currentOtherAxisSize || otherAxisSize > currentOtherAxisSize) {
      set$(ctx, "otherAxisSize", otherAxisSize);
    }
  }
}
function mergeItemSizeUpdateResult(result, next) {
  result.didChange || (result.didChange = next.didChange);
  result.didMeasureUserScrollAnchorResetItem || (result.didMeasureUserScrollAnchorResetItem = next.didMeasureUserScrollAnchorResetItem);
  result.needsRecalculate || (result.needsRecalculate = next.needsRecalculate);
  result.shouldMaintainScrollAtEnd || (result.shouldMaintainScrollAtEnd = next.shouldMaintainScrollAtEnd);
}
var batchedItemSizeRecalculates = /* @__PURE__ */ new WeakMap();
function flushBatchedItemSizeRecalculate(ctx, didFallback = false, expectedResult) {
  const result = batchedItemSizeRecalculates.get(ctx);
  if (!result || expectedResult && result !== expectedResult) {
    return;
  }
  batchedItemSizeRecalculates.delete(ctx);
  if (didFallback) {
    ctx.state.pendingLayoutEffectMeasurements = void 0;
  }
  flushItemSizeUpdates(ctx, result);
}
function queueItemSizeRecalculate(ctx, result) {
  var _a3, _b;
  const batch = batchedItemSizeRecalculates.get(ctx);
  if (batch) {
    mergeItemSizeUpdateResult(batch, result);
  } else {
    const nextBatch = { ...result };
    batchedItemSizeRecalculates.set(ctx, nextBatch);
    if ((_a3 = ctx.state.pendingLayoutEffectMeasurements) == null ? void 0 : _a3.size) {
      requestAnimationFrame(() => {
        flushBatchedItemSizeRecalculate(ctx, true, nextBatch);
      });
    }
  }
  if (!((_b = ctx.state.pendingLayoutEffectMeasurements) == null ? void 0 : _b.size)) {
    flushBatchedItemSizeRecalculate(ctx);
  }
}
function flushItemSizeUpdates(ctx, result) {
  var _a3;
  const state = ctx.state;
  if (result.needsRecalculate) {
    state.scrollForNextCalculateItemsInView = void 0;
    runOrScheduleMVCPRecalculate(ctx);
  } else if (result.didMeasureUserScrollAnchorResetItem && ((_a3 = state.userScrollAnchorReset) == null ? void 0 : _a3.keys.size) === 0) {
    state.userScrollAnchorReset = void 0;
  }
  if (result.didChange && result.shouldMaintainScrollAtEnd) {
    doMaintainScrollAtEnd(ctx);
  }
}
function updateItemSizes(ctx, measurement) {
  var _a3, _b, _c, _d;
  const state = ctx.state;
  let didDrainLayoutEffectMeasurements = false;
  if (IsNewArchitecture && measurement.fromLayoutEffect) {
    const pendingLayoutEffectMeasurements = state.pendingLayoutEffectMeasurements;
    if ((pendingLayoutEffectMeasurements == null ? void 0 : pendingLayoutEffectMeasurements.delete(measurement.itemKey)) && pendingLayoutEffectMeasurements.size === 0) {
      state.pendingLayoutEffectMeasurements = void 0;
      didDrainLayoutEffectMeasurements = true;
    }
  }
  const pendingKeys = (_a3 = state.userScrollAnchorReset) == null ? void 0 : _a3.keys;
  const shouldBatchPendingMeasurements = IsNewArchitecture && measurement.fromLayoutEffect && !!(pendingKeys == null ? void 0 : pendingKeys.size);
  const shouldQueueRecalculate = IsNewArchitecture && !!measurement.fromLayoutEffect;
  let result;
  if (!shouldBatchPendingMeasurements) {
    result = applyItemSize(ctx, measurement.itemKey, measurement.size);
  } else {
    result = {};
    const updateContainerItemSize = (itemKey, containerId, size) => {
      if (containerId !== void 0 && peek$(ctx, `containerItemKey${containerId}`) === itemKey) {
        mergeItemSizeUpdateResult(result, applyItemSize(ctx, itemKey, size));
      }
    };
    updateContainerItemSize(measurement.itemKey, measurement.containerId, measurement.size);
    const keys = Array.from(pendingKeys);
    for (const itemKey of keys) {
      const containerId = state.containerItemKeys.get(itemKey);
      if (containerId !== void 0) {
        (_d = (_c = (_b = ctx.viewRefs.get(containerId)) == null ? void 0 : _b.current) == null ? void 0 : _c.measure) == null ? void 0 : _d.call(_c, (_x, _y, width, height) => {
          if (pendingKeys.has(itemKey)) {
            updateContainerItemSize(itemKey, containerId, { height, width });
          }
        });
      }
    }
  }
  if (shouldQueueRecalculate && result.needsRecalculate) {
    queueItemSizeRecalculate(ctx, result);
  } else {
    flushItemSizeUpdates(ctx, result);
  }
  if (didDrainLayoutEffectMeasurements) {
    flushBatchedItemSizeRecalculate(ctx);
  }
}
function applyItemSize(ctx, itemKey, sizeObj) {
  var _a3;
  const state = ctx.state;
  const userScrollAnchorReset = state.userScrollAnchorReset;
  const didMeasureUserScrollAnchorResetItem = !!(userScrollAnchorReset == null ? void 0 : userScrollAnchorReset.keys.delete(itemKey));
  const {
    didContainersLayout,
    sizesKnown,
    props: { getFixedItemSize, getItemType, horizontal, onItemSizeChanged, data, maintainScrollAtEnd }
  } = state;
  if (!data) return { didMeasureUserScrollAnchorResetItem };
  const index = state.indexByKey.get(itemKey);
  let resolvedMeasurementItem;
  if (getFixedItemSize) {
    if (index === void 0) {
      return { didMeasureUserScrollAnchorResetItem };
    }
    const itemData = state.props.data[index];
    if (itemData === void 0) {
      return { didMeasureUserScrollAnchorResetItem };
    }
    const type = getItemType ? (_a3 = getItemType(itemData, index)) != null ? _a3 : "" : "";
    const size2 = getFixedItemSize(itemData, index, type);
    resolvedMeasurementItem = {
      didResolveFixedItemSize: true,
      fixedItemSize: size2,
      itemData,
      itemType: type
    };
    if (size2 !== void 0 && size2 === sizesKnown.get(itemKey)) {
      updateOtherAxisSizeIfNeeded(ctx, sizeObj, horizontal);
      return { didMeasureUserScrollAnchorResetItem };
    }
  }
  let needsRecalculate = !didContainersLayout;
  let shouldMaintainScrollAtEnd = false;
  let minIndexSizeChanged;
  const prevSizeKnown = state.sizesKnown.get(itemKey);
  const diff = updateOneItemSize(ctx, itemKey, sizeObj, resolvedMeasurementItem);
  const size = roundSize(horizontal ? sizeObj.width : sizeObj.height);
  if (diff !== 0) {
    minIndexSizeChanged = minIndexSizeChanged !== void 0 ? Math.min(minIndexSizeChanged, index) : index;
    const { startBuffered, endBuffered } = state;
    needsRecalculate || (needsRecalculate = index >= startBuffered && index <= endBuffered);
    if (!needsRecalculate && state.containerItemKeys.has(itemKey)) {
      needsRecalculate = true;
    }
    if (prevSizeKnown !== void 0 && Math.abs(prevSizeKnown - size) > 5) {
      shouldMaintainScrollAtEnd = true;
    }
    onItemSizeChanged == null ? void 0 : onItemSizeChanged({
      index,
      itemData: state.props.data[index],
      itemKey,
      previous: size - diff,
      size
    });
    maybeUpdateAnchoredEndSpace(ctx);
  }
  if (minIndexSizeChanged !== void 0) {
    state.minIndexSizeChanged = state.minIndexSizeChanged !== void 0 ? Math.min(state.minIndexSizeChanged, minIndexSizeChanged) : minIndexSizeChanged;
  }
  updateOtherAxisSizeIfNeeded(ctx, sizeObj, horizontal);
  if (didContainersLayout || checkAllSizesKnown(state, state.startBuffered, state.endBuffered)) {
    const canMaintainScrollAtEnd = shouldMaintainScrollAtEnd && !!(maintainScrollAtEnd == null ? void 0 : maintainScrollAtEnd.onItemLayout);
    return {
      didChange: diff !== 0,
      didMeasureUserScrollAnchorResetItem,
      needsRecalculate,
      shouldMaintainScrollAtEnd: canMaintainScrollAtEnd
    };
  }
  return {
    didChange: diff !== 0,
    didMeasureUserScrollAnchorResetItem
  };
}
function updateOneItemSize(ctx, itemKey, sizeObj, resolvedMeasurementItem) {
  var _a3, _b, _c;
  const state = ctx.state;
  const {
    indexByKey,
    sizesKnown,
    averageSizes,
    props: { data, horizontal, getItemType, getFixedItemSize }
  } = state;
  if (!data) return 0;
  const index = indexByKey.get(itemKey);
  const itemData = (_a3 = resolvedMeasurementItem == null ? void 0 : resolvedMeasurementItem.itemData) != null ? _a3 : data[index];
  let itemType = resolvedMeasurementItem == null ? void 0 : resolvedMeasurementItem.itemType;
  let fixedItemSize = resolvedMeasurementItem == null ? void 0 : resolvedMeasurementItem.fixedItemSize;
  if (getFixedItemSize && !(resolvedMeasurementItem == null ? void 0 : resolvedMeasurementItem.didResolveFixedItemSize)) {
    itemType = getItemType ? (_b = getItemType(itemData, index)) != null ? _b : "" : "";
    fixedItemSize = getFixedItemSize(itemData, index, itemType);
  }
  const resolvedItemSize = (resolvedMeasurementItem == null ? void 0 : resolvedMeasurementItem.didResolveFixedItemSize) || itemType !== void 0 || fixedItemSize !== void 0 ? {
    didResolveFixedItemSize: resolvedMeasurementItem == null ? void 0 : resolvedMeasurementItem.didResolveFixedItemSize,
    fixedItemSize,
    itemType
  } : void 0;
  const prevSize = getItemSize(ctx, itemKey, index, itemData, void 0, void 0, void 0, resolvedItemSize);
  const rawSize = horizontal ? sizeObj.width : sizeObj.height;
  const prevSizeKnown = sizesKnown.get(itemKey);
  if (Platform.OS !== "web" && prevSizeKnown !== void 0 && isNativeLayoutNoise(rawSize - prevSizeKnown)) {
    return 0;
  }
  const size = Platform.OS === "web" ? Math.round(rawSize) : roundSize(rawSize);
  sizesKnown.set(itemKey, size);
  if (fixedItemSize === void 0 && size > 0) {
    itemType != null ? itemType : itemType = getItemType ? (_c = getItemType(itemData, index)) != null ? _c : "" : "";
    let averages = averageSizes[itemType];
    if (!averages) {
      averages = averageSizes[itemType] = { avg: 0, num: 0 };
    }
    if (averages.num === 0) {
      averages.avg = size;
      averages.num++;
    } else if (prevSizeKnown !== void 0 && prevSizeKnown > 0) {
      averages.avg += (size - prevSizeKnown) / averages.num;
    } else {
      averages.avg = (averages.avg * averages.num + size) / (averages.num + 1);
      averages.num++;
    }
  }
  if (!prevSize || Math.abs(prevSize - size) > 0.1) {
    setSize(ctx, itemKey, size);
    return size - prevSize;
  }
  return 0;
}
function useOnLayoutSync({
  ref,
  onLayoutProp,
  onLayoutChange
}, deps = []) {
  const onLayout = React2.useCallback(
    (event) => {
      const { layout } = event.nativeEvent;
      onLayoutChange(layout, false);
      onLayoutProp == null ? void 0 : onLayoutProp(event);
    },
    [onLayoutChange, onLayoutProp]
  );
  if (IsNewArchitecture) {
    React2.useLayoutEffect(() => {
      if (ref.current) {
        ref.current.measure((x, y, width, height) => {
          onLayoutChange({ height, width, x, y }, true);
        });
      }
    }, deps);
  }
  return { onLayout };
}

// src/components/Container.tsx
function getContainerPositionStyle({
  columnWrapperStyle,
  contentContainerAlignItems,
  horizontal,
  hasItemSeparator,
  isHorizontalRTLList,
  numColumns,
  otherAxisPos,
  otherAxisSize
}) {
  let paddingStyles;
  if (columnWrapperStyle) {
    const { columnGap, rowGap, gap } = columnWrapperStyle;
    if (horizontal) {
      paddingStyles = {
        paddingBottom: numColumns > 1 ? (rowGap || gap || 0) / 2 : void 0,
        paddingRight: columnGap || gap || void 0,
        paddingTop: numColumns > 1 ? (rowGap || gap || 0) / 2 : void 0
      };
    } else {
      paddingStyles = {
        paddingBottom: rowGap || gap || void 0,
        paddingLeft: numColumns > 1 ? (columnGap || gap || 0) / 2 : void 0,
        paddingRight: numColumns > 1 ? (columnGap || gap || 0) / 2 : void 0
      };
    }
  }
  return horizontal ? {
    bottom: contentContainerAlignItems === "flex-end" && numColumns === 1 ? 0 : void 0,
    boxSizing: paddingStyles ? "border-box" : void 0,
    direction: isHorizontalRTLList && Platform.OS === "web" ? "ltr" : void 0,
    flexDirection: hasItemSeparator ? "row" : void 0,
    height: otherAxisSize,
    left: 0,
    position: "absolute",
    top: contentContainerAlignItems === "flex-end" && numColumns === 1 ? void 0 : otherAxisPos,
    ...paddingStyles || {}
  } : {
    boxSizing: paddingStyles ? "border-box" : void 0,
    left: otherAxisPos,
    position: "absolute",
    right: numColumns > 1 ? null : 0,
    top: 0,
    width: otherAxisSize,
    ...paddingStyles || {}
  };
}
var Container = typedMemo(function Container2({
  id,
  itemKey,
  recycleItems,
  horizontal,
  getRenderedItem: getRenderedItem2,
  ItemSeparatorComponent,
  stickyHeaderConfig
}) {
  const ctx = useStateContext();
  const { columnWrapperStyle, animatedScrollY } = ctx;
  const isHorizontalRTLList = isHorizontalRTL(ctx.state);
  const positionComponentInternal = ctx.state.props.positionComponentInternal;
  const stickyPositionComponentInternal = ctx.state.props.stickyPositionComponentInternal;
  const [column = 0, span = 1, data, numColumns = 1, extraData, isSticky] = useArr$([
    `containerColumn${id}`,
    `containerSpan${id}`,
    `containerItemData${id}`,
    "numColumns",
    "extraData",
    `containerSticky${id}`
  ]);
  const itemLayoutRef = React2.useRef({
    didLayout: false,
    horizontal,
    itemKey,
    pendingShrinkToken: 0
  });
  itemLayoutRef.current.horizontal = horizontal;
  itemLayoutRef.current.itemKey = itemKey;
  const ref = React2.useRef(null);
  const [layoutRenderCount, forceLayoutRender] = React2.useState(0);
  const resolvedColumn = column > 0 ? column : 1;
  const resolvedSpan = Math.min(Math.max(span || 1, 1), numColumns);
  const otherAxisPos = numColumns > 1 ? `${(resolvedColumn - 1) / numColumns * 100}%` : 0;
  const otherAxisSize = numColumns > 1 ? `${resolvedSpan / numColumns * 100}%` : void 0;
  const style = React2.useMemo(
    () => getContainerPositionStyle({
      columnWrapperStyle,
      contentContainerAlignItems: ctx.state.props.contentContainerAlignItems,
      hasItemSeparator: !!ItemSeparatorComponent,
      horizontal,
      isHorizontalRTLList,
      numColumns,
      otherAxisPos,
      otherAxisSize
    }),
    [
      horizontal,
      isHorizontalRTLList,
      otherAxisPos,
      otherAxisSize,
      columnWrapperStyle,
      ctx.state.props.contentContainerAlignItems,
      numColumns,
      ItemSeparatorComponent
    ]
  );
  const renderedItemInfo = React2.useMemo(
    () => itemKey !== void 0 ? getRenderedItem2(itemKey) : null,
    [itemKey, data, extraData]
  );
  const { index, renderedItem } = renderedItemInfo || {};
  const onLayoutChange = React2.useCallback((rectangle, fromLayoutEffect) => {
    var _a3, _b;
    const {
      horizontal: currentHorizontal,
      itemKey: currentItemKey,
      lastSize,
      pendingShrinkToken
    } = itemLayoutRef.current;
    if (isNullOrUndefined(currentItemKey)) {
      return;
    }
    itemLayoutRef.current.didLayout = true;
    let layout = rectangle;
    const axis = currentHorizontal ? "width" : "height";
    const size = roundSize(rectangle[axis]);
    const prevSize = lastSize ? roundSize(lastSize[axis]) : void 0;
    const doUpdate = () => {
      itemLayoutRef.current.lastSize = layout;
      updateItemSizes(ctx, {
        containerId: id,
        fromLayoutEffect,
        itemKey: currentItemKey,
        size: layout
      });
      itemLayoutRef.current.didLayout = true;
    };
    const shouldDeferWebShrinkLayoutUpdate = Platform.OS === "web" && !isInMVCPActiveMode(ctx.state) && prevSize !== void 0 && size + 1 < prevSize;
    if (shouldDeferWebShrinkLayoutUpdate) {
      const token = pendingShrinkToken + 1;
      itemLayoutRef.current.pendingShrinkToken = token;
      requestAnimationFrame(() => {
        var _a4;
        if (itemLayoutRef.current.pendingShrinkToken !== token) {
          return;
        }
        const element = ref.current;
        const rect = (_a4 = element == null ? void 0 : element.getBoundingClientRect) == null ? void 0 : _a4.call(element);
        if (rect) {
          layout = { height: rect.height, width: rect.width };
        }
        doUpdate();
      });
      return;
    }
    if (IsNewArchitecture || size > 0) {
      doUpdate();
    } else {
      (_b = (_a3 = ref.current) == null ? void 0 : _a3.measure) == null ? void 0 : _b.call(_a3, (_x, _y, width, height) => {
        layout = { height, width };
        doUpdate();
      });
    }
  }, []);
  const triggerLayout = React2.useCallback(() => {
    forceLayoutRender((v) => v + 1);
  }, []);
  const contextValue = React2.useMemo(() => {
    ctx.viewRefs.set(id, ref);
    return {
      containerId: id,
      index,
      itemKey,
      triggerLayout,
      value: data
    };
  }, [id, itemKey, index, data, triggerLayout]);
  React2.useLayoutEffect(() => {
    ctx.containerLayoutTriggers.set(id, triggerLayout);
    return () => {
      if (ctx.containerLayoutTriggers.get(id) === triggerLayout) {
        ctx.containerLayoutTriggers.delete(id);
      }
    };
  }, [ctx, id, triggerLayout]);
  const { onLayout } = useOnLayoutSync(
    {
      onLayoutChange,
      ref},
    [itemKey, layoutRenderCount]
  );
  if (!IsNewArchitecture) {
    React2.useEffect(() => {
      if (!isNullOrUndefined(itemKey)) {
        itemLayoutRef.current.didLayout = false;
        const timeout = setTimeout(() => {
          if (!itemLayoutRef.current.didLayout) {
            const { itemKey: currentItemKey, lastSize } = itemLayoutRef.current;
            if (lastSize && !isNullOrUndefined(currentItemKey)) {
              updateItemSizes(ctx, {
                containerId: id,
                fromLayoutEffect: false,
                itemKey: currentItemKey,
                size: lastSize
              });
              itemLayoutRef.current.didLayout = true;
            }
          }
        }, 16);
        return () => {
          clearTimeout(timeout);
        };
      }
    }, [itemKey]);
  }
  const PositionComponent = isSticky ? stickyPositionComponentInternal ? stickyPositionComponentInternal : PositionViewSticky : positionComponentInternal ? positionComponentInternal : PositionView;
  return /* @__PURE__ */ React2__namespace.createElement(
    PositionComponent,
    {
      animatedScrollY: isSticky ? animatedScrollY : void 0,
      horizontal,
      id,
      index,
      key: recycleItems ? void 0 : itemKey,
      onLayout,
      refView: ref,
      stickyHeaderConfig,
      style
    },
    /* @__PURE__ */ React2__namespace.createElement(ContextContainer.Provider, { value: contextValue }, renderedItem, renderedItemInfo && ItemSeparatorComponent && /* @__PURE__ */ React2__namespace.createElement(Separator, { ItemSeparatorComponent, leadingItem: renderedItemInfo.item }))
  );
});

// src/components/ContainerSlot.tsx
function ContainerSlotBase({
  id,
  horizontal,
  recycleItems,
  ItemSeparatorComponent,
  getRenderedItem: getRenderedItem2,
  stickyHeaderConfig,
  ContainerComponent = Container
}) {
  const [itemKey] = useArr$([`containerItemKey${id}`]);
  if (itemKey === void 0) {
    return null;
  }
  return /* @__PURE__ */ React2__namespace.createElement(
    ContainerComponent,
    {
      getRenderedItem: getRenderedItem2,
      horizontal,
      ItemSeparatorComponent,
      id,
      itemKey,
      recycleItems,
      stickyHeaderConfig
    }
  );
}
var ContainerSlot = typedMemo(function ContainerSlot2(props) {
  return /* @__PURE__ */ React2__namespace.createElement(ContainerSlotBase, { ...props });
});

// src/components/Containers.native.tsx
var ContainersLayer = typedMemo(function ContainersLayer2({ children, horizontal }) {
  const ctx = useStateContext();
  const columnWrapperStyle = ctx.columnWrapperStyle;
  const animSize = useValue$("totalSize");
  const [readyToRender, numColumns, otherAxisSize = 0] = useArr$(["readyToRender", "numColumns", "otherAxisSize"]);
  const style = horizontal ? {
    height: otherAxisSize || "100%",
    minHeight: otherAxisSize,
    opacity: readyToRender ? 1 : 0,
    width: animSize
  } : { height: animSize, minWidth: otherAxisSize, opacity: readyToRender ? 1 : 0 };
  if (columnWrapperStyle) {
    const { columnGap, rowGap, gap } = columnWrapperStyle;
    const gapX = columnGap || gap || 0;
    const gapY = rowGap || gap || 0;
    if (horizontal) {
      if (gapY && numColumns > 1) {
        style.marginVertical = -gapY / 2;
      }
      if (gapX) {
        style.marginRight = -gapX;
      }
    } else {
      if (gapX && numColumns > 1) {
        style.marginHorizontal = -gapX;
      }
      if (gapY) {
        style.marginBottom = -gapY;
      }
    }
  }
  return /* @__PURE__ */ React2__namespace.createElement(ReactNative.Animated.View, { style }, children);
});
var Containers = typedMemo(function Containers2({
  horizontal,
  recycleItems,
  ItemSeparatorComponent,
  stickyHeaderConfig,
  getRenderedItem: getRenderedItem2
}) {
  const [numContainersPooled] = useArr$(["numContainersPooled"]);
  const containers = [];
  for (let i = 0; i < numContainersPooled; i++) {
    containers.push(
      /* @__PURE__ */ React2__namespace.createElement(
        ContainerSlot,
        {
          getRenderedItem: getRenderedItem2,
          horizontal,
          ItemSeparatorComponent,
          id: i,
          key: i,
          recycleItems,
          stickyHeaderConfig
        }
      )
    );
  }
  return /* @__PURE__ */ React2__namespace.createElement(ContainersLayer, { horizontal }, containers);
});
var ListComponentScrollView = ReactNative.Animated.ScrollView;

// src/components/listComponentStyles.ts
function getAutoOtherAxisStyle({
  horizontal,
  needsOtherAxisSize,
  otherAxisSize
}) {
  if (!needsOtherAxisSize || !otherAxisSize || otherAxisSize <= 0) {
    return void 0;
  }
  return horizontal ? { height: otherAxisSize } : { width: otherAxisSize };
}
function ScrollAdjust() {
  var _a3;
  const ctx = useStateContext();
  const bias = 1e7;
  const [scrollAdjust, scrollAdjustUserOffset] = useArr$(["scrollAdjust", "scrollAdjustUserOffset"]);
  const scrollOffset = (scrollAdjust || 0) + (scrollAdjustUserOffset || 0) + bias;
  const horizontal = !!((_a3 = ctx.state) == null ? void 0 : _a3.props.horizontal);
  return /* @__PURE__ */ React2__namespace.createElement(
    ReactNative.View,
    {
      style: {
        height: 0,
        left: horizontal ? scrollOffset : 0,
        position: "absolute",
        top: horizontal ? 0 : scrollOffset,
        width: 0
      }
    }
  );
}
var SnapWrapper = React2__namespace.forwardRef(function SnapWrapperInner({ ScrollComponent, ...props }, ref) {
  const [snapToOffsets] = useArr$(["snapToOffsets"]);
  return /* @__PURE__ */ React2__namespace.createElement(ScrollComponent, { ...props, ref, snapToOffsets });
});
function WebAnchoredEndSpace({ horizontal }) {
  const ctx = useStateContext();
  const [anchoredEndSpaceSize] = useArr$(["anchoredEndSpaceSize"]);
  const shouldRenderAnchoredEndSpace = !!ctx.state.props.anchoredEndSpace && (anchoredEndSpaceSize || 0) > 0;
  if (!shouldRenderAnchoredEndSpace) {
    return null;
  }
  const style = horizontal ? { height: "100%", width: anchoredEndSpaceSize || 0 } : { height: anchoredEndSpaceSize || 0 };
  return /* @__PURE__ */ React2__namespace.createElement("div", { style }, null);
}

// src/core/updateContentMetrics.ts
var SCROLL_ADJUST_EPSILON = 0.1;
function setContentLengthSignal(ctx, signalName, size) {
  const didChange = peek$(ctx, signalName) !== size;
  if (didChange) {
    set$(ctx, signalName, size);
    updateContentMetricsState(ctx);
  }
  return didChange;
}
function shouldAdjustForHeaderSizeChange(ctx, previousHeaderSize, nextHeaderSize) {
  const { didContainersLayout, didFinishInitialScroll, props, scroll, scrollingTo } = ctx.state;
  const sizeDiff = nextHeaderSize - previousHeaderSize;
  const leadingPadding = props.horizontal ? props.stylePaddingLeft : props.stylePaddingTop;
  const previousHeaderEnd = (leadingPadding || 0) + previousHeaderSize;
  return Platform.OS === "web" && props.maintainVisibleContentPosition.size && didContainersLayout && didFinishInitialScroll && !scrollingTo && scroll >= previousHeaderEnd - SCROLL_ADJUST_EPSILON && Math.abs(sizeDiff) > SCROLL_ADJUST_EPSILON;
}
function setHeaderSize(ctx, size) {
  const { state } = ctx;
  const previousHeaderSize = peek$(ctx, "headerSize") || 0;
  const didChange = previousHeaderSize !== size;
  const hasMeasuredOrEstimatedHeaderBaseline = state.didMeasureHeader || previousHeaderSize > SCROLL_ADJUST_EPSILON;
  if (didChange) {
    set$(ctx, "headerSize", size);
    updateContentMetricsState(ctx);
    if (hasMeasuredOrEstimatedHeaderBaseline && shouldAdjustForHeaderSizeChange(ctx, previousHeaderSize, size)) {
      requestAdjust(ctx, size - previousHeaderSize);
    }
  }
  state.didMeasureHeader = true;
}
function setFooterSize(ctx, size) {
  return setContentLengthSignal(ctx, "footerSize", size);
}
function areInsetsEqual(left, right) {
  var _a3, _b, _c, _d, _e, _f, _g, _h;
  return ((_a3 = left == null ? void 0 : left.top) != null ? _a3 : 0) === ((_b = right == null ? void 0 : right.top) != null ? _b : 0) && ((_c = left == null ? void 0 : left.bottom) != null ? _c : 0) === ((_d = right == null ? void 0 : right.bottom) != null ? _d : 0) && ((_e = left == null ? void 0 : left.left) != null ? _e : 0) === ((_f = right == null ? void 0 : right.left) != null ? _f : 0) && ((_g = left == null ? void 0 : left.right) != null ? _g : 0) === ((_h = right == null ? void 0 : right.right) != null ? _h : 0);
}
function setContentInsetOverride(ctx, inset) {
  const { state } = ctx;
  const previousInset = state.contentInsetOverride;
  const nextInset = inset != null ? inset : void 0;
  const didChange = !areInsetsEqual(previousInset, nextInset);
  state.contentInsetOverride = nextInset;
  if (didChange) {
    updateContentMetricsState(ctx);
  }
  return didChange;
}
function useLatestRef(value) {
  const ref = React2__namespace.useRef(value);
  ref.current = value;
  return ref;
}

// src/hooks/useStableRenderComponent.tsx
function useStableRenderComponent(renderComponent, mapProps) {
  const renderComponentRef = useLatestRef(renderComponent);
  const mapPropsRef = useLatestRef(mapProps);
  return React2__namespace.useMemo(
    () => React2__namespace.forwardRef(
      (props, ref) => {
        var _a3, _b;
        return (_b = (_a3 = renderComponentRef.current) == null ? void 0 : _a3.call(renderComponentRef, mapPropsRef.current(props, ref))) != null ? _b : null;
      }
    ),
    [mapPropsRef, renderComponentRef]
  );
}
var LayoutView = ({ onLayoutChange, refView, ...rest }) => {
  const localRef = React2.useRef(null);
  const ref = refView != null ? refView : localRef;
  const { onLayout } = useOnLayoutSync({ onLayoutChange, ref });
  return /* @__PURE__ */ React2__namespace.createElement(ReactNative.View, { ...rest, onLayout, ref });
};

// src/components/ListComponent.tsx
var AlignItemsAtEndSpacer = typedMemo(function AlignItemsAtEndSpacer2({ horizontal }) {
  const [alignItemsAtEndPadding = 0] = useArr$(["alignItemsAtEndPadding"]);
  if (alignItemsAtEndPadding <= 0) {
    return null;
  }
  return /* @__PURE__ */ React2__namespace.createElement(
    View,
    {
      style: horizontal ? { flexShrink: 0, width: alignItemsAtEndPadding } : { flexShrink: 0, height: alignItemsAtEndPadding }
    },
    null
  );
});
var ListComponent = typedMemo(function ListComponent2({
  canRender,
  style,
  contentContainerStyle,
  horizontal,
  initialContentOffset,
  recycleItems,
  ItemSeparatorComponent,
  alignItemsAtEnd: _alignItemsAtEnd,
  onScroll: onScroll2,
  onLayout,
  ListHeaderComponent,
  ListHeaderComponentStyle,
  ListFooterComponent,
  ListFooterComponentStyle,
  ListEmptyComponent,
  getRenderedItem: getRenderedItem2,
  refScrollView,
  renderScrollComponent,
  onLayoutFooter,
  scrollAdjustHandler,
  snapToIndices,
  stickyHeaderConfig,
  stickyHeaderIndices,
  useWindowScroll = false,
  ...rest
}) {
  const ctx = useStateContext();
  const maintainVisibleContentPosition = ctx.state.props.maintainVisibleContentPosition;
  const [otherAxisSize = 0] = useArr$(["otherAxisSize"]);
  const shouldRenderAlignItemsAtEndSpacer = ctx.state.props.alignItemsAtEndPaddingEnabled;
  const autoOtherAxisStyle = getAutoOtherAxisStyle({
    horizontal,
    needsOtherAxisSize: ctx.state.needsOtherAxisSize,
    otherAxisSize
  });
  const CustomScrollComponent = useStableRenderComponent(
    renderScrollComponent,
    (props, ref) => ({ ...props, ref })
  );
  const ScrollComponent = renderScrollComponent ? CustomScrollComponent : ListComponentScrollView;
  const SnapOrScroll = snapToIndices ? SnapWrapper : ScrollComponent;
  const updateFooterSize = React2.useCallback(
    (size, afterSizeUpdate) => {
      var _a3;
      const didFooterSizeChange = setFooterSize(ctx, size);
      afterSizeUpdate == null ? void 0 : afterSizeUpdate();
      if (didFooterSizeChange && ((_a3 = ctx.state.props.maintainScrollAtEnd) == null ? void 0 : _a3.onFooterLayout)) {
        doMaintainScrollAtEnd(ctx);
      }
    },
    [ctx]
  );
  React2.useLayoutEffect(() => {
    if (!ListHeaderComponent) {
      setHeaderSize(ctx, 0);
    }
    if (!ListFooterComponent) {
      updateFooterSize(0);
    }
  }, [ListHeaderComponent, ListFooterComponent, ctx, updateFooterSize]);
  const onLayoutHeader = React2.useCallback(
    (rect) => {
      const size = rect[horizontal ? "width" : "height"];
      setHeaderSize(ctx, size);
    },
    [ctx, horizontal]
  );
  const onLayoutFooterInternal = React2.useCallback(
    (rect, fromLayoutEffect) => {
      const size = rect[horizontal ? "width" : "height"];
      updateFooterSize(size, () => {
        onLayoutFooter == null ? void 0 : onLayoutFooter(rect, fromLayoutEffect);
      });
    },
    [horizontal, onLayoutFooter, updateFooterSize]
  );
  return /* @__PURE__ */ React2__namespace.createElement(
    SnapOrScroll,
    {
      ...rest,
      ...ScrollComponent === ListComponentScrollView ? { useWindowScroll } : {},
      contentContainerStyle: [
        horizontal ? {
          height: "100%"
        } : {},
        contentContainerStyle
      ],
      contentOffset: initialContentOffset !== void 0 ? horizontal ? { x: initialContentOffset, y: 0 } : { x: 0, y: initialContentOffset } : void 0,
      horizontal,
      maintainVisibleContentPosition: maintainVisibleContentPosition.size || maintainVisibleContentPosition.data ? { minIndexForVisible: 0 } : void 0,
      onLayout,
      onScroll: onScroll2,
      ref: refScrollView,
      ScrollComponent: snapToIndices ? ScrollComponent : void 0,
      style: autoOtherAxisStyle ? [autoOtherAxisStyle, style] : style
    },
    /* @__PURE__ */ React2__namespace.createElement(ScrollAdjust, null),
    ListHeaderComponent && /* @__PURE__ */ React2__namespace.createElement(LayoutView, { onLayoutChange: onLayoutHeader, style: ListHeaderComponentStyle }, getComponent(ListHeaderComponent)),
    ListEmptyComponent && getComponent(ListEmptyComponent),
    shouldRenderAlignItemsAtEndSpacer && /* @__PURE__ */ React2__namespace.createElement(AlignItemsAtEndSpacer, { horizontal }),
    canRender && !ListEmptyComponent && /* @__PURE__ */ React2__namespace.createElement(
      Containers,
      {
        getRenderedItem: getRenderedItem2,
        horizontal,
        ItemSeparatorComponent,
        recycleItems,
        stickyHeaderConfig
      }
    ),
    ListFooterComponent && /* @__PURE__ */ React2__namespace.createElement(LayoutView, { onLayoutChange: onLayoutFooterInternal, style: ListFooterComponentStyle }, getComponent(ListFooterComponent)),
    Platform.OS === "web" && /* @__PURE__ */ React2__namespace.createElement(WebAnchoredEndSpace, { horizontal }),
    IS_DEV && ENABLE_DEVMODE
  );
});
var WEB_UNBOUNDED_HEIGHT_MIN_DATA_LENGTH = 100;
var WEB_UNBOUNDED_HEIGHT_CONTAINER_RATIO = 0.9;
var WEB_UNBOUNDED_HEIGHT_VIEWPORT_RATIO = 0.9;
function useDevChecksImpl(props) {
  const ctx = useStateContext();
  const { childrenMode, keyExtractor, renderScrollComponent, useWindowScroll } = props;
  React2.useEffect(() => {
    if (useWindowScroll && renderScrollComponent) {
      warnDevOnce(
        "useWindowScrollRenderScrollComponent",
        "useWindowScroll is not supported when renderScrollComponent is provided."
      );
    }
  }, [renderScrollComponent, useWindowScroll]);
  React2.useEffect(() => {
    if (!keyExtractor && !ctx.state.isFirst && ctx.state.didDataChange && !childrenMode) {
      warnDevOnce(
        "keyExtractor",
        "Changing data without a keyExtractor can cause slow performance and resetting scroll. If your list data can change you should use a keyExtractor with a unique id for best performance and behavior."
      );
    }
  }, [childrenMode, ctx, keyExtractor]);
  React2.useEffect(() => {
    const state = ctx.state;
    const dataLength = state.props.data.length;
    const useWindowScrollResolved = state.props.useWindowScroll;
    if (Platform.OS !== "web" || useWindowScrollResolved || dataLength < WEB_UNBOUNDED_HEIGHT_MIN_DATA_LENGTH) {
      return;
    }
    const warnIfUnboundedOuterSize = () => {
      const readyToRender = peek$(ctx, "readyToRender");
      const numContainers = peek$(ctx, "numContainers") || 0;
      const totalSize = peek$(ctx, "totalSize") || 0;
      const scrollLength = ctx.state.scrollLength || 0;
      if (!readyToRender || totalSize <= 0 || scrollLength <= 0) {
        return;
      }
      const rendersAlmostEverything = numContainers >= Math.ceil(dataLength * WEB_UNBOUNDED_HEIGHT_CONTAINER_RATIO);
      const viewportMatchesContent = scrollLength >= totalSize * WEB_UNBOUNDED_HEIGHT_VIEWPORT_RATIO;
      if (rendersAlmostEverything && viewportMatchesContent) {
        warnDevOnce(
          "webUnboundedOuterSize",
          "LegendList appears to have an unbounded outer height on web, so virtualization is effectively disabled. Set a bounded height or flex: 1 on the list container, or use useWindowScroll."
        );
      }
    };
    warnIfUnboundedOuterSize();
    const unsubscribe = [
      listen$(ctx, "numContainers", warnIfUnboundedOuterSize),
      listen$(ctx, "readyToRender", warnIfUnboundedOuterSize),
      listen$(ctx, "totalSize", warnIfUnboundedOuterSize)
    ];
    return () => {
      for (const unsub of unsubscribe) {
        unsub();
      }
    };
  }, [ctx]);
}
function useDevChecksNoop(_props) {
}
var useDevChecks = IS_DEV ? useDevChecksImpl : useDevChecksNoop;

// src/core/checkResetContainers.ts
function checkResetContainers(ctx, dataProp, { didColumnsChange = false } = {}) {
  const state = ctx.state;
  const { previousData } = state;
  const { maintainScrollAtEnd } = state.props;
  if (didColumnsChange) {
    state.sizes.clear();
    state.sizesKnown.clear();
    for (const key in state.averageSizes) {
      delete state.averageSizes[key];
    }
    state.minIndexSizeChanged = 0;
    state.scrollForNextCalculateItemsInView = void 0;
  }
  calculateItemsInView(ctx, { dataChanged: true, doMVCP: true });
  const shouldMaintainScrollAtEnd = !didColumnsChange && (maintainScrollAtEnd == null ? void 0 : maintainScrollAtEnd.onDataChange);
  const didMaintainScrollAtEnd = shouldMaintainScrollAtEnd && doMaintainScrollAtEnd(ctx);
  if (!didMaintainScrollAtEnd && previousData && dataProp.length > previousData.length) {
    state.isEndReached = false;
  }
  if (!didMaintainScrollAtEnd) {
    checkThresholds(ctx);
  }
  delete state.previousData;
}

// src/core/checkStructuralDataChange.ts
function checkStructuralDataChange(state, dataProp, previousData) {
  var _a3;
  state.pendingDataComparison = void 0;
  if (!previousData || !dataProp || dataProp.length !== previousData.length) {
    return true;
  }
  const {
    idCache,
    props: { itemsAreEqual, keyExtractor }
  } = state;
  let byIndex;
  for (let i = 0; i < dataProp.length; i++) {
    if (dataProp[i] === previousData[i]) {
      continue;
    }
    if (!keyExtractor) {
      if (byIndex) {
        state.pendingDataComparison = { byIndex, nextData: dataProp, previousData };
      }
      return true;
    }
    const previousKey = (_a3 = idCache[i]) != null ? _a3 : keyExtractor(previousData[i], i);
    const nextKey = keyExtractor(dataProp[i], i);
    if (previousKey !== nextKey) {
      if (byIndex) {
        state.pendingDataComparison = { byIndex, nextData: dataProp, previousData };
      }
      return true;
    }
    if (!itemsAreEqual) {
      if (byIndex) {
        state.pendingDataComparison = { byIndex, nextData: dataProp, previousData };
      }
      return true;
    }
    const isEqual = itemsAreEqual(previousData[i], dataProp[i], i, dataProp);
    byIndex != null ? byIndex : byIndex = [];
    byIndex[i] = isEqual ? 1 : 2;
    if (!isEqual) {
      state.pendingDataComparison = { byIndex, nextData: dataProp, previousData };
      return true;
    }
  }
  return false;
}

// src/core/doInitialAllocateContainers.ts
function doInitialAllocateContainers(ctx) {
  var _a3, _b;
  const state = ctx.state;
  const {
    scrollLength,
    props: { data, getFixedItemSize, getItemType, numColumns, estimatedItemSize }
  } = state;
  const drawDistance = getEffectiveDrawDistance(ctx);
  const hasContainers = peek$(ctx, "numContainers");
  if (scrollLength > 0 && data.length > 0 && !hasContainers) {
    let averageItemSize;
    if (getFixedItemSize) {
      let totalSize = 0;
      const num = Math.min(20, data.length);
      for (let i = 0; i < num; i++) {
        const item = data[i];
        if (item !== void 0) {
          const itemType = (_a3 = getItemType == null ? void 0 : getItemType(item, i)) != null ? _a3 : "";
          totalSize += ((_b = getFixedItemSize(item, i, itemType)) != null ? _b : estimatedItemSize) + ctx.scrollAxisGap;
        }
      }
      averageItemSize = totalSize / num;
    } else {
      averageItemSize = estimatedItemSize + ctx.scrollAxisGap;
    }
    const numContainers = Math.max(
      1,
      Math.ceil((scrollLength + drawDistance * 2) / averageItemSize * numColumns)
    );
    for (let i = 0; i < numContainers; i++) {
      set$(ctx, `containerPosition${i}`, POSITION_OUT_OF_VIEW);
      set$(ctx, `containerColumn${i}`, -1);
      set$(ctx, `containerSpan${i}`, 1);
    }
    set$(ctx, "numContainers", numContainers);
    set$(ctx, "numContainersPooled", getInitialContainerPoolSize(data.length, numContainers));
    if (!IsNewArchitecture || state.lastLayout) {
      if (state.initialScroll) {
        requestAnimationFrame(() => {
          calculateItemsInView(ctx, { dataChanged: true, doMVCP: true });
        });
      } else {
        calculateItemsInView(ctx, { dataChanged: true, doMVCP: true });
      }
    }
    return true;
  }
}
function getWindowSize() {
  const screenSize = ReactNative.Dimensions.get("window");
  return {
    height: screenSize.height,
    width: screenSize.width
  };
}

// src/core/handleLayout.ts
function handleLayout(ctx, layoutParam, setCanRender) {
  const state = ctx.state;
  const { maintainScrollAtEnd, useWindowScroll } = state.props;
  const scrollAxis = state.props.horizontal ? "width" : "height";
  const otherAxis = state.props.horizontal ? "height" : "width";
  let layout = layoutParam;
  if (useWindowScroll) {
    const windowScrollAxisLength = getWindowSize()[scrollAxis];
    layout = windowScrollAxisLength > 0 ? { ...layoutParam, [scrollAxis]: windowScrollAxisLength } : layoutParam;
  }
  const measuredLength = layout[scrollAxis];
  const previousLength = state.scrollLength;
  const scrollLength = measuredLength > 0 ? measuredLength : previousLength;
  const otherAxisSize = layout[otherAxis];
  const needsCalculate = !state.lastLayout || scrollLength > state.scrollLength || state.lastLayout.x !== layout.x || state.lastLayout.y !== layout.y;
  state.lastLayout = layout;
  const prevOtherAxisSize = state.otherAxisSize;
  const didChange = scrollLength !== state.scrollLength || otherAxisSize !== prevOtherAxisSize;
  if (didChange) {
    state.scrollLength = scrollLength;
    state.otherAxisSize = otherAxisSize;
    updateContentMetricsState(ctx);
    state.lastBatchingAction = Date.now();
    state.scrollForNextCalculateItemsInView = void 0;
    if (scrollLength > 0) {
      doInitialAllocateContainers(ctx);
    }
    if (needsCalculate) {
      calculateItemsInView(ctx, { doMVCP: true });
    }
    if (didChange || otherAxisSize !== prevOtherAxisSize) {
      set$(ctx, "scrollSize", { height: layout.height, width: layout.width });
    }
    if (maintainScrollAtEnd == null ? void 0 : maintainScrollAtEnd.onLayout) {
      doMaintainScrollAtEnd(ctx);
    }
    checkThresholds(ctx);
    if (state) {
      const crossAxisPadding = state.props.horizontal ? (state.props.stylePaddingTop || 0) + (state.props.stylePaddingBottom || 0) : (state.props.stylePaddingLeft || 0) + (state.props.stylePaddingRight || 0);
      state.needsOtherAxisSize = otherAxisSize - crossAxisPadding < 10;
    }
    if (IS_DEV && measuredLength === 0) {
      warnDevOnce(
        "height0",
        `List ${state.props.horizontal ? "width" : "height"} is 0. You may need to set a style or \`flex: \` for the list, because children are absolutely positioned.`
      );
    }
  }
  setCanRender(true);
}

// src/core/onScroll.ts
function trackInitialScrollNativeProgress(state, newScroll) {
  const initialNativeScrollWatchdog = initialScrollWatchdog.get(state);
  const didInitialScrollReachTarget = !!initialNativeScrollWatchdog && initialScrollWatchdog.didReachTarget(newScroll, initialNativeScrollWatchdog);
  if (didInitialScrollReachTarget) {
    initialScrollWatchdog.clear(state);
    return;
  }
  if (initialNativeScrollWatchdog) {
    state.hasScrolled = false;
    initialScrollWatchdog.set(state, {
      startScroll: initialNativeScrollWatchdog.startScroll,
      targetOffset: initialNativeScrollWatchdog.targetOffset
    });
  }
}
function shouldDeferPublicOnScroll(state) {
  var _a3;
  return Platform.OS === "web" && !!state.initialScroll && ((_a3 = state.initialScrollSession) == null ? void 0 : _a3.kind) === "bootstrap" && !state.didFinishInitialScroll;
}
function cloneScrollEvent(event) {
  return {
    ...event,
    nativeEvent: {
      ...event.nativeEvent
    }
  };
}
function onScroll(ctx, event) {
  var _a3, _b, _c, _d, _e, _f;
  const state = ctx.state;
  const { scrollProcessingEnabled } = state;
  if (scrollProcessingEnabled === false) {
    return;
  }
  if (((_b = (_a3 = event.nativeEvent) == null ? void 0 : _a3.contentSize) == null ? void 0 : _b.height) === 0 && ((_c = event.nativeEvent.contentSize) == null ? void 0 : _c.width) === 0) {
    return;
  }
  let insetChanged = false;
  if ((_d = event.nativeEvent) == null ? void 0 : _d.contentInset) {
    const { contentInset } = event.nativeEvent;
    const prevInset = state.nativeContentInset;
    if (!prevInset || prevInset.top !== contentInset.top || prevInset.bottom !== contentInset.bottom || prevInset.left !== contentInset.left || prevInset.right !== contentInset.right) {
      state.nativeContentInset = contentInset;
      insetChanged = true;
    }
  }
  let newScroll = event.nativeEvent.contentOffset[state.props.horizontal ? "x" : "y"];
  if (state.props.horizontal) {
    newScroll = toLogicalHorizontalOffset(state, newScroll, (_e = event.nativeEvent.contentSize) == null ? void 0 : _e.width);
  }
  const isFinishedEndInitialScroll = state.didFinishInitialScroll && ((_f = state.initialScroll) == null ? void 0 : _f.viewPosition) === 1 && state.scroll > state.scrollLength;
  const shouldIgnoreNegativeInsetChange = Platform.OS !== "web" && insetChanged && newScroll < 0 && isFinishedEndInitialScroll;
  if (shouldIgnoreNegativeInsetChange) {
    return;
  }
  state.lastNativeScroll = newScroll;
  state.lastNativeScrollTime = Date.now();
  if (state.scrollingTo && state.scrollingTo.offset >= newScroll) {
    const maxOffset = clampScrollOffset(ctx, newScroll, state.scrollingTo);
    if (newScroll !== maxOffset && Math.abs(newScroll - maxOffset) > 1) {
      newScroll = maxOffset;
      scrollTo(ctx, {
        forceScroll: true,
        isInitialScroll: true,
        noScrollingTo: true,
        offset: newScroll
      });
      return;
    }
  }
  state.scrollPending = newScroll;
  updateScroll(ctx, newScroll, insetChanged);
  trackInitialScrollNativeProgress(state, newScroll);
  clearFinishedBootstrapInitialScrollTargetIfMovedAway(ctx);
  if (state.scrollingTo) {
    checkFinishedScroll(ctx);
  }
  if (state.props.onScroll) {
    if (shouldDeferPublicOnScroll(state)) {
      state.deferredPublicOnScrollEvent = cloneScrollEvent(event);
    } else {
      state.props.onScroll(event);
    }
  }
}

// src/core/ScrollAdjustHandler.ts
var ScrollAdjustHandler = class {
  constructor(ctx) {
    this.appliedAdjust = 0;
    this.pendingAdjust = 0;
    this.ctx = ctx;
  }
  requestAdjust(add) {
    const scrollingTo = this.ctx.state.scrollingTo;
    if (PlatformAdjustBreaksScroll && (scrollingTo == null ? void 0 : scrollingTo.animated) && !scrollingTo.isInitialScroll) {
      this.pendingAdjust += add;
      set$(this.ctx, "scrollAdjustPending", this.pendingAdjust);
    } else {
      this.appliedAdjust += add;
      set$(this.ctx, "scrollAdjust", this.appliedAdjust);
    }
    if (this.ctx.state.scrollingTo) {
      checkFinishedScroll(this.ctx);
    }
  }
  getAdjust() {
    return this.appliedAdjust;
  }
  commitPendingAdjust(scrollTarget) {
    if (PlatformAdjustBreaksScroll) {
      const state = this.ctx.state;
      const pending = this.pendingAdjust;
      this.pendingAdjust = 0;
      if (pending !== 0) {
        let targetScroll;
        if ((scrollTarget == null ? void 0 : scrollTarget.index) !== void 0) {
          const currentOffset = calculateOffsetForIndex(this.ctx, scrollTarget.index);
          targetScroll = calculateOffsetWithOffsetPosition(this.ctx, currentOffset, scrollTarget);
          targetScroll = clampScrollOffset(this.ctx, targetScroll, scrollTarget);
        } else {
          targetScroll = clampScrollOffset(this.ctx, state.scroll + pending);
        }
        const adjustment = targetScroll - state.scroll;
        if (Math.abs(adjustment) > 0.1 || Math.abs(pending) > 0.1) {
          this.appliedAdjust += adjustment;
          state.scroll = targetScroll;
          state.scrollForNextCalculateItemsInView = void 0;
          set$(this.ctx, "scrollAdjust", this.appliedAdjust);
        }
        set$(this.ctx, "scrollAdjustPending", 0);
        calculateItemsInView(this.ctx);
      }
    }
  }
};

// src/core/updateContentInsetEndAdjustment.ts
function updateContentInsetEndAdjustment(ctx, previousContentInsetEndAdjustment) {
  const state = ctx.state;
  const previousContentInsetEnd = getContentInsetEnd(ctx, previousContentInsetEndAdjustment);
  const nextContentInsetEnd = getContentInsetEnd(ctx);
  const insetDiff = nextContentInsetEnd - previousContentInsetEnd;
  if (insetDiff !== 0) {
    const wasWithinEndThreshold = !!peek$(ctx, "isWithinMaintainScrollAtEndThreshold");
    updateScroll(ctx, state.scroll, true, { markHasScrolled: false });
    const didRetargetInitialScroll = retargetActiveInitialScrollAtEnd(ctx);
    if (!didRetargetInitialScroll && wasWithinEndThreshold && (Platform.OS !== "web" || insetDiff > 0)) {
      requestAdjust(ctx, insetDiff);
    }
  }
}
function useWrapIfItem(fn) {
  return React2.useMemo(
    () => fn ? (arg1, arg2, arg3) => arg1 !== void 0 && arg2 !== void 0 ? fn(arg1, arg2, arg3) : void 0 : void 0,
    [fn]
  );
}
var useCombinedRef = (...refs) => {
  const callback = React2.useCallback((element) => {
    for (const ref of refs) {
      if (!ref) {
        continue;
      }
      if (isFunction(ref)) {
        ref(element);
      } else {
        ref.current = element;
      }
    }
  }, refs);
  return callback;
};
var StyleSheet = ReactNative.StyleSheet;
function useStickyScrollHandler(stickyHeaderIndices, horizontal, ctx, onScroll2) {
  const shouldUseRnAnimatedEngine = !ctx.state.props.stickyPositionComponentInternal;
  return React2.useMemo(() => {
    if ((stickyHeaderIndices == null ? void 0 : stickyHeaderIndices.length) && shouldUseRnAnimatedEngine) {
      const { animatedScrollY } = ctx;
      return ReactNative.Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: { [horizontal ? "x" : "y"]: animatedScrollY }
            }
          }
        ],
        {
          listener: onScroll2,
          useNativeDriver: true
        }
      );
    }
    return onScroll2;
  }, [stickyHeaderIndices == null ? void 0 : stickyHeaderIndices.join(","), horizontal, shouldUseRnAnimatedEngine]);
}

// src/utils/createColumnWrapperStyle.ts
function createColumnWrapperStyle(contentContainerStyle) {
  const { gap, columnGap, rowGap } = contentContainerStyle;
  if (gap || columnGap || rowGap) {
    contentContainerStyle.gap = void 0;
    contentContainerStyle.columnGap = void 0;
    contentContainerStyle.rowGap = void 0;
    return {
      columnGap,
      gap,
      rowGap
    };
  }
}

// src/core/scrollToEnd.ts
function scrollToEnd(ctx, options) {
  const state = ctx.state;
  const data = state.props.data;
  const index = data.length - 1;
  if (index === -1) {
    return false;
  }
  const paddingBottom = state.props.stylePaddingBottom || 0;
  const footerSize = peek$(ctx, "footerSize") || 0;
  scrollToIndex(ctx, {
    ...options,
    index,
    viewOffset: -paddingBottom - footerSize + ((options == null ? void 0 : options.viewOffset) || 0),
    viewPosition: 1
  });
  return true;
}

// src/utils/createImperativeHandle.ts
var DEFAULT_AVERAGE_ITEM_SIZE_TYPE = "default";
function getAverageItemSizes(state) {
  const averageItemSizes = {};
  for (const itemType in state.averageSizes) {
    const averageSize = state.averageSizes[itemType];
    if (averageSize) {
      averageItemSizes[itemType || DEFAULT_AVERAGE_ITEM_SIZE_TYPE] = {
        average: averageSize.avg,
        count: averageSize.num
      };
    }
  }
  return averageItemSizes;
}
function triggerMountedContainerLayouts(ctx) {
  for (const triggerLayout of ctx.containerLayoutTriggers.values()) {
    triggerLayout();
  }
}
function createImperativeHandle(ctx, scheduleImperativeScrollCommit) {
  const state = ctx.state;
  const IMPERATIVE_SCROLL_SETTLE_MAX_WAIT_MS = 800;
  const IMPERATIVE_SCROLL_SETTLE_STABLE_FRAMES = 2;
  let imperativeScrollToken = 0;
  const isSettlingAfterDataChange = () => !!state.didDataChange || !!state.didColumnsChange || state.queuedMVCPRecalculate !== void 0 || state.ignoreScrollFromMVCP !== void 0;
  const isScrollToIndexReady = (targetIndex, allowEmpty = false) => {
    var _a3;
    const props = state.props;
    const dataLength = props.data.length;
    const anchorIndex = (_a3 = props.anchoredEndSpace) == null ? void 0 : _a3.anchorIndex;
    if (targetIndex < 0) {
      return allowEmpty;
    }
    if (targetIndex >= dataLength) {
      return false;
    }
    if (anchorIndex === void 0 || anchorIndex < 0 || anchorIndex >= dataLength || targetIndex < anchorIndex) {
      return true;
    }
    return areKnownOrFixedItemSizesAvailable(ctx, anchorIndex, dataLength - 1);
  };
  const runWhenReady = (token, run, isReady) => {
    const startedAt = Date.now();
    let stableFrames = 0;
    const check = () => {
      if (token !== imperativeScrollToken) {
        return;
      }
      if (isSettlingAfterDataChange() || !isReady()) {
        stableFrames = 0;
      } else {
        stableFrames += 1;
      }
      const timedOut = Date.now() - startedAt >= IMPERATIVE_SCROLL_SETTLE_MAX_WAIT_MS;
      if (stableFrames >= IMPERATIVE_SCROLL_SETTLE_STABLE_FRAMES || timedOut) {
        run();
        return;
      }
      requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  };
  const runScrollRequest = (token, resolve, run, isReady = () => true) => {
    const runNow = () => {
      if (token !== imperativeScrollToken) {
        return;
      }
      const didStartScroll = run();
      if (!didStartScroll || !state.scrollingTo) {
        if (state.pendingScrollResolve === resolve) {
          state.pendingScrollResolve = void 0;
        }
        resolve();
      }
    };
    if (isSettlingAfterDataChange() || !isReady()) {
      runWhenReady(token, runNow, isReady);
    } else {
      runNow();
    }
  };
  const startImperativeScroll = (resolve) => {
    var _a3;
    const token = ++imperativeScrollToken;
    state.pendingScrollToEnd = void 0;
    (_a3 = state.pendingScrollResolve) == null ? void 0 : _a3.call(state);
    state.pendingScrollResolve = resolve;
    return token;
  };
  const runScrollWithPromise = (run, isReady = () => true) => new Promise((resolve) => {
    const token = startImperativeScroll(resolve);
    runScrollRequest(token, resolve, run, isReady);
  });
  state.runPendingScrollToEnd = () => {
    const pendingScroll = state.pendingScrollToEnd;
    if (pendingScroll) {
      state.pendingScrollToEnd = void 0;
      if (pendingScroll.token === imperativeScrollToken) {
        runScrollRequest(
          pendingScroll.token,
          pendingScroll.resolve,
          () => scrollToEnd(ctx, pendingScroll.options),
          () => isScrollToIndexReady(state.props.data.length - 1, true)
        );
      }
    }
  };
  const scrollIndexIntoView = (options) => {
    if (state) {
      const { index, ...rest } = options;
      const { startNoBuffer, endNoBuffer } = state;
      if (index < startNoBuffer || index > endNoBuffer) {
        const viewPosition = index < startNoBuffer ? 0 : 1;
        scrollToIndex(ctx, {
          ...rest,
          index,
          viewPosition
        });
        return true;
      }
    }
    return false;
  };
  const refScroller = state.refScroller;
  const clearCaches = (options) => {
    var _a3, _b;
    const mode = (_a3 = options == null ? void 0 : options.mode) != null ? _a3 : "sizes";
    state.sizes.clear();
    state.sizesKnown.clear();
    for (const key in state.averageSizes) {
      delete state.averageSizes[key];
    }
    state.minIndexSizeChanged = 0;
    state.scrollForNextCalculateItemsInView = void 0;
    state.pendingTotalSize = void 0;
    state.totalSize = 0;
    set$(ctx, "totalSize", 0);
    if (mode === "full") {
      state.indexByKey.clear();
      state.idCache.length = 0;
      state.positions.length = 0;
      state.columns.length = 0;
      state.columnSpans.length = 0;
    }
    triggerMountedContainerLayouts(ctx);
    (_b = state.triggerCalculateItemsInView) == null ? void 0 : _b.call(state, { forceFullItemPositions: true });
  };
  return {
    clearCaches,
    flashScrollIndicators: () => refScroller.current.flashScrollIndicators(),
    getNativeScrollRef: () => refScroller.current,
    getScrollableNode: () => refScroller.current.getScrollableNode(),
    getScrollResponder: () => refScroller.current.getScrollResponder(),
    getState: () => ({
      activeStickyIndex: peek$(ctx, "activeStickyIndex"),
      contentLength: getContentSize(ctx),
      data: state.props.data,
      elementAtIndex: (index) => {
        var _a3;
        return (_a3 = ctx.viewRefs.get(findContainerId(ctx, getId(state, index)))) == null ? void 0 : _a3.current;
      },
      end: state.endNoBuffer,
      endBuffered: state.endBuffered,
      getAverageItemSizes: () => getAverageItemSizes(state),
      isAtEnd: peek$(ctx, "isAtEnd"),
      isAtStart: peek$(ctx, "isAtStart"),
      isEndReached: state.isEndReached,
      isNearEnd: peek$(ctx, "isNearEnd"),
      isNearStart: peek$(ctx, "isNearStart"),
      isStartReached: state.isStartReached,
      isWithinMaintainScrollAtEndThreshold: peek$(ctx, "isWithinMaintainScrollAtEndThreshold"),
      listen: (signalName, cb) => listen$(ctx, signalName, cb),
      listenToPosition: (key, cb) => listenPosition$(ctx, key, cb),
      positionAtIndex: (index) => state.positions[index],
      positionByKey: (key) => {
        const index = state.indexByKey.get(key);
        return index === void 0 ? void 0 : state.positions[index];
      },
      scroll: state.scroll,
      scrollLength: state.scrollLength,
      scrollVelocity: getScrollVelocity(state),
      sizeAtIndex: (index) => state.sizesKnown.get(getId(state, index)),
      sizes: state.sizesKnown,
      start: state.startNoBuffer,
      startBuffered: state.startBuffered
    }),
    reportContentInset: (inset) => {
      const didChange = setContentInsetOverride(ctx, inset);
      updateScroll(ctx, state.scroll, true, { markHasScrolled: false });
      if (didChange) {
        retargetActiveInitialScrollAtEnd(ctx);
      }
    },
    scrollIndexIntoView: (options) => runScrollWithPromise(() => scrollIndexIntoView(options)),
    scrollItemIntoView: ({ item, ...props }) => runScrollWithPromise(() => {
      const data = state.props.data;
      const index = data.indexOf(item);
      if (index !== -1) {
        scrollIndexIntoView({ index, ...props });
        return true;
      }
      return false;
    }),
    scrollToEnd: (options) => new Promise((resolve) => {
      var _a3;
      const token = startImperativeScroll(resolve);
      state.pendingScrollToEnd = {
        options,
        resolve,
        token
      };
      if (scheduleImperativeScrollCommit) {
        scheduleImperativeScrollCommit();
      } else {
        (_a3 = state.runPendingScrollToEnd) == null ? void 0 : _a3.call(state);
      }
    }),
    scrollToIndex: (params) => {
      return runScrollWithPromise(
        () => {
          scrollToIndex(ctx, params);
          return true;
        },
        params.index >= 0 ? () => isScrollToIndexReady(params.index) : void 0
      );
    },
    scrollToItem: ({ item, ...props }) => runScrollWithPromise(() => {
      const data = state.props.data;
      const index = data.indexOf(item);
      if (index !== -1) {
        scrollToIndex(ctx, { index, ...props });
        return true;
      }
      return false;
    }),
    scrollToOffset: (params) => runScrollWithPromise(() => {
      scrollTo(ctx, params);
      return true;
    }),
    setItemSize: (itemKey, size) => {
      updateItemSizes(ctx, { itemKey, size });
    },
    setScrollProcessingEnabled: (enabled) => {
      state.scrollProcessingEnabled = enabled;
    },
    setVisibleContentAnchorOffset: (value) => {
      const val = isFunction(value) ? value(peek$(ctx, "scrollAdjustUserOffset") || 0) : value;
      set$(ctx, "scrollAdjustUserOffset", val);
    }
  };
}

// src/utils/getAlwaysRenderIndices.ts
var sortAsc = (a, b) => a - b;
var toCount = (value) => typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
var addIndex = (result, dataLength, index) => {
  if (index >= 0 && index < dataLength) {
    result.add(index);
  }
};
function getAlwaysRenderIndices(config, data, keyExtractor, anchoredEndSpaceAnchorIndex) {
  var _a3, _b;
  if (data.length === 0) {
    return [];
  }
  const result = /* @__PURE__ */ new Set();
  const dataLength = data.length;
  const topCount = toCount(config == null ? void 0 : config.top);
  if (topCount > 0) {
    for (let i = 0; i < Math.min(topCount, dataLength); i++) {
      addIndex(result, dataLength, i);
    }
  }
  const bottomCount = toCount(config == null ? void 0 : config.bottom);
  if (bottomCount > 0) {
    for (let i = Math.max(0, dataLength - bottomCount); i < dataLength; i++) {
      addIndex(result, dataLength, i);
    }
  }
  if ((_a3 = config == null ? void 0 : config.indices) == null ? void 0 : _a3.length) {
    for (const index of config.indices) {
      if (!Number.isFinite(index)) continue;
      addIndex(result, dataLength, Math.floor(index));
    }
  }
  if ((_b = config == null ? void 0 : config.keys) == null ? void 0 : _b.length) {
    const keys = new Set(config.keys);
    for (let i = 0; i < dataLength && keys.size > 0; i++) {
      const key = keyExtractor(data[i], i);
      if (keys.has(key)) {
        addIndex(result, dataLength, i);
        keys.delete(key);
      }
    }
  }
  if (anchoredEndSpaceAnchorIndex !== void 0 && Number.isFinite(anchoredEndSpaceAnchorIndex)) {
    const anchorIndex = Math.floor(anchoredEndSpaceAnchorIndex);
    for (let i = anchorIndex >= 0 ? anchorIndex : dataLength; i < dataLength; i++) {
      addIndex(result, dataLength, i);
    }
  }
  const indices = Array.from(result);
  indices.sort(sortAsc);
  return indices;
}

// src/utils/getRenderedItem.ts
function getRenderedItem(ctx, key) {
  var _a3;
  const state = ctx.state;
  if (!state) {
    return null;
  }
  const {
    indexByKey,
    props: { data, getItemType, renderItem }
  } = state;
  const index = indexByKey.get(key);
  if (index === void 0) {
    return null;
  }
  let renderedItem = null;
  const extraData = peek$(ctx, "extraData");
  const item = data[index];
  if (renderItem && !isNullOrUndefined(item)) {
    const itemProps = {
      data,
      extraData,
      index,
      item,
      type: getItemType ? (_a3 = getItemType(item, index)) != null ? _a3 : "" : ""
    };
    renderedItem = renderItem(itemProps);
  }
  return { index, item: data[index], renderedItem };
}

// src/utils/normalizeMaintainScrollAtEnd.ts
function normalizeMaintainScrollAtEndOn(on, hasExplicitOn) {
  var _a3, _b, _c, _d;
  return {
    animated: false,
    onDataChange: hasExplicitOn ? (_a3 = on == null ? void 0 : on.dataChange) != null ? _a3 : false : true,
    onFooterLayout: hasExplicitOn ? (_b = on == null ? void 0 : on.footerLayout) != null ? _b : false : true,
    onItemLayout: hasExplicitOn ? (_c = on == null ? void 0 : on.itemLayout) != null ? _c : false : true,
    onLayout: hasExplicitOn ? (_d = on == null ? void 0 : on.layout) != null ? _d : false : true
  };
}
function normalizeMaintainScrollAtEnd(value) {
  var _a3;
  if (!value) {
    return void 0;
  }
  if (value === true) {
    return {
      ...normalizeMaintainScrollAtEndOn(void 0, false),
      animated: false
    };
  }
  const normalizedTriggers = normalizeMaintainScrollAtEndOn(value.on, "on" in value);
  return {
    ...normalizedTriggers,
    animated: (_a3 = value.animated) != null ? _a3 : false
  };
}

// src/utils/normalizeMaintainVisibleContentPosition.ts
function normalizeMaintainVisibleContentPosition(value) {
  var _a3, _b;
  if (value === true) {
    return { data: true, size: true };
  }
  if (value && typeof value === "object") {
    return {
      data: (_a3 = value.data) != null ? _a3 : false,
      shouldRestorePosition: value.shouldRestorePosition,
      size: (_b = value.size) != null ? _b : true
    };
  }
  if (value === false) {
    return { data: false, size: false };
  }
  return { data: false, size: true };
}

// src/utils/setPaddingTop.ts
function setPaddingTop(ctx, { stylePaddingTop }) {
  const state = ctx.state;
  if (stylePaddingTop !== void 0) {
    const prevStylePaddingTop = peek$(ctx, "stylePaddingTop") || 0;
    if (stylePaddingTop < prevStylePaddingTop) {
      let prevTotalSize = peek$(ctx, "totalSize") || 0;
      set$(ctx, "totalSize", prevTotalSize + prevStylePaddingTop);
      state.timeoutSetPaddingTop = setTimeout(() => {
        prevTotalSize = peek$(ctx, "totalSize") || 0;
        set$(ctx, "totalSize", prevTotalSize - prevStylePaddingTop);
      }, 16);
    }
    set$(ctx, "stylePaddingTop", stylePaddingTop);
  }
}
function useThrottleDebounce(mode) {
  const timeoutRef = React2.useRef(null);
  const lastCallTimeRef = React2.useRef(0);
  const lastArgsRef = React2.useRef(null);
  const clearTimeoutRef = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  const execute = React2.useCallback(
    (callback, delay, ...args) => {
      {
        const now = Date.now();
        lastArgsRef.current = args;
        if (now - lastCallTimeRef.current >= delay) {
          lastCallTimeRef.current = now;
          callback(...args);
          clearTimeoutRef();
        } else {
          clearTimeoutRef();
          timeoutRef.current = setTimeout(
            () => {
              if (lastArgsRef.current) {
                lastCallTimeRef.current = Date.now();
                callback(...lastArgsRef.current);
                timeoutRef.current = null;
                lastArgsRef.current = null;
              }
            },
            delay - (now - lastCallTimeRef.current)
          );
        }
      }
    },
    [mode]
  );
  return execute;
}

// src/utils/throttledOnScroll.ts
function useThrottledOnScroll(originalHandler, scrollEventThrottle) {
  const throttle = useThrottleDebounce("throttle");
  return (event) => throttle(originalHandler, scrollEventThrottle, { nativeEvent: event.nativeEvent });
}

// src/components/LegendList.tsx
var LegendList = typedMemo(
  // biome-ignore lint/nursery/noShadow: const function name shadowing is intentional
  typedForwardRef(function LegendList2(props, forwardedRef) {
    const { children, data: dataProp, renderItem: renderItemProp, ...restProps } = props;
    const isChildrenMode = children !== void 0 && dataProp === void 0;
    const processedProps = isChildrenMode ? {
      ...restProps,
      childrenMode: true,
      data: (isArray(children) ? children : React2__namespace.Children.toArray(children)).flat(1),
      renderItem: ({ item }) => item
    } : {
      ...restProps,
      data: dataProp || [],
      renderItem: renderItemProp
    };
    return /* @__PURE__ */ React2__namespace.createElement(StateProvider, null, /* @__PURE__ */ React2__namespace.createElement(LegendListInner, { ...processedProps, ref: forwardedRef }));
  })
);
var LegendListInner = typedForwardRef(function LegendListInner2(props, forwardedRef) {
  var _a3, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
  const noopOnScroll = React2.useCallback((_event) => {
  }, []);
  if (props.recycleItems === void 0) {
    warnDevOnce(
      "recycleItems-omitted",
      "recycleItems was not provided, so it defaults to false. Set recycleItems explicitly to true for better performance with recycling-aware rows, or false to preserve remount-on-reuse behavior."
    );
  }
  const {
    alignItemsAtEnd = false,
    anchoredEndSpace,
    alwaysRender,
    columnWrapperStyle,
    contentContainerStyle: contentContainerStyleProp,
    contentInset,
    data: dataProp = [],
    dataKey,
    dataVersion,
    drawDistance = 250,
    contentInsetEndAdjustment,
    estimatedItemSize = 100,
    estimatedListSize,
    extraData,
    getFixedItemSize,
    getItemType,
    horizontal,
    rtl,
    estimatedHeaderSize,
    initialScrollAtEnd = false,
    initialScrollIndex: initialScrollIndexProp,
    initialScrollOffset: initialScrollOffsetProp,
    experimental_adaptiveRender,
    itemsAreEqual,
    keyExtractor: keyExtractorProp,
    ListEmptyComponent,
    ListFooterComponent,
    ListFooterComponentStyle,
    ListHeaderComponent,
    maintainScrollAtEnd = false,
    maintainScrollAtEndThreshold = 0.1,
    maintainVisibleContentPosition: maintainVisibleContentPositionProp,
    numColumns: numColumnsProp = 1,
    overrideItemLayout,
    onEndReached,
    onEndReachedThreshold = 0.5,
    onItemSizeChanged,
    onMetricsChange,
    onLayout: onLayoutProp,
    onLoad,
    onMomentumScrollEnd,
    onRefresh,
    onScroll: onScrollProp,
    onStartReached,
    onStartReachedThreshold = 0.5,
    onStickyHeaderChange,
    onFirstVisibleItemChanged,
    onViewableItemsChanged,
    progressViewOffset,
    recycleItems = false,
    refreshControl,
    refreshing,
    refScrollView,
    renderScrollComponent,
    renderItem,
    scrollEventThrottle,
    snapToIndices,
    stickyHeaderIndices: stickyHeaderIndicesProp,
    style: styleProp,
    useWindowScroll = false,
    viewabilityConfig,
    viewabilityConfigCallbackPairs,
    ...rest
  } = props;
  const animatedPropsInternal = props.animatedPropsInternal;
  const positionComponentInternal = props.positionComponentInternal;
  const stickyPositionComponentInternal = props.stickyPositionComponentInternal;
  const {
    positionComponentInternal: _positionComponentInternal,
    stickyPositionComponentInternal: _stickyPositionComponentInternal,
    ...restProps
  } = rest;
  const contentContainerStyleBase = StyleSheet.flatten(contentContainerStyleProp);
  const useAlignItemsAtEndPadding = alignItemsAtEnd && !horizontal && (contentContainerStyleBase == null ? void 0 : contentContainerStyleBase.minHeight) == null && dataProp.length > 0;
  const shouldFlexGrow = alignItemsAtEnd && !useAlignItemsAtEndPadding && (horizontal ? (contentContainerStyleBase == null ? void 0 : contentContainerStyleBase.minWidth) == null : (contentContainerStyleBase == null ? void 0 : contentContainerStyleBase.minHeight) == null);
  const contentContainerStyle = {
    ...contentContainerStyleBase,
    ...alignItemsAtEnd && !useAlignItemsAtEndPadding ? {
      display: "flex",
      flexDirection: horizontal ? "row" : "column",
      ...shouldFlexGrow ? { flexGrow: 1 } : {},
      justifyContent: "flex-end"
    } : {}
  };
  const style = { ...StyleSheet.flatten(styleProp) };
  const stylePaddingTopState = extractPadding(style, contentContainerStyle, "Top");
  const stylePaddingBottomState = extractPadding(style, contentContainerStyle, "Bottom");
  const stylePaddingLeftState = extractPadding(style, contentContainerStyle, "Left");
  const stylePaddingRightState = extractPadding(style, contentContainerStyle, "Right");
  const maintainScrollAtEndConfig = normalizeMaintainScrollAtEnd(maintainScrollAtEnd);
  const maintainVisibleContentPositionConfig = normalizeMaintainVisibleContentPosition(
    maintainVisibleContentPositionProp
  );
  const hasInitialScrollIndex = initialScrollIndexProp !== void 0 && initialScrollIndexProp !== null;
  const hasInitialScrollOffset = initialScrollOffsetProp !== void 0 && initialScrollOffsetProp !== null;
  const shouldInitializeHorizontalRTL = !initialScrollAtEnd && !hasInitialScrollIndex && !hasInitialScrollOffset && isHorizontalRTLProps({ horizontal, rtl });
  const initialScrollUsesOffsetOnly = !initialScrollAtEnd && !hasInitialScrollIndex && (hasInitialScrollOffset || shouldInitializeHorizontalRTL);
  const usesBootstrapInitialScroll = initialScrollAtEnd || hasInitialScrollIndex;
  const initialScrollProp = initialScrollAtEnd ? {
    index: Math.max(0, dataProp.length - 1),
    preserveForBottomPadding: true,
    viewOffset: -stylePaddingBottomState,
    viewPosition: 1
  } : hasInitialScrollIndex ? typeof initialScrollIndexProp === "object" ? {
    index: (_a3 = initialScrollIndexProp.index) != null ? _a3 : 0,
    preserveForBottomPadding: initialScrollIndexProp.viewOffset === void 0 && initialScrollIndexProp.viewPosition === 1 ? true : void 0,
    viewOffset: (_b = initialScrollIndexProp.viewOffset) != null ? _b : initialScrollIndexProp.viewPosition === 1 ? -stylePaddingBottomState : 0,
    viewPosition: (_c = initialScrollIndexProp.viewPosition) != null ? _c : 0
  } : {
    index: initialScrollIndexProp != null ? initialScrollIndexProp : 0,
    viewOffset: initialScrollOffsetProp != null ? initialScrollOffsetProp : 0
  } : initialScrollUsesOffsetOnly ? {
    contentOffset: initialScrollOffsetProp != null ? initialScrollOffsetProp : 0,
    index: 0,
    viewOffset: 0
  } : void 0;
  const [canRender, setCanRender] = React2__namespace.useState(!IsNewArchitecture);
  const [, scheduleImperativeScrollCommit] = React2__namespace.useReducer((value) => value + 1, 0);
  const ctx = useStateContext();
  ctx.columnWrapperStyle = columnWrapperStyle || (contentContainerStyle ? createColumnWrapperStyle(contentContainerStyle) : void 0);
  const scrollAxisGap = horizontal ? (_f = (_d = ctx.columnWrapperStyle) == null ? void 0 : _d.columnGap) != null ? _f : (_e = ctx.columnWrapperStyle) == null ? void 0 : _e.gap : (_i = (_g = ctx.columnWrapperStyle) == null ? void 0 : _g.rowGap) != null ? _i : (_h = ctx.columnWrapperStyle) == null ? void 0 : _h.gap;
  const nextScrollAxisGap = typeof scrollAxisGap === "number" && Number.isFinite(scrollAxisGap) ? scrollAxisGap : 0;
  const refScroller = React2.useRef(null);
  const combinedRef = useCombinedRef(refScroller, refScrollView);
  const keyExtractor = keyExtractorProp != null ? keyExtractorProp : ((_item, index) => index.toString());
  const stickyHeaderIndices = stickyHeaderIndicesProp;
  const contentInsetEndAdjustmentResolved = Platform.OS === "web" ? contentInsetEndAdjustment : void 0;
  const previousContentInsetEndAdjustmentRef = React2.useRef(contentInsetEndAdjustmentResolved);
  const alwaysRenderIndices = React2.useMemo(() => {
    const indices = getAlwaysRenderIndices(alwaysRender, dataProp, keyExtractor, anchoredEndSpace == null ? void 0 : anchoredEndSpace.anchorIndex);
    return { arr: indices, set: new Set(indices) };
  }, [
    anchoredEndSpace == null ? void 0 : anchoredEndSpace.anchorIndex,
    alwaysRender == null ? void 0 : alwaysRender.top,
    alwaysRender == null ? void 0 : alwaysRender.bottom,
    (_j = alwaysRender == null ? void 0 : alwaysRender.indices) == null ? void 0 : _j.join(","),
    (_k = alwaysRender == null ? void 0 : alwaysRender.keys) == null ? void 0 : _k.join(","),
    dataProp,
    dataKey,
    dataVersion,
    keyExtractor
  ]);
  const useWindowScrollResolved = Platform.OS === "web" && !!useWindowScroll && !renderScrollComponent;
  const refState = React2.useRef(void 0);
  const hasOverrideItemLayout = !!overrideItemLayout;
  const prevHasOverrideItemLayout = React2.useRef(hasOverrideItemLayout);
  if (!refState.current) {
    if (!ctx.state) {
      const initialScrollLength = (estimatedListSize != null ? estimatedListSize : IsNewArchitecture ? { height: 0, width: 0 } : getWindowSize())[horizontal ? "width" : "height"];
      ctx.values.set("adaptiveRender", (_l = experimental_adaptiveRender == null ? void 0 : experimental_adaptiveRender.initialMode) != null ? _l : "normal");
      ctx.state = {
        averageSizes: {},
        columnSpans: [],
        columns: [],
        containerItemKeys: /* @__PURE__ */ new Map(),
        containerItemTypes: /* @__PURE__ */ new Map(),
        contentInsetOverride: void 0,
        dataChangeEpoch: 0,
        dataChangeNeedsScrollUpdate: false,
        didColumnsChange: false,
        didDataChange: false,
        didLoad: false,
        enableScrollForNextCalculateItemsInView: true,
        endBuffered: -1,
        endNoBuffer: -1,
        endReachedSnapshot: void 0,
        firstFullyOnScreenIndex: -1,
        hasHadNonEmptyData: dataProp.length > 0,
        idCache: [],
        idsInView: [],
        indexByKey: /* @__PURE__ */ new Map(),
        initialScroll: initialScrollProp,
        initialScrollSession: initialScrollProp ? {
          kind: initialScrollUsesOffsetOnly ? "offset" : "bootstrap",
          previousDataLength: dataProp.length
        } : void 0,
        isEndReached: null,
        isFirst: true,
        isStartReached: null,
        lastBatchingAction: Date.now(),
        lastLayout: void 0,
        lastScrollDelta: 0,
        loadStartTime: Date.now(),
        minIndexSizeChanged: 0,
        nativeContentInset: void 0,
        nativeMarginTop: 0,
        pendingDataComparison: void 0,
        pendingNativeMVCPAdjust: void 0,
        positions: [],
        props: {},
        queuedCalculateItemsInView: 0,
        queuedFullDrawDistancePrewarm: void 0,
        refScroller: { current: null },
        scroll: 0,
        scrollAdjustHandler: new ScrollAdjustHandler(ctx),
        scrollForNextCalculateItemsInView: void 0,
        scrollHistory: [],
        scrollLength: initialScrollLength,
        scrollPending: 0,
        scrollPrev: 0,
        scrollPrevTime: 0,
        scrollProcessingEnabled: true,
        scrollTime: 0,
        sizes: /* @__PURE__ */ new Map(),
        sizesKnown: /* @__PURE__ */ new Map(),
        startBuffered: -1,
        startNoBuffer: -1,
        startReachedSnapshot: void 0,
        startReachedSnapshotDataChangeEpoch: void 0,
        stickyContainerPool: /* @__PURE__ */ new Set(),
        stickyContainers: /* @__PURE__ */ new Map(),
        timeoutAdaptiveRender: void 0,
        timeouts: /* @__PURE__ */ new Set(),
        totalSize: 0,
        viewabilityConfigCallbackPairs: void 0
      };
      const internalState = ctx.state;
      internalState.triggerCalculateItemsInView = (params) => calculateItemsInView(ctx, params);
      internalState.reprocessCurrentScroll = () => updateScroll(ctx, internalState.scroll, true);
      set$(ctx, "maintainVisibleContentPosition", maintainVisibleContentPositionConfig);
      set$(ctx, "extraData", extraData);
      if (estimatedHeaderSize !== void 0) {
        set$(ctx, "headerSize", estimatedHeaderSize);
      }
    }
    refState.current = ctx.state;
  }
  const state = refState.current;
  const isFirstLocal = state.isFirst;
  const previousAdaptiveRender = state.props.adaptiveRender;
  const previousNumColumnsProp = state.props.numColumns;
  const didScrollAxisGapChange = !isFirstLocal && ctx.scrollAxisGap !== nextScrollAxisGap;
  ctx.scrollAxisGap = nextScrollAxisGap;
  state.didColumnsChange = numColumnsProp !== previousNumColumnsProp || didScrollAxisGapChange;
  const previousDataLength = (_n = (_m = state.props.data) == null ? void 0 : _m.length) != null ? _n : 0;
  const didDataReferenceChangeLocal = state.props.data !== dataProp;
  const didDataKeyChangeLocal = state.props.dataKey !== dataKey;
  const didDataVersionChangeLocal = state.props.dataVersion !== dataVersion;
  const didDataChangeLocal = didDataKeyChangeLocal || didDataVersionChangeLocal || didDataReferenceChangeLocal && checkStructuralDataChange(state, dataProp, state.props.data);
  const shouldResetFreshDataLayout = !isFirstLocal && didDataChangeLocal && state.hasHadNonEmptyData && (didDataKeyChangeLocal || previousDataLength === 0) && dataProp.length > 0;
  if (didDataChangeLocal && !initialScrollAtEnd && state.didFinishInitialScroll && ((_o = state.initialScroll) == null ? void 0 : _o.viewPosition) === 1 && state.props.data.length > 0) {
    clearPreservedInitialScrollTarget(state);
  }
  if (didDataChangeLocal) {
    state.dataChangeEpoch += 1;
    state.dataChangeNeedsScrollUpdate = true;
    state.didDataChange = true;
    state.previousData = state.props.data;
  }
  const throttledOnScroll = useThrottledOnScroll(onScrollProp != null ? onScrollProp : noopOnScroll, scrollEventThrottle != null ? scrollEventThrottle : 0);
  const throttleScrollFn = scrollEventThrottle && onScrollProp ? throttledOnScroll : onScrollProp;
  const anchoredEndSpaceResolved = Platform.OS === "web" && anchoredEndSpace ? { ...anchoredEndSpace, includeInEndInset: true } : anchoredEndSpace;
  const didAnchoredEndSpaceAnchorIndexChange = !isFirstLocal && !didDataChangeLocal && ((_p = state.props.anchoredEndSpace) == null ? void 0 : _p.anchorIndex) !== (anchoredEndSpaceResolved == null ? void 0 : anchoredEndSpaceResolved.anchorIndex);
  state.props = {
    adaptiveRender: experimental_adaptiveRender,
    alignItemsAtEnd,
    alignItemsAtEndPaddingEnabled: useAlignItemsAtEndPadding,
    alwaysRender,
    alwaysRenderIndicesArr: alwaysRenderIndices.arr,
    alwaysRenderIndicesSet: alwaysRenderIndices.set,
    anchoredEndSpace: anchoredEndSpaceResolved,
    animatedProps: animatedPropsInternal,
    contentContainerAlignItems: contentContainerStyle.alignItems,
    contentInset,
    contentInsetEndAdjustment: contentInsetEndAdjustmentResolved,
    data: dataProp,
    dataKey,
    dataVersion,
    drawDistance,
    estimatedItemSize,
    getFixedItemSize: useWrapIfItem(getFixedItemSize),
    getItemType: useWrapIfItem(getItemType),
    horizontal: !!horizontal,
    itemsAreEqual,
    keyExtractor: useWrapIfItem(keyExtractor),
    maintainScrollAtEnd: maintainScrollAtEndConfig,
    maintainScrollAtEndThreshold,
    maintainVisibleContentPosition: maintainVisibleContentPositionConfig,
    numColumns: numColumnsProp,
    onEndReached,
    onEndReachedThreshold,
    onFirstVisibleItemChanged,
    onItemSizeChanged,
    onLoad,
    onScroll: throttleScrollFn,
    onStartReached,
    onStartReachedThreshold,
    onStickyHeaderChange,
    overrideItemLayout,
    positionComponentInternal,
    recycleItems: !!recycleItems,
    renderItem,
    rtl,
    snapToIndices,
    stickyHeaderIndicesArr: stickyHeaderIndices != null ? stickyHeaderIndices : [],
    stickyHeaderIndicesSet: React2.useMemo(() => new Set(stickyHeaderIndices != null ? stickyHeaderIndices : []), [stickyHeaderIndices == null ? void 0 : stickyHeaderIndices.join(",")]),
    stickyPositionComponentInternal,
    stylePaddingBottom: stylePaddingBottomState,
    stylePaddingLeft: stylePaddingLeftState,
    stylePaddingRight: stylePaddingRightState,
    stylePaddingTop: stylePaddingTopState,
    useWindowScroll: useWindowScrollResolved
  };
  state.refScroller = refScroller;
  if (!isFirstLocal && previousAdaptiveRender && !experimental_adaptiveRender) {
    resetAdaptiveRender(ctx);
  }
  if (shouldResetFreshDataLayout) {
    resetInitialRenderState(ctx, {
      resetInitialScroll: !!initialScrollProp,
      resetLayout: true
    });
  }
  const memoizedLastItemKeys = React2.useMemo(() => {
    if (!dataProp.length) return [];
    return Array.from(
      { length: Math.min(numColumnsProp, dataProp.length) },
      (_, i) => getId(state, dataProp.length - 1 - i)
    );
  }, [dataProp, dataKey, dataVersion, numColumnsProp]);
  const initializeStateVars = (shouldAdjustPadding) => {
    set$(ctx, "lastItemKeys", memoizedLastItemKeys);
    set$(ctx, "numColumns", numColumnsProp);
    const prevPaddingTop = peek$(ctx, "stylePaddingTop");
    setPaddingTop(ctx, { stylePaddingTop: stylePaddingTopState });
    refState.current.props.stylePaddingBottom = stylePaddingBottomState;
    updateContentMetricsState(ctx);
    let paddingDiff = stylePaddingTopState - prevPaddingTop;
    if (shouldAdjustPadding && maintainVisibleContentPositionConfig.size && paddingDiff && prevPaddingTop !== void 0 && Platform.OS === "ios") {
      if (state.scroll < 0) {
        paddingDiff += state.scroll;
      }
      requestAdjust(ctx, paddingDiff);
    }
  };
  if (isFirstLocal) {
    initializeStateVars(false);
    resetLayoutCachesForDataChange(state);
    updateItemPositions(
      ctx,
      /*dataChanged*/
      true
    );
  }
  const initialContentOffset = React2.useMemo(() => {
    var _a4, _b2;
    const initialScroll = state.initialScroll;
    if (!initialScroll) {
      return void 0;
    }
    const resolvedOffset = (_a4 = initialScroll.contentOffset) != null ? _a4 : resolveInitialScrollOffset(ctx, initialScroll);
    return usesBootstrapInitialScroll && ((_b2 = state.initialScrollSession) == null ? void 0 : _b2.kind) === "bootstrap" && Platform.OS === "web" ? void 0 : resolvedOffset;
  }, [usesBootstrapInitialScroll]);
  React2.useLayoutEffect(() => {
    initializeInitialScrollOnMount(ctx, {
      alwaysDispatchInitialScroll: shouldInitializeHorizontalRTL,
      dataLength: dataProp.length,
      hasFooterComponent: !!ListFooterComponent,
      initialContentOffset,
      initialScrollAtEnd,
      useBootstrapInitialScroll: usesBootstrapInitialScroll
    });
  }, []);
  if (isFirstLocal || didDataChangeLocal || state.didColumnsChange) {
    refState.current.lastBatchingAction = Date.now();
    if (!keyExtractorProp && !isFirstLocal && didDataChangeLocal) {
      refState.current.sizes.clear();
      refState.current.positions.length = 0;
      refState.current.totalSize = 0;
      set$(ctx, "totalSize", 0);
    }
  }
  if (IS_DEV) {
    useDevChecks(props);
  }
  React2.useLayoutEffect(() => {
    handleInitialScrollDataChange(ctx, {
      dataLength: dataProp.length,
      didDataChange: didDataChangeLocal,
      didStartFreshData: shouldResetFreshDataLayout,
      initialScrollAtEnd,
      latestInitialScroll: initialScrollProp,
      latestInitialScrollSessionKind: initialScrollUsesOffsetOnly ? "offset" : "bootstrap",
      stylePaddingBottom: stylePaddingBottomState,
      useBootstrapInitialScroll: usesBootstrapInitialScroll
    });
  }, [
    dataProp.length,
    dataKey,
    didDataChangeLocal,
    shouldResetFreshDataLayout,
    initialScrollAtEnd,
    stylePaddingBottomState,
    usesBootstrapInitialScroll
  ]);
  React2.useLayoutEffect(() => {
    var _a4;
    if (didAnchoredEndSpaceAnchorIndexChange) {
      state.scrollForNextCalculateItemsInView = void 0;
      (_a4 = state.triggerCalculateItemsInView) == null ? void 0 : _a4.call(state);
    }
    maybeUpdateAnchoredEndSpace(ctx);
  }, [
    ctx,
    dataProp,
    dataVersion,
    anchoredEndSpace == null ? void 0 : anchoredEndSpace.anchorIndex,
    anchoredEndSpace == null ? void 0 : anchoredEndSpace.anchorMaxSize,
    anchoredEndSpace == null ? void 0 : anchoredEndSpace.anchorOffset,
    didAnchoredEndSpaceAnchorIndexChange,
    numColumnsProp
  ]);
  React2.useLayoutEffect(() => {
    const previousContentInsetEndAdjustment = previousContentInsetEndAdjustmentRef.current;
    previousContentInsetEndAdjustmentRef.current = contentInsetEndAdjustmentResolved;
    updateContentInsetEndAdjustment(ctx, previousContentInsetEndAdjustment);
  }, [ctx, contentInsetEndAdjustmentResolved]);
  const onLayoutFooter = React2.useCallback(
    (layout) => {
      if (!usesBootstrapInitialScroll) {
        return;
      }
      handleBootstrapInitialScrollFooterLayout(ctx, {
        dataLength: dataProp.length,
        footerSize: layout[horizontal ? "width" : "height"],
        initialScrollAtEnd,
        stylePaddingBottom: stylePaddingBottomState
      });
    },
    [dataProp.length, initialScrollAtEnd, horizontal, stylePaddingBottomState, usesBootstrapInitialScroll]
  );
  const onLayoutChange = React2.useCallback(
    (layout, fromLayoutEffect) => {
      const previousScrollLength = state.scrollLength;
      const previousOtherAxisSize = state.otherAxisSize;
      handleLayout(ctx, layout, setCanRender);
      maybeUpdateAnchoredEndSpace(ctx);
      const didLayoutAffectBootstrapTarget = previousScrollLength !== state.scrollLength || previousOtherAxisSize !== state.otherAxisSize;
      if (usesBootstrapInitialScroll && !fromLayoutEffect && didLayoutAffectBootstrapTarget) {
        handleBootstrapInitialScrollLayoutChange(ctx);
      }
      if (usesBootstrapInitialScroll) {
        return;
      }
      advanceCurrentInitialScrollSession(ctx);
    },
    [dataProp.length, initialScrollAtEnd, stylePaddingBottomState, usesBootstrapInitialScroll]
  );
  const { onLayout } = useOnLayoutSync({
    onLayoutChange,
    onLayoutProp,
    ref: refScroller
    // the type of ScrollView doesn't include measure?
  });
  React2.useLayoutEffect(() => {
    if (snapToIndices) {
      updateSnapToOffsets(ctx);
    }
  }, [snapToIndices]);
  React2.useLayoutEffect(
    () => initializeStateVars(true),
    [
      dataKey,
      dataVersion,
      memoizedLastItemKeys.join(","),
      numColumnsProp,
      nextScrollAxisGap,
      stylePaddingBottomState,
      stylePaddingTopState,
      useAlignItemsAtEndPadding
    ]
  );
  React2.useLayoutEffect(() => {
    const {
      didColumnsChange,
      didDataChange,
      isFirst,
      props: { data }
    } = state;
    const didAllocateContainers = data.length > 0 && doInitialAllocateContainers(ctx);
    if (!didAllocateContainers && !isFirst && (didDataChange || didColumnsChange)) {
      checkResetContainers(ctx, data, { didColumnsChange });
    }
    if (didDataChange) {
      state.pendingDataComparison = void 0;
    }
    state.didColumnsChange = false;
    state.didDataChange = false;
    state.isFirst = false;
  }, [dataProp, dataKey, dataVersion, numColumnsProp, nextScrollAxisGap]);
  React2.useLayoutEffect(() => {
    var _a4;
    set$(ctx, "extraData", extraData);
    const didToggleOverride = prevHasOverrideItemLayout.current !== hasOverrideItemLayout;
    prevHasOverrideItemLayout.current = hasOverrideItemLayout;
    if ((hasOverrideItemLayout || didToggleOverride) && numColumnsProp > 1) {
      (_a4 = state.triggerCalculateItemsInView) == null ? void 0 : _a4.call(state, { forceFullItemPositions: true });
    }
  }, [extraData, hasOverrideItemLayout, numColumnsProp]);
  React2.useEffect(() => {
    if (!onMetricsChange) {
      return;
    }
    let lastMetrics;
    const emitMetrics = () => {
      const metrics = {
        footerSize: peek$(ctx, "footerSize") || 0,
        headerSize: peek$(ctx, "headerSize") || 0
      };
      if (!lastMetrics || metrics.headerSize !== lastMetrics.headerSize || metrics.footerSize !== lastMetrics.footerSize) {
        lastMetrics = metrics;
        onMetricsChange(metrics);
      }
    };
    emitMetrics();
    const unsubscribe = [listen$(ctx, "headerSize", emitMetrics), listen$(ctx, "footerSize", emitMetrics)];
    return () => {
      for (const unsub of unsubscribe) {
        unsub();
      }
    };
  }, [ctx, onMetricsChange]);
  React2.useEffect(() => {
    const viewability = setupViewability({
      onViewableItemsChanged,
      viewabilityConfig,
      viewabilityConfigCallbackPairs
    });
    state.viewabilityConfigCallbackPairs = viewability;
    state.enableScrollForNextCalculateItemsInView = true;
    if (viewability) {
      state.scrollForNextCalculateItemsInView = void 0;
    }
  }, [viewabilityConfig, viewabilityConfigCallbackPairs, onViewableItemsChanged]);
  useInit(() => {
    if (!IsNewArchitecture) {
      doInitialAllocateContainers(ctx);
    }
  });
  React2.useImperativeHandle(forwardedRef, () => createImperativeHandle(ctx, scheduleImperativeScrollCommit), []);
  React2.useEffect(() => {
    return () => {
      if (state.queuedFullDrawDistancePrewarm !== void 0) {
        cancelAnimationFrame(state.queuedFullDrawDistancePrewarm);
        state.queuedFullDrawDistancePrewarm = void 0;
      }
      for (const timeout of state.timeouts) {
        clearTimeout(timeout);
      }
      state.timeouts.clear();
    };
  }, [state]);
  React2.useLayoutEffect(() => {
    var _a4;
    (_a4 = state.runPendingScrollToEnd) == null ? void 0 : _a4.call(state);
  });
  React2.useEffect(() => {
    if (Platform.OS !== "web" || usesBootstrapInitialScroll) {
      return;
    }
    advanceCurrentInitialScrollSession(ctx);
  }, [ctx, usesBootstrapInitialScroll]);
  const fns = React2.useMemo(
    () => ({
      getRenderedItem: (key) => getRenderedItem(ctx, key),
      onMomentumScrollEnd: (event) => {
        checkFinishedScrollFallback(ctx);
        if (onMomentumScrollEnd) {
          onMomentumScrollEnd(event);
        }
      },
      onScroll: (event) => onScroll(ctx, event)
    }),
    []
  );
  const onScrollHandler = useStickyScrollHandler(stickyHeaderIndices, horizontal, ctx, fns.onScroll);
  const refreshControlElement = refreshControl;
  return /* @__PURE__ */ React2__namespace.createElement(React2__namespace.Fragment, null, /* @__PURE__ */ React2__namespace.createElement(
    ListComponent,
    {
      ...restProps,
      alignItemsAtEnd,
      canRender,
      contentContainerStyle,
      contentInset,
      getRenderedItem: fns.getRenderedItem,
      horizontal,
      initialContentOffset,
      ListEmptyComponent: dataProp.length === 0 ? ListEmptyComponent : void 0,
      ListFooterComponent,
      ListFooterComponentStyle,
      ListHeaderComponent,
      onLayout,
      onLayoutFooter,
      onMomentumScrollEnd: fns.onMomentumScrollEnd,
      onScroll: onScrollHandler,
      recycleItems,
      refreshControl: refreshControlElement ? stylePaddingTopState > 0 ? React2__namespace.cloneElement(refreshControlElement, {
        progressViewOffset: ((_q = refreshControlElement.props.progressViewOffset) != null ? _q : 0) + stylePaddingTopState
      }) : refreshControlElement : onRefresh && /* @__PURE__ */ React2__namespace.createElement(
        ReactNative.RefreshControl,
        {
          onRefresh,
          progressViewOffset: (progressViewOffset || 0) + stylePaddingTopState,
          refreshing: !!refreshing
        }
      ),
      refScrollView: combinedRef,
      renderScrollComponent,
      scrollAdjustHandler: (_r = refState.current) == null ? void 0 : _r.scrollAdjustHandler,
      scrollEventThrottle: 0,
      snapToIndices,
      stickyHeaderIndices,
      style,
      useWindowScroll: useWindowScrollResolved
    }
  ), IS_DEV && ENABLE_DEBUG_VIEW);
});

// src/entrypoints/shared.ts
var LegendListRuntime = LegendList;
var internal = {
  getComponent,
  getStickyPushLimit,
  IsNewArchitecture,
  POSITION_OUT_OF_VIEW,
  peek$,
  typedForwardRef,
  typedMemo,
  useArr$,
  useCombinedRef,
  useLatestRef,
  useStableRenderComponent,
  useStateContext
};

// src/react-native.ts
var LegendList3 = LegendListRuntime;
var internal2 = internal;

exports.LegendList = LegendList3;
exports.internal = internal2;
exports.useAdaptiveRender = useAdaptiveRender;
exports.useAdaptiveRenderChange = useAdaptiveRenderChange;
exports.useIsLastItem = useIsLastItem;
exports.useListScrollSize = useListScrollSize;
exports.useRecyclingEffect = useRecyclingEffect;
exports.useRecyclingState = useRecyclingState;
exports.useSyncLayout = useSyncLayout;
exports.useViewability = useViewability;
exports.useViewabilityAmount = useViewabilityAmount;
