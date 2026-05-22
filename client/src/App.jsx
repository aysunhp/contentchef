import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { PostProvider, usePosts } from "./context/PostContext";
import { MediaProvider } from "./context/MediaContext";
import Sidebar from "./components/Sidebar";
import CalendarBoard from "./components/Calendar";
import ContentKitchen from "./components/Kitchen";
import MediaPanel from "./components/Media";

function AppContent() {
  const [newPostDate, setNewPostDate] = useState(null);
  const [activeView, setActiveView] = useState("calendar");
  const { selectPost } = usePosts();

  const handleCreate = (type) => {
    if (type === "post" || type === "instagram" || type === "tiktok") {
      setActiveView("calendar");
      setNewPostDate(new Date().toISOString().split("T")[0]);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-cream transition-colors duration-300 dark:bg-obsidian">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        onCreate={handleCreate}
      />
      <main className="flex flex-1 overflow-hidden">
        {activeView === "media" ? (
          <MediaPanel
            onOpenPost={(post) => {
              selectPost(post);
              setActiveView("calendar");
            }}
          />
        ) : (
          <>
            <CalendarBoard
              newPostDate={newPostDate}
              setNewPostDate={setNewPostDate}
            />
            <ContentKitchen />
          </>
        )}
      </main>
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
