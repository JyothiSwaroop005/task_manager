import { useMemo } from 'react';
import { useDebounce } from './useDebounce';

// Applies search, filter, and sort logic to a task list
export const useTaskFilters = (tasks, { search, filter, sort }) => {
  const debouncedSearch = useDebounce(search, 300);

  return useMemo(() => {
    let result = [...tasks];

    // Search by title or description
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description || '').toLowerCase().includes(q)
      );
    }

    // Filter
    if (filter === 'Pending') result = result.filter((t) => t.status === 'Pending');
    else if (filter === 'Completed') result = result.filter((t) => t.status === 'Completed');
    else if (filter === 'High') result = result.filter((t) => t.priority === 'High');
    else if (filter === 'Medium') result = result.filter((t) => t.priority === 'Medium');
    else if (filter === 'Low') result = result.filter((t) => t.priority === 'Low');
    else if (filter === 'DueDate') result = result.filter((t) => t.due_date);

    // Sort
    const priorityRank = { High: 3, Medium: 2, Low: 1 };
    if (sort === 'Latest') {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sort === 'Oldest') {
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sort === 'Alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'Priority') {
      result.sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority]);
    } else if (sort === 'DueDate') {
      result.sort((a, b) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
      });
    }

    return result;
  }, [tasks, debouncedSearch, filter, sort]);
};
