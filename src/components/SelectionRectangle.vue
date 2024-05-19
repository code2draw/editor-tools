<script setup lang="ts">
/**
 * Goal of this component is to draw a rectangle over the area where
 * the user drags the mouse. The rectangle represents the selection area.
 */
import { defineEmits, onMounted, onBeforeUnmount, watch, ref } from 'vue';
import { getTargetElement } from '../util/helper';
import type { MouseTrackerEvent, TupplePoint } from '@/types';

const MOUSE_LEFT_BUTTON = 0;
const props = defineProps({
    // Where should the mouse be tracked
    // - "body" - within body
    // - [HtmlElement] Element
    // - [undefined] - within parent
    target: { type: [HTMLElement, String], default: undefined },
});

const rectEl = ref<HTMLDivElement>();
const emit = defineEmits<{
    (e: 'change', value: MouseTrackerEvent): void,
}>();

const active = ref<boolean>(true);
const offset = ref<TupplePoint>([0, 0]);
const targetEl = ref<HTMLElement>(document.body);

function setSize(start: TupplePoint, end: TupplePoint) {
    rectEl.value!.style.left = `${Math.min(start[0], end[0]) - offset.value[0]}px`;
    rectEl.value!.style.top = `${Math.min(start[1], end[1]) - offset.value[1]}px`;
    rectEl.value!.style.width = `${Math.abs(end[0] - start[0])}px`;
    rectEl.value!.style.height = `${Math.abs(end[1] - start[1])}px`;
}

onMounted(() => {
    let startPosition: TupplePoint = [0, 0];
    let unregisterCb = () => {};

    rectEl.value!.classList.add('hidden');

    function onMouseMove(e: MouseEvent) {
        if(!active.value) return;
        setSize(startPosition, [e.clientX, e.clientY]);
    }

    function onMouseDown(e: MouseEvent) {
        if (e.button !== MOUSE_LEFT_BUTTON) return;

        active.value = true;
        const bounding = targetEl.value.getBoundingClientRect();
        offset.value = [bounding.left, bounding.top];

        startPosition = [e.x, e.y];
        setSize(startPosition, startPosition);
        rectEl.value!.classList.remove('hidden');
    }

    function onMouseUp(e: MouseEvent) {
        active.value = false;
        emit('change', {
            button: 0,
            buttons: 0,
            position: [e.x, e.y],
            clickPosition: startPosition,
        });
    }

    watch(() => props.target, () => targetEl.value = getTargetElement(props.target), { immediate: true });

    watch([() => targetEl], () => {
        unregisterCb();
        targetEl.value.addEventListener('mousedown', onMouseDown, { passive: true });
        targetEl.value.addEventListener('mouseup', onMouseUp, { passive: true });
        targetEl.value.addEventListener('mousemove', onMouseMove, { passive: true });

        unregisterCb = () => {
            targetEl.value.removeEventListener('mousedown', onMouseDown);
            targetEl.value.removeEventListener('mouseup', onMouseUp);
            targetEl.value.removeEventListener('mousemove', onMouseMove);
        }
    }, { immediate: true });

    onBeforeUnmount(() => unregisterCb());
});
</script>

<template>
    <span ref="rectEl" class="selection-rectangle hidden"></span>
</template>

<style>
.selection-rectangle {
    position: absolute;
    border: 1px dashed rgba(255, 255, 0, 0.7);
}
.selection-rectangle.hidden { display: none; }
</style>