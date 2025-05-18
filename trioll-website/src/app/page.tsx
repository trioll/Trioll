import { Metadata } from "next";
import HomePage from "@/components/HomePage";

export const metadata: Metadata = {
  title: "TRIOLL - Level Up Your Game Discovery",
  description: "Try. Play. Buy. Level Up Your Game Discovery.",
};

export default function Home() {
  return <HomePage />;
}
