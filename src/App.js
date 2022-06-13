import { Heading, Box } from "@chakra-ui/react";
import { Cursor, useCursor } from "./animation/Cursor";
import { MotionBox } from "./animation/chakra";
import { useSpring, useTransform } from "framer-motion";

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const MyCursor = () => {
  const cursor = useCursor();

  const rawSkew = useTransform(
    [cursor.velocity.x, cursor.velocity.y],
    ([x, y]) => {
      return clamp((Math.sign(y) * x) / 20, -25, 25);
    }
  );

  const skew = useSpring(rawSkew, {
    mass: 0.2,
    damping: 20,
    stiffness: 100,
  });

  return (
    <Cursor.Follower>
      <MotionBox
        h="90px"
        w="90px"
        rounded="full"
        animate={{
          scale: cursor.isActive ? 1 : 0.12,
        }}
        style={{
          skewY: skew,
          skewX: skew,
        }}
        backdropFilter="invert(1) hue-rotate(120deg)"
      />
    </Cursor.Follower>
  );
};

const NAVBAR_ITEMS = ["Home", "About", "Projects", "contact us"];

function App() {
  return (
    <Cursor.Provider>
      <MyCursor />
      <Box
        display="flex"
      >
        {NAVBAR_ITEMS.map((drink) => (
          <Box
            key={drink}
            p={5}
            borderColor="whiteAlpha.300"
            borderBottomWidth="1px"
          >
            <Cursor.Target display="inline-block">
              <Heading
                cursor="pointer"
                display="inline-block"
                fontWeight={400}
                size="2xl"
                color="#deb1a7"
              >
                {drink}
              </Heading>
            </Cursor.Target>
          </Box>
        ))}
      </Box>
    </Cursor.Provider>
  );
}

export default App;
