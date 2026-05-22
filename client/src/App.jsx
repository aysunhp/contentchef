import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { PostProvider } from './context/PostContext';
import Sidebar from './components/Sidebar';
import CalendarBoard from './components/Calendar';
import ContentKitchen from './components/Kitchen';

export default function App() {
  const [newPostDate, setNewPostDate] = useState(null);

  const handleCreate = (type) => {
    if (type === 'post' || type === 'instagram' || type === 'tiktok') {
      setNewPostDate(new Date().toISOString().split('T')[0]);
    }
  };

  return (
    <ThemeProvider>
      <PostProvider>
        <div className="flex h-screen overflow-hidden bg-cream transition-colors duration-300 dark:bg-obsidian">
          <Sidebar onCreate={handleCreate} />
          <main className="flex flex-1 overflow-hidden">
            <CalendarBoard newPostDate={newPostDate} setNewPostDate={setNewPostDate} />
            <ContentKitchen />
          </main>
        </div>
      </PostProvider>
    </ThemeProvider>
  );
}
