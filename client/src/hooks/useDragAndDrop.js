import { useCallback } from 'react';

/**
 * Handles reorder logic for @hello-pangea/dnd onDragEnd.
 * Returns a handler that updates posts array when a card is moved between dates.
 */
export function useDragAndDrop(posts, onReorder) {
  const handleDragEnd = useCallback(
    (result) => {
      const { source, destination, draggableId } = result;

      if (!destination) return;
      if (source.droppableId === destination.droppableId && source.index === destination.index) {
        return;
      }

      const post = posts.find((p) => p.id === draggableId);
      if (!post) return;

      const newDate = destination.droppableId; // droppableId = date string
      const updatedPost = { ...post, date: newDate };

      onReorder(updatedPost);
    },
    [posts, onReorder],
  );

  return { handleDragEnd };
}
