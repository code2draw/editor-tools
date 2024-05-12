<script setup lang="ts">
/**
 * Goal of this component is to track mouse click actions and emit vector of positions
 * where MouseDown and MouseUp events were triggered
 */
import { defineEmits, onMounted, onBeforeUnmount, getCurrentInstance, watch } from 'vue';
import type { MouseTrackerEvent, TupplePoint } from '@/types';

const props = defineProps({
    // Should the movement be tracked?
    movement: { type: Boolean, default: false },
    // Should the drag be tracked?
    click: { type: Boolean, default: false },
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
    let unregisterCb = () => {};
    const parentEl = getParentElement();

    function emitEvent(button: number, buttons: number) {
        const data: MouseTrackerEvent = {
            position: currentPosition,
            clickPosition,
            button,
            buttons,
            clickButton,
            clickButtons,
        };
        emit('change', data);
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
        if (props.click) {
            currentPosition = [e.x, e.y];
            emitEvent(e.button, e.buttons);
        }
        clickPosition = undefined;
        clickButton = undefined;
        clickButtons = undefined;
    }

    watch([() => props.click, () => props.movement], () => {
        unregisterCb();
        clickPosition = undefined;
        clickButton = undefined;
        clickButtons = undefined;

        unregisterCb = registerListeners(
            parentEl,
            onMouseMove,
            props.click ? onMouseDown : undefined,
            props.click ? onMouseUp : undefined,
        );
    }, { immediate: true });

    onBeforeUnmount(() => unregisterCb());
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
    mouseMoveCb: (ev: MouseEvent) => void,
    mouseDownCb?: (ev: MouseEvent) => void,
    mouseUpCb?: (ev: MouseEvent) => void,
) {
    target.addEventListener('mousemove', mouseMoveCb, { passive: true });
    mouseDownCb && target.addEventListener('mousedown', mouseDownCb, { passive: true });
    mouseUpCb && target.addEventListener('mouseup', mouseUpCb, { passive: true });

    return () => {
        target.removeEventListener('mousemove', mouseMoveCb);
        mouseDownCb && target.removeEventListener('mousedown', mouseDownCb);
        mouseUpCb && target.removeEventListener('mouseup', mouseUpCb);
    };
}
</script>
<template>
    <span class="mouse-tracker"></span>
</template>