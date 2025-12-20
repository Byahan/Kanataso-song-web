import Image from "next/image";
import { JSX, useState } from "react";
import MenuDrawer from "./menubar";

export default function Navbar(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);


      return (
        <>
          <header className="navbar">
            <div className="left">
              <button
                className="hamburger"
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
              >
                <span />
                <span />
                <span />
              </button>

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

        .hamburger {
          width: 36px;
          height: 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        .hamburger span {
          display: block;
          height: 4px;
          width: 100%;
          background: white;
          border-radius: 2px;
          transition: opacity 0.2s ease;
        }

        .hamburger:hover span {
          opacity: 0.8;
        }

          .title {
            font-size: 18px;
            font-weight: 600;
          }
        `}</style>
    </>
  );
}
