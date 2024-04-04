import { memo, useRef } from "react";
import Typography from "./Typography";

const nextCharStyling = {
  display: "inline-block",
  whiteSpace: "pre",
  margin: "0px",
  color: "gray",
  padding: "-5px",
  border: "0",
  userSelect: "none",
  outline: "0px solid transparent",
  caretColor: "black",
  pointerEvents: "none"
};

const NextCharTypography = memo(({ children, ...props }) => {
  let nextCharRef = useRef();
  return (
    <Typography
      refs={nextCharRef}
      id="cursor"
      style={nextCharStyling}
      contentEditable="true"
      suppressContentEditableWarning={true}
    >
      {children}
    </Typography>
  );
});

export default NextCharTypography;
