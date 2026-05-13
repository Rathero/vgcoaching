// dragColumns.js — Drag & drop column reordering
import Store from './store.js';

let dragSrcIndex = null;

export function initDragColumns(onReorder) {
  const ths = document.querySelectorAll('#leads-table thead th.draggable');
  ths.forEach((th, index) => {
    th.setAttribute('draggable', 'true');

    th.addEventListener('dragstart', (e) => {
      dragSrcIndex = index;
      th.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index);
    });

    th.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      th.classList.add('drag-over');
    });

    th.addEventListener('dragleave', () => {
      th.classList.remove('drag-over');
    });

    th.addEventListener('drop', (e) => {
      e.preventDefault();
      th.classList.remove('drag-over');
      const fromIdx = dragSrcIndex;
      const toIdx = index;
      if (fromIdx === null || fromIdx === toIdx) return;

      const order = Store.getColumnOrder();
      const moved = order.splice(fromIdx, 1)[0];
      order.splice(toIdx, 0, moved);
      Store.setColumnOrder(order);

      if (onReorder) onReorder();
    });

    th.addEventListener('dragend', () => {
      th.classList.remove('dragging');
      document.querySelectorAll('#leads-table thead th').forEach(t => t.classList.remove('drag-over'));
      dragSrcIndex = null;
    });
  });
}
