import { memo } from "react";
import Typography from "./Typography";
import { IncorrectTypography, CorrectTypography } from "./Typography";
import NextCharTypography from "./NextCharTypography";

const textCharStyles = {
  display: "inline-block",
  whiteSpace: "pre",
  margin: "0px",
  color: "gray",
  userSelect: "none",
  pointerEvents: "none"
};

const TextCharacter = memo(
  ({ chr, id, charsTyped }) => {
    let CharTypography;
    if (id === charsTyped.length) {
      CharTypography = NextCharTypography;
    } else if (id >= charsTyped.length) {
      CharTypography = Typography;
    } else if (charsTyped[id] === chr) {
      CharTypography = CorrectTypography;
    } else {
      CharTypography = IncorrectTypography;
    }

    return <CharTypography style={textCharStyles}>{chr}</CharTypography>;
  },
  (props, nextProps) => {
    if (
      props.id === nextProps.charsTyped.length - 1 ||
      props.id === nextProps.charsTyped.length ||
      props.id === nextProps.charsTyped.length + 1
    ) {
      return false;
    } else {
      return true;
    }
  }
);

export default TextCharacter;
