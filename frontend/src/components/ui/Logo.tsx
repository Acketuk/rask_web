import { Agu_Display } from "next/font/google";

const aguDisplay = Agu_Display({
  subsets: ["latin"],
  weight: "400",
});

export default function Logo() {
  return (
    <span className={`${aguDisplay.className} text-5xl leading-none tracking-tight`}>
      Rask
    </span>
  );
}
