import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { usePosts } from '../../context/PostContext';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { postService } from '../../services/api';
import CalendarCell from './CalendarCell';

const formatDate = (date) => date.toISOString().split('T')[0];

export default function CalendarGrid({ days, posts, onSelectPost, isLoading }) {
  const { updatePost } = usePosts();

  const handleReorder = async (updatedPost) => {
    updatePost(updatedPost);
    try {
      await postService.update(updatedPost.id, { date: updatedPost.date });
    } catch {
      // Revert handled by next fetch cycle
    }
  };

  const { handleDragEnd } = useDragAndDrop(posts, handleReorder);

  const getPostsForDate = (date) => {
    const dateStr = formatDate(date);
    return posts.filter((p) => p.date === dateStr);
  };

  const isToday = (date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="scrollbar-hidden flex-1 overflow-y-auto px-6 py-2">
        <div className="grid grid-cols-7 gap-1">
          {days.map(({ date, isCurrentMonth }, idx) => (
            <Droppable key={formatDate(date)} droppableId={formatDate(date)}>
              {(provided, snapshot) => (
                <CalendarCell
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  date={date}
                  isCurrentMonth={isCurrentMonth}
                  isToday={isToday(date)}
                  isDragOver={snapshot.isDraggingOver}
                  posts={getPostsForDate(date)}
                  onSelectPost={onSelectPost}
                  placeholder={provided.placeholder}
                />
              )}
            </Droppable>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}
