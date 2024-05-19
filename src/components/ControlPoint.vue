<script setup lang="ts">
/**
 * Goal of this component is to display single point that can be dragged
 *
 * Issues: It would be nice to cancel drag operation by ESC key, but
 * looks like browsers does not support it and instead consider ESC
 * key to be valid way of stopping drag operation.
 * When drag is in progress, it is not possible to track keyboard keys
 * pressed or released and also mouse release.
 */
import { onMounted, defineEmits, computed, ref, watch } from 'vue';
import type { PropType } from 'vue';
import type { ControlPointDragEvent, TupplePoint } from '@/types';

const props = defineProps({
    position: { type: Array as unknown as PropType<[number, number]>, required: true },
    color: { type: String, default: 'rgba(200, 200, 0, 0.5)' },
});
const emit = defineEmits<{
    (e: 'drag', value: ControlPointDragEvent): void,
}>();
const start = ref<TupplePoint>(props.position);
const point = ref<HTMLDivElement>(null as any);

// Absolute position of ControlPoint at the time when drag was started
let absoluteStartPosition = [0,0];
// Position of Mouse cursor within control point when drag was started
let cursorAnchor = [0, 0];

onMounted(() => {
    watch([() => props.position], () => {
        start.value = props.position;
        const bounding = point.value.getBoundingClientRect();
        absoluteStartPosition = [bounding.left, bounding.top];
    }, { immediate: true });
});

function dragStart(e: DragEvent) {
    if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.effectAllowed = 'move';
    }
    cursorAnchor = [e.x - absoluteStartPosition[0], e.y - absoluteStartPosition[1]];
}

function dragEnd(e: DragEvent) {
    const xDiff = absoluteStartPosition[0] - start.value[0] + cursorAnchor[0];
    const yDiff = absoluteStartPosition[1] - start.value[1] + cursorAnchor[1];

    const data: ControlPointDragEvent = {
        start: start.value,
        end: [e.x - xDiff, e.y - yDiff],
    };

    emit('drag', data);
}

// Make sure the the event handler is added only once even if
// there are multiple instances of component
if (typeof (window as any)._controlPoint_preventNotAllowed === 'undefined') {
    (window as any)._controlPoint_preventNotAllowed = true;

    // These prevents "not allowed" cursor
    document.addEventListener("dragover", (event) => {
        event.preventDefault();
    }, { capture: true });
}

const style = computed(() => {
    return {
        left: `${props.position[0]}px`,
        top: `${props.position[1]}px`,
        'border-color': props.color,
    }
});
</script>
<template>
    <div ref="point" class="control-point" draggable="true" :ondragstart="dragStart" :ondragend="dragEnd" :style="style"></div>
</template>

<style>
.control-point {
    height: 10px;
    width: 10px;
    border: 1px solid rgba(200, 200, 0, 0.5);
    border-radius: 100%;
    cursor: grab;
    position: absolute;

    &:active { cursor: grabbing; }
}
</style>