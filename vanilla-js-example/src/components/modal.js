import { $, show, hide, addEventListener } from '../utils/dom.js';

export function createModal(modalId) {
  const modal = $(modalId);
  let isModalOpen = false;

  // モーダル外クリックで閉じる
  addEventListener(modal, 'click', e => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // 閉じるボタン
  const closeBtn = modal.querySelector('.close-btn');
  if (closeBtn) {
    addEventListener(closeBtn, 'click', () => {
      closeModal();
    });
  }

  // ESCキーで閉じる
  addEventListener(document, 'keydown', e => {
    if (e.key === 'Escape' && isModalOpen) {
      closeModal();
    }
  });

  function openModal() {
    show(modal);
    isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    hide(modal);
    isModalOpen = false;
    document.body.style.overflow = '';
  }

  return {
    open: openModal,
    close: closeModal,
    isOpen: () => isModalOpen,
  };
}
