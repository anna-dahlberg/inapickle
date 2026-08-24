export const colors = {
  bg: "#096343",
  bgDeep: "#063d28",
  bgOverlay: "rgba(6, 61, 40, 0.95)",

  text: "#F1F6EC",
  textSoft: "rgba(241, 246, 236, 0.8)",
  textDim: "rgba(241, 246, 236, 0.2)",
  textGhost: "rgba(241, 246, 236, 0.1)",

  pink: "#FF98DE",
  pinkTint: "rgba(255, 152, 222, 0.15)",
  pinkWash: "rgba(255, 157, 224, 0.1)",

  lime: "#ADDF26",
  limeTint: "rgba(173, 223, 38, 0.15)",

  danger: "#ff6b6b",
  dangerTint: "rgba(255, 107, 107, 0.15)",

  oracleText: "#2b1260",
} as const;

export const font = {
  family: "'Plus Jakarta Sans', sans-serif",
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
} as const;
