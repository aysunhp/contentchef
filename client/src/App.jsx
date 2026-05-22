import { ThemeProvider } from './context/ThemeContext';
import { PostProvider } from './context/PostContext';
import Sidebar from './components/Sidebar';
import CalendarBoard from './components/Calendar';
import ContentKitchen from './components/Kitchen';

export default function App() {
  return (
    <ThemeProvider>
      <PostProvider>
        <div className="flex h-screen overflow-hidden bg-[#F9F9F9] transition-colors duration-300 dark:bg-obsidian">
          <Sidebar />
          <main className="flex flex-1 overflow-hidden">
            <CalendarBoard />
            <ContentKitchen />
          </main>
        </div>
      </PostProvider>
    </ThemeProvider>
  );
}
