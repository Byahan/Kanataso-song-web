import Image from "next/image";
import { JSX, useState } from "react";
import MenuDrawer from "./menubar";

export default function Navbar(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="navbar">
        <div className="left">
          <div
            className="logoWrapper"
            onClick={() => setMenuOpen(true)}
          >
            <Image
              src="/logo2.svg"
              alt="PPTenshi Logo"
              width={62}
              height={62}
              className="logo"
            />
          </div>

          <span className="title">PPTenshi Song Archive</span>
        </div>

      </header>

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

        <style jsx global>{`
          @keyframes spin {
            from {
              transform: rotate(45deg);
            }
            to {
              transform: rotate(405deg);
            }
          }

          .navbar {
            height: 60px;
            background: #4da3ff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            color: white;
            z-index: 30;
            position: relative;
          }

          .left {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .logo {
            transform: rotate(45deg);
            transform-origin: center;
            will-change: transform;
          }

          .logoWrapper:hover .logo {
            animation: spin 1.2s linear infinite;
          }

          .title {
            font-size: 18px;
            font-weight: 600;
          }
        `}</style>
    </>
  );
}
