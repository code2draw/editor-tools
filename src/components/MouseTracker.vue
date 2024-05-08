<script setup lang="ts">
/**
 * Goal of this component is to track mouse click actions and emit vector of positions
 * where MouseDown and MouseUp events were triggered
 */
import { defineEmits, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue';
import type { MouseTrackerEvent, TupplePoint } from '@/types';

const props = defineProps({
    // Should the movement be tracked?
    movement: { type: Boolean, default: false },
    // Should the drag be tracked?
    drag: { type: Boolean, default: false },
    // Where should the mouse be tracked
    // - "body" - within body
    // - [HtmlElement] TupplePointement
    // - [undefined] - within parent
    target: { type: [Object, String], default: undefined },
});

const emit = defineEmits<{
    (e: 'change', value: MouseTrackerEvent): void,
}>();

onMounted(() => {
    let currentPosition: TupplePoint = [0, 0];
    let clickPosition: TupplePoint | undefined = undefined;
    let clickButtons: number | undefined = undefined;
    let clickButton: number | undefined = undefined;
    const parentEl = getParentElement();

    function emitEvent(button: number, buttons: number) {
        emit('change', {
            position: currentPosition,
            clickPosition,
            button,
            buttons,
            clickButton,
            clickButtons,
        });
    }

    function onMouseMove(e: MouseEvent) {
        currentPosition = [e.x, e.y];

        if (props.movement) {
            emitEvent(e.button, e.buttons);
        }
    }

    function onMouseDown(e: MouseEvent) {
        clickPosition = [e.x, e.y];
        clickButton = e.button;
        clickButtons = e.buttons;
    }

    function onMouseUp(e: MouseEvent) {
        if (props.drag) {
            emitEvent(e.button, e.buttons);
        }
        clickPosition = undefined;
        clickButton = undefined;
        clickButtons = undefined;
    }

    registerListeners(parentEl, onMouseDown, onMouseUp, onMouseMove);
});


function getParentElement(): HTMLElement {
    if (props.target instanceof HTMLElement) {
        return props.target;
    }
    if (props.target === 'body') {
        return document.body;
    }

    const instance = getCurrentInstance()!;
    const el = instance.vnode.el as HTMLElement;
    const parentEl = el.parentElement;

    if (!parentEl) {
        throw new Error('[MouseVector] cannot get parent element');
    }

    return parentEl;
}

function registerListeners(
    target: HTMLElement,
    mouseDownCb: (ev: MouseEvent) => void,
    mouseUpCb: (ev: MouseEvent) => void,
    mouseMoveCb: (ev: MouseEvent) => void,
) {
    target.addEventListener('mousedown', mouseDownCb, { passive: true });
    target.addEventListener('mouseup', mouseUpCb, { passive: true });
    target.addEventListener('mousemove', mouseMoveCb, { passive: true });

    console.log('Registering listeners', target);

    onBeforeUnmount(() => {
        target.removeEventListener('mousedown', mouseDownCb);
        target.removeEventListener('mouseup', mouseUpCb);
        target.removeEventListener('mousemove', mouseMoveCb);
    })
}
</script>
<template>
    <span>
        <!-- Mouse Vector -->
    </span>
</template>