import { onMounted, onBeforeUnmount, ref } from 'vue';

const lastKeyAction = ref<string>();
const lastDirection = ref<'up'|'down'>();

function keyboardTrackerHandleKeyDown(event: KeyboardEvent) {
  lastKeyAction.value = event.key;
  lastDirection.value = 'down';
}

function keyboardTrackerHandleKeyUp(event: KeyboardEvent) {
  lastKeyAction.value = event.key;
  lastDirection.value = 'up';
}

function attachListeners() {
  window.addEventListener('keydown', keyboardTrackerHandleKeyDown, { passive: true, capture: true });
  window.addEventListener('keyup', keyboardTrackerHandleKeyUp, { passive: true });
}

function releaseListeners() {
  window.removeEventListener('keydown', keyboardTrackerHandleKeyDown, { capture: true });
  window.removeEventListener('keyup', keyboardTrackerHandleKeyUp);
}

export function useKeyboardTracker() {
  onMounted(attachListeners);
  onBeforeUnmount(releaseListeners);

  return {
    lastKeyAction,
    lastDirection,
  };
}