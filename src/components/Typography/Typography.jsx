import React from "react";

const CorrectTypographyStyling = {
  color: "#000",
  pointerEvents: "none",
};

const IncorrectTypographyStyling = {
  color: "#eb5757",
  textDecoration: "underline",
  textDecorationColor: "rgba(235, 87, 87, 0.35)",
  pointerEvents: "none",
};

const Typography = ({ children, ...props }) => {
  return <p {...props}>{children}</p>;
};

export const CorrectTypography = ({ children }) => {
  return <Typography style={CorrectTypographyStyling}>{children}</Typography>;
};

export const IncorrectTypography = ({ children }) => {
  return <Typography style={IncorrectTypographyStyling}>{children}</Typography>;
};

export default Typography;
