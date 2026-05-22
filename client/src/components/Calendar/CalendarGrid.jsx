import { useState, useCallback } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { usePosts } from "../../context/PostContext";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { postService } from "../../services/api";
import CalendarCell from "./CalendarCell";
import ContextMenu from "../common/ContextMenu";

const formatDate = (date) => date.toLocaleDateString("en-CA");

export default function CalendarGrid({
  days,
  posts,
  onSelectPost,
  onNewPost,
  isLoading,
}) {
  const { updatePost, deletePost, selectPost } = usePosts();
  const [ctxMenu, setCtxMenu] = useState(null);
  const [actionError, setActionError] = useState(null);

  const handleReorder = async (updatedPost) => {
    const previous = posts.find((p) => p.id === updatedPost.id);
    if (!previous) return;

    setActionError(null);
    updatePost(updatedPost);
    try {
      const res = await postService.update(updatedPost.id, { date: updatedPost.date });
      if (res?.data) updatePost(res.data);
    } catch (err) {
      updatePost(previous);
      setActionError(err.message || "Failed to move post");
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

  const handleContextMenuSelect = useCallback(
    async (post) => {
      setActionError(null);
      if (post._changeStatus) {
        try {
          const updated = await postService.update(post.id, {
            status: post._changeStatus,
          });
          if (updated?.data) updatePost(updated.data);
        } catch (err) {
          setActionError(err.message || "Failed to update status");
        }
      } else {
        selectPost(post);
      }
    },
    [updatePost, selectPost],
  );

  const handleContextMenuDelete = useCallback(
    async (id) => {
      if (!confirm("Delete this post?")) return;
      setActionError(null);
      try {
        await postService.delete(id);
        deletePost(id);
      } catch (err) {
        setActionError(err.message || "Failed to delete post");
      }
    },
    [deletePost],
  );

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-12 text-sm text-text-secondary-light dark:text-text-secondary-dark">
        Loading calendar…
      </div>
    );
  }

  return (
    <>
      {actionError && (
        <p className="mx-6 mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-300">
          {actionError}
        </p>
      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="scrollbar-hidden flex-1 overflow-y-auto px-6 py-2">
          <div className="grid grid-cols-7 gap-1">
            {days.map(({ date, isCurrentMonth }) => (
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
                    onNewPost={onNewPost}
                    onContextMenu={setCtxMenu}
                    placeholder={provided.placeholder}
                  />
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </DragDropContext>

      {ctxMenu && (
        <ContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          post={ctxMenu.post}
          onClose={() => setCtxMenu(null)}
          onSelect={handleContextMenuSelect}
          onDelete={handleContextMenuDelete}
        />
      )}
    </>
  );
}
