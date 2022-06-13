import { Box } from "@chakra-ui/react";
import { useSpring } from "framer-motion";
import {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
  useMemo,
  useCallback,
} from "react";
import { useMouse, MouseProvider } from "../scripts/MouseProvider";
import { MotionBox } from "./chakra";

const CursorContext = createContext(null);

export const useCursor = () => {
  return useContext(CursorContext);
};

const CursorProviderInner = ({ children }) => {
  const [isActive, setIsActive] = useState(null);
  const [data, setData] = useState({});
  const { position, velocity } = useMouse();

  const activate = useCallback(
    (data) => {
      setIsActive(true);
      setData((prev) => ({
        ...prev,
        ...data,
      }));
    },
    [setIsActive, setData]
  );

  const deactivate = useCallback(
    (data) => {
      setIsActive(false);
      setData((prev) => {
        const next = { ...prev };
        Object.keys(data).forEach((key) => {
          delete next[key];
        });
        return next;
      });
    },
    [setIsActive, setData]
  );

  const api = useMemo(
    () => ({
      position,
      velocity,
      activate,
      deactivate,
      isActive,
      data,
    }),
    [position, velocity, activate, deactivate, isActive, data]
  );

  return (
    <CursorContext.Provider value={api}>{children}</CursorContext.Provider>
  );
};

const CursorProvider = (props) => {
  return (
    <MouseProvider>
      <CursorProviderInner {...props} />
    </MouseProvider>
  );
};

const CursorFollower = ({ children, spring }) => {
  const cursor = useCursor();
  const springs = {
    x: useSpring(cursor.position.x, spring || { mass: 0.01 }),
    y: useSpring(cursor.position.y, spring || { mass: 0.01 }),
  };

  return (
    <MotionBox
      pos="fixed"
      top={0}
      left={0}
      display="inline-block"
      style={springs}
      zIndex={10}
      pointerEvents="none"
      initial="idle"
      animate={cursor.over ? "over" : "idle"}
    >
      <Box
        position="relative"
        display="inline-block"
        transform="translateX(-50%) translateY(-50%)"
      >
        {typeof children === "function" ? children(cursor) : children}
      </Box>
    </MotionBox>
  );
};

export const CursorTarget = ({ children, data = {}, ...otherProps }) => {
  const ref = useRef(null);
  const cursor = useCursor();

  useEffect(() => {
    return () => cursor.deactivate(data);
  }, []);

  return (
    <Box
      ref={ref}
      onMouseOver={() => cursor.activate(data)}
      onMouseOut={() => cursor.deactivate(data)}
      {...otherProps}
    >
      {children}
    </Box>
  );
};

export const Cursor = {
  Target: CursorTarget,
  Follower: CursorFollower,
  Provider: CursorProvider,
};
