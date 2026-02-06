import { JSX, useEffect, useState } from "react";

interface MenubarProps {
  open: boolean;
  onClose: () => void;
}

export default function Menubar({ open, onClose }: MenubarProps): JSX.Element {
  const [showAbout, setShowAbout] = useState(false);

  // Close on ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowAbout(false);
        onClose();
      }
    };
    if (open || showAbout) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, showAbout, onClose]);

  const closeAll = () => {
    setShowAbout(false);
    onClose();
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        className={`backdrop ${(open || showAbout) ? "show" : ""}`}
        onClick={closeAll}
        aria-hidden={!(open || showAbout)}
      />

      {/* DRAWER */}
      <aside className={`drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="header">
          <span>Menu</span>
          <button onClick={onClose} aria-label="Close menu">✕</button>
        </div>

        <nav className="menu">
          <button
            className="menuBtn"
            onClick={() => setShowAbout(true)}
            type="button"
          >
            About
          </button>

          <a
            href="https://www.youtube.com/@AmaneKanata"
            target="_blank"
            rel="noopener noreferrer"
            className="menuBtn linkBtn"
          >
            Amane Kanata YouTube Channel
          </a>
        </nav>
      </aside>

      {/* ABOUT MODAL */}
      {showAbout && (
        <div className="modalWrap">
          <div className="modal foldIn">
          <div className="modalHeader">
            <h3>About</h3>
            <button onClick={() => setShowAbout(false)}>✕</button>
          </div>

          <div className="modalText">
            <p>This is an unofficial, fan-made site.</p>
            <p>
              All videos are produced by Amane Kanata and Hololive, and all rights belong to their respective creators.
            </p>
            <p>This website works as long as Kanata does not archive her streams or MVs.</p>
             <div className="divider" />
            <p className="small">Last Update: 02/06/2026 12:01 PM JST</p>
            <p className="small">
              Credits: Byahan / rayhan_f (discord), feel free to contact me if you have any
              further questions/suggestions regarding this website.
            </p>
            <p className="big">
              I'm sorry. I'm taking an indefinite break since last December, expect a slow update to this website.
            </p>
          </div>

          <button
            type="button"
            className="closeButton"
            onClick={() => setShowAbout(false)}
          >
            Close
          </button>
          </div>
        </div>
      )}

      <style jsx>{`
        /* BACKDROP */
        .backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          opacity: 0;
          pointer-events: none;
          transition: opacity 200ms ease-out;
          z-index: 1000;
        }
        .backdrop.show {
          opacity: 1;
          pointer-events: auto;
        }

        /* DRAWER */
        .drawer {
          position: fixed;
          top: 0;
          left: 0;
          width: 320px;
          height: 100vh;
          background: linear-gradient(360deg, #D7D7D7 0%, #7EBAFF 100%);
          transform: translateX(-105%);
          transition: transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1);
          z-index: 1001;
          display: flex;
          flex-direction: column;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
        }
        .drawer.open {
          transform: translateX(0);
        }

        .header {
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
        }
        .header button {
          border: none;
          background: none;
          font-size: 20px;
          cursor: pointer;
        }

        .menu {
          padding: 0 16px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .menu a {
          cursor: pointer;
          padding: 10px 12px;
          border-radius: 10px;
        }
        .menu a.active {
          background: #FFD966;
          color: #fff;
          font-weight: 600;
        }

        .menuBtn:hover {
          filter: brightness(0.9);
        }

        .menuBtn {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: none;
          background: #ffd966;
          color: #000;
          font-weight: 600;
          font-size: 14px;
          text-align: left;
          cursor: pointer;
          transition: background 160ms ease, filter 160ms ease;
        }

        /* MODAL */
        .modal {
          width: 90%;
          max-width: 650px;
          background: #fff;
          border-radius: 14px;
          padding: 20px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);

          transform-origin: top center;
          animation: foldOpen 360ms cubic-bezier(0.25, 0.8, 0.25, 1);
          pointer-events: auto;
        }

        .modalWrap {
          position: fixed;
          inset: 0;
          z-index: 1002;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        @keyframes foldOpen {
          0% {
            opacity: 0;
            transform: rotateX(-90deg) scale(0.96);
          }
          60% {
            opacity: 1;
            transform: rotateX(12deg) scale(1.02);
          }
          100% {
            transform: rotateX(0deg) scale(1);
          }
        }

        .modalText .small {
          font-size: 12px;
          color: #64748b;
        }

        .modalText .divider {
          height: 8px;
        }

        .modalHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .modalHeader h3 {
          margin: 0;
          font-size: 18px;
        }

        .modalHeader button {
          border: none;
          background: none;
          font-size: 18px;
          cursor: pointer;
        }

        .modalText {
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .closeButton {
          display: block;
          text-align: center;
          padding: 10px 14px;
          border-radius: 10px;
          background: #ff3b3b;
          color: #fff;
          font-weight: 600;
          text-decoration: none;
        }
        .closeButton:hover {
          background: #e63232;
        }

        .linkBtn {
          text-decoration: none;
          display: block;
        }
      `}</style>
    </>
  );
}
