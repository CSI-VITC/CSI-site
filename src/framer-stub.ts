import React from "react";
export * from "framer-motion";
import { motion } from "framer-motion";

export const addPropertyControls = () => {};

export const useIsStaticRenderer = () => false;

export const useActiveVariantCallback = (baseVariant: any) => ({
  activeVariantCallback: (cb: any) => cb,
  delay: () => {},
});

export const SmartComponentScopedContainer = ({ children }: any) => children;

export const useVariantState = ({
  defaultVariant,
  enabledGestures,
  variant,
}: any) => {
  const [currentVariant, setCurrentVariant] = React.useState(
    variant || defaultVariant
  );

  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const activeVariant =
    variant ??
    currentVariant ??
    (isPressed
      ? `${defaultVariant}-press`
      : isHovered
      ? `${defaultVariant}-hover`
      : defaultVariant);

  const gestureHandlers: any = {};

  if (enabledGestures?.[defaultVariant]?.hover) {
    gestureHandlers.onMouseEnter = () => setIsHovered(true);
    gestureHandlers.onMouseLeave = () => setIsHovered(false);
  }

  if (enabledGestures?.[defaultVariant]?.press) {
    gestureHandlers.onMouseDown = () => setIsPressed(true);
    gestureHandlers.onMouseUp = () => setIsPressed(false);

    const originalLeave = gestureHandlers.onMouseLeave;

    gestureHandlers.onMouseLeave = () => {
      originalLeave?.();
      setIsPressed(false);
    };
  }

  return {
    baseVariant: activeVariant,
    classNames: isHovered ? "hover" : "",
    clearLoadingGesture: () => {},
    gestureHandlers,
    gestureVariant: isHovered ? `${defaultVariant}-hover` : null,
    isLoading: false,
    setGestureState: () => {},
    setVariant: setCurrentVariant,
    variants: [activeVariant],
  };
};

export const SVG = ({
  __fromCanvasComponent,
  layoutDependency,
  layoutId,
  transformTemplate,
  verticalAlignment,
  withExternalLayout,
  requiresOverflowVisible,
  ...props
}: any) => React.createElement("svg", props);

export const Color = {
  toRgbString: () => "rgb(0,0,0)",
  toHex: () => "#000000",
  toHslString: () => "hsl(0,0%,0%)",
  isColor: () => false,
};

export const useIsInCurrentNavigationTarget = () => true;

export const getFonts = () => [];

export const getFontsFromSharedStyle = () => [];

export const getPropertyControls = () => ({});

export const fontStore = {
  load: () => {},
  loadFonts: () => {},
};

export const useSVGTemplate = () => null;

export const ControlType = {
  Boolean: "boolean",
  Number: "number",
  String: "string",
  Color: "color",
  Image: "image",
  File: "file",
  Enum: "enum",
  ComponentInstance: "componentinstance",
  Array: "array",
  Object: "object",
  Transition: "transition",
};

export const RenderTarget = {
  current: () => 1, // Web
  hasRestrictions: () => false,
};

// Utility helpers
export const cx = (...args: any[]) => args.filter(Boolean).join(" ");

export const useComponentViewport = () => ({
  width: 1000,
  height: 1000,
});

export const useLocaleInfo = () => ({
  locale: "en-US",
  direction: "ltr",
});

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined"
    ? React.useLayoutEffect
    : React.useEffect;

export const addFonts = () => {};

// Collision-safe CSS registry
const cssRegistry: Map<string, string> =
  (globalThis as any).__FRAMER_CSS_REGISTRY__ ||
  ((globalThis as any).__FRAMER_CSS_REGISTRY__ = new Map());

export const withCSS = (Component: any, css?: string[]) => {
  if (
    typeof window !== "undefined" &&
    typeof document !== "undefined" &&
    Array.isArray(css)
  ) {
    css.forEach((styleRule) => {
      if (!styleRule || typeof styleRule !== "string") return;

      let styleId = cssRegistry.get(styleRule);

      if (!styleId) {
        styleId =
          "framer-css-" +
          (globalThis.crypto?.randomUUID?.() ??
            `${Date.now()}-${Math.random().toString(36).slice(2)}`);

        cssRegistry.set(styleRule, styleId);
      }

      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.type = "text/css";
        style.textContent = styleRule;
        document.head.appendChild(style);
      }
    });
  }

  return Component;
};

const injectText = (child: any, newText: string): any => {
  if (React.isValidElement(child)) {
    const childProps = child.props as any;

    if (childProps?.children) {
      if (
        typeof childProps.children === "string" ||
        typeof childProps.children === "number"
      ) {
        return React.cloneElement(child, undefined, newText);
      }

      if (Array.isArray(childProps.children)) {
        return React.cloneElement(
          child,
          undefined,
          React.Children.map(childProps.children, (c, i) =>
            i === 0 ? injectText(c, newText) : null
          )
        );
      }

      return React.cloneElement(
        child,
        undefined,
        injectText(childProps.children, newText)
      );
    }
  }

  return newText;
};

export const RichText = ({
  __fromCanvasComponent,
  layoutDependency,
  layoutId,
  transformTemplate,
  verticalAlignment,
  withExternalLayout,
  requiresOverflowVisible,
  text,
  children,
  style,
  ...props
}: any) => {
  const hasExplicitColor =
    style &&
    (style.color ||
      style["--framer-text-color"] ||
      Object.keys(style).some((k) => k.startsWith("--extracted-")));

  const customStyle = {
    textAlign: "center" as const,
    color: hasExplicitColor ? undefined : "#111111",
    fontFamily: "var(--font-inter), sans-serif",
    ...style,
  };

  const content =
    text !== undefined && children
      ? injectText(children, text)
      : text !== undefined
      ? text
      : children;

  return React.createElement(
    motion.div,
    {
      style: customStyle,
      transformTemplate,
      ...props,
    },
    content
  );
};

export const Image = ({
  __fromCanvasComponent,
  layoutDependency,
  layoutId,
  transformTemplate,
  verticalAlignment,
  withExternalLayout,
  requiresOverflowVisible,
  background,
  children,
  dangerouslySetInnerHTML,
  ...props
}: any) => {
  const src = background?.src || props.src;

  return React.createElement(motion.img, {
    src,
    transformTemplate,
    ...props,
  });
};

export const Link = ({ href, ...props }: any) =>
  React.createElement("a", {
    href: href === "" ? undefined : href,
    ...props,
  });

export const getLoadingLazyAtYPosition = () => 0;

export const ComponentViewportProvider = ({ children }: any) =>
  React.createElement(React.Fragment, null, children);
