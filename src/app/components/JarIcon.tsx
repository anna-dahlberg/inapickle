import svgPaths from "../../imports/DesignDarkMode/svg-qpli25aqwk";

interface JarIconProps {
  color?: string;
  size?: number;
}

export function JarIcon({ color = "#F1F6EC", size = 40 }: JarIconProps) {
  const h = size * 1.2;
  return (
    <div style={{ width: size, height: h }} className="relative overflow-clip shrink-0 flex-shrink-0">
      {/* lid */}
      <div
        className="absolute"
        style={{
          top: `${6.58 / 100 * h}px`,
          left: `${20.31 / 100 * size}px`,
          right: `${20.31 / 100 * size}px`,
          bottom: `${81.58 / 100 * h}px`,
        }}
      >
        <svg
          fill="none"
          viewBox="0 0 25.55 7.48421"
          className="block w-full h-full"
          preserveAspectRatio="none"
        >
          <path d={svgPaths.p295e6900} stroke={color} strokeWidth="1.8" />
        </svg>
      </div>
      {/* body */}
      <div
        className="absolute"
        style={{
          top: `${18.42 / 100 * h}px`,
          left: `${17.19 / 100 * size}px`,
          right: `${17.19 / 100 * size}px`,
          bottom: `${10.53 / 100 * h}px`,
        }}
      >
        <svg
          fill="none"
          viewBox="0 0 28.05 35.9053"
          className="block w-full h-full"
          preserveAspectRatio="none"
        >
          <path d={svgPaths.p6dd8980} stroke={color} strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      </div>
      {/* decorative line 1 */}
      <div
        className="absolute"
        style={{
          top: `${28.29 / 100 * h}px`,
          left: `${17.19 / 100 * size}px`,
          right: `${17.19 / 100 * size}px`,
          height: "1.2px",
        }}
      >
        <svg fill="none" viewBox="0 0 26.25 1.2" className="block w-full h-full" preserveAspectRatio="none">
          <path d="M0 0.6H26.25" opacity="0.35" stroke={color} strokeWidth="1.2" />
        </svg>
      </div>
      {/* decorative line 2 */}
      <div
        className="absolute"
        style={{
          top: `${34.87 / 100 * h}px`,
          left: `${17.19 / 100 * size}px`,
          right: `${17.19 / 100 * size}px`,
          height: "0.8px",
        }}
      >
        <svg fill="none" viewBox="0 0 26.25 0.8" className="block w-full h-full" preserveAspectRatio="none">
          <path d="M0 0.4H26.25" opacity="0.18" stroke={color} strokeWidth="0.8" />
        </svg>
      </div>
      {/* decorative line 3 */}
      <div
        className="absolute"
        style={{
          top: `${73.68 / 100 * h}px`,
          left: `${20.31 / 100 * size}px`,
          right: `${20.31 / 100 * size}px`,
          height: "1px",
        }}
      >
        <svg fill="none" viewBox="0 0 23.75 1" className="block w-full h-full" preserveAspectRatio="none">
          <path d="M0 0.5H23.75" opacity="0.25" stroke={color} />
        </svg>
      </div>
    </div>
  );
}
