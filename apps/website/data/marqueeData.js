import { Bug, Rocket, CheckCircle, AlertTriangle, Clipboard } from "lucide-react";

export const marqueeData = [
  { name: "Bug Found", icon: <Bug size={12} color="#ef4444" /> },
  { name: "Critical Issue", icon: <AlertTriangle size={12} color="#f59e0b" /> },
  { name: "UX Feedback", icon: <Clipboard size={12} color="#10b981" /> },
  { name: "Test Completed", icon: <CheckCircle size={12} color="#3b82f6" /> },
  { name: "Feature Verified", icon: <Rocket size={12} color="#3e2cf6" /> },
];