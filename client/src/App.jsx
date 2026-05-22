import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { PostProvider, usePosts } from "./context/PostContext";
import { MediaProvider } from "./context/MediaContext";
import Sidebar from "./components/Sidebar";
import CalendarBoard from "./components/Calendar";
import ContentKitchen from "./components/Kitchen";
import MediaPanel from "./components/Media";
import MessagesPanel from "./components/Messages";
import AnalyticsPanel from "./components/Analytics";
import SettingsPanel from "./components/Settings";
import NewNoteModal from "./components/common/NewNoteModal";

function AppContent() {
  const [newPostDate, setNewPostDate] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [platformType, setPlatformType] = useState(null);
  const [activeView, setActiveView] = useState("calendar");
  const [notes, setNotes] = useState([]);
  const { selectPost } = usePosts();

  const handleCreate = (type) => {
    if (type === "post") {
      setActiveView("calendar");
      setNewPostDate(new Date().toISOString().split("T")[0]);
      setPlatformType(null);
    } else if (type === "instagram" || type === "tiktok") {
      // Platform-specific post with context
      setActiveView("calendar");
      setNewPostDate(new Date().toISOString().split("T")[0]);
      setPlatformType(type);
    } else if (type === "note") {
      setShowNoteModal(true);
    }
  };

  const handleAddNote = (note) => {
    setNotes((prev) => [note, ...prev]);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-cream transition-colors duration-300 dark:bg-obsidian">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        onCreate={handleCreate}
        notesCount={notes.length}
      />
      <main className="flex flex-1 overflow-hidden">
        {activeView === "media" ? (
          <MediaPanel
            onOpenPost={(post) => {
              selectPost(post);
              setActiveView("calendar");
            }}
          />
        ) : activeView === "messages" ? (
          <MessagesPanel />
        ) : activeView === "analytics" ? (
          <AnalyticsPanel />
        ) : activeView === "settings" ? (
          <SettingsPanel />
        ) : (
          <>
            <CalendarBoard
              newPostDate={newPostDate}
              setNewPostDate={setNewPostDate}
              platformType={platformType}
              setPlatformType={setPlatformType}
            />
            <ContentKitchen />
          </>
        )}
      </main>

      {showNoteModal && (
        <NewNoteModal
          onClose={() => setShowNoteModal(false)}
          onAdd={handleAddNote}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PostProvider>
        <MediaProvider>
          <AppContent />
        </MediaProvider>
      </PostProvider>
    </ThemeProvider>
  );
}
