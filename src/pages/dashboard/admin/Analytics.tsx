import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Analytics() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Platform Analytics which has real data
    navigate("/dashboard/admin/platform-analytics", { replace: true });
  }, [navigate]);

  return null;
}
