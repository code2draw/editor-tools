<script setup lang="ts">
/**
 * Goal of this component is to track mouse click actions and emit vector of positions
 * where MouseDown and MouseUp events were triggered
 */
import { onMounted, defineEmits, computed, ref, watch } from 'vue';
import type { PropType } from 'vue';
import type { ControlPointDragEvent, TupplePoint } from '@/types';

const props = defineProps({
    // Should the movement be tracked?
    position: { type: Array as unknown as PropType<[number, number]>, required: true },
});
const emit = defineEmits<{
    (e: 'drag', value: ControlPointDragEvent): void,
}>();
const start = ref<TupplePoint>(props.position);
const point = ref<HTMLDivElement>(null as any);
let absoluteStartPosition = [0,0];
let cursorAnchor = [0, 0];
const style = computed(() => {
    return {
        left: `${props.position[0]}px`,
        top: `${props.position[1]}px`,
    }
});

onMounted(() => {
    watch([() => props.position], () => {
        start.value = props.position;
        const bounding = point.value.getBoundingClientRect();
        absoluteStartPosition = [bounding.left, bounding.top];
        cursorAnchor = [0, 0];
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
    console.log('end', data);
    emit('drag', data);
}

// Following is required to prevent "not allowed" cursor while dragging
document.addEventListener("dragover", (event) => {
    event.preventDefault();
});
</script>
<template>
    <div ref="point" class="control-point" draggable="true" :ondragstart="dragStart" :ondragend="dragEnd" :style="style"></div>
</template>

<style>
body.drag--active {
    cursor: grabbing !important;
}

.control-point {
    height: 30px;
    width: 30px;
    border: 1px solid rgba(200, 200, 0, 0.5);
    border-radius: 100%;
    cursor: grab;
    position: absolute;

    &:active { cursor: grabbing; }
}
</style>