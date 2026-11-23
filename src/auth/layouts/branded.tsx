
import { Outlet } from "react-router-dom";

export function BrandedLayout() {
  return (
    <div className="min-h-screen w-full">
      <Outlet />
    </div>
  );
}
