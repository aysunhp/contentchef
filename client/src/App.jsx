import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { PostProvider, usePosts } from "./context/PostContext";
import { MediaProvider } from "./context/MediaContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import CalendarBoard from "./components/Calendar";
import ContentKitchen from "./components/Kitchen";
import MediaPanel from "./components/Media";
import MessagesPanel from "./components/Messages";
import AnalyticsPanel from "./components/Analytics";
import SettingsPanel from "./components/Settings";
import NewNoteModal from "./components/common/NewNoteModal";
import LoginModal from "./components/common/LoginModal";
import RegisterModal from "./components/common/RegisterModal";

function AppContent() {
  const [newPostDate, setNewPostDate] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [platformType, setPlatformType] = useState(null);
  const [activeView, setActiveView] = useState("calendar");
  const [notes, setNotes] = useState([]);
  const [authModal, setAuthModal] = useState('login'); // 'login' or 'register'
  const { selectPost } = usePosts();
  const { isAuthenticated, user, logout } = useAuth();

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

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-cream via-purple-50 to-pink-50 transition-colors duration-300 dark:from-obsidian dark:via-purple-950/20 dark:to-pink-950/20">
        {authModal === 'register' ? (
          <RegisterModal
            onClose={() => setAuthModal('login')}
            onSwitchToLogin={() => setAuthModal('login')}
          />
        ) : (
          <LoginModal
            onClose={() => setAuthModal('login')}
            onSwitchToRegister={() => setAuthModal('register')}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cream transition-colors duration-300 dark:bg-obsidian">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        onCreate={handleCreate}
        notesCount={notes.length}
        user={user}
        onLogout={logout}
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
            <ContentKitchen platformType={platformType} />
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
      <AuthProvider>
        <PostProvider>
          <MediaProvider>
            <AppContent />
          </MediaProvider>
        </PostProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
