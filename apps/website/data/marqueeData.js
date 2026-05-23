import { Circle } from "lucide-react";

// Color matches severity:
//   #ef4444 = High, #f59e0b = Medium, #10b981 = Low
export const marqueeData = [
  { name: "Broken signup form", icon: <Circle size={10} fill="#ef4444" color="#ef4444" /> },
  { name: "Mobile layout overflow", icon: <Circle size={10} fill="#f59e0b" color="#f59e0b" /> },
  { name: "Typo on pricing page", icon: <Circle size={10} fill="#10b981" color="#10b981" /> },
  { name: "Image not loading", icon: <Circle size={10} fill="#ef4444" color="#ef4444" /> },
  { name: "Confusing CTA copy", icon: <Circle size={10} fill="#f59e0b" color="#f59e0b" /> },
  { name: "Tooltip cut off", icon: <Circle size={10} fill="#10b981" color="#10b981" /> },
  { name: "404 on footer link", icon: <Circle size={10} fill="#ef4444" color="#ef4444" /> },
  { name: "Slow page load", icon: <Circle size={10} fill="#f59e0b" color="#f59e0b" /> },
];