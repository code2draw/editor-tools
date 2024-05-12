export type TupplePoint = [number, number];

export interface MouseTrackerEvent {
    /** Current mouse position */
    readonly position: TupplePoint,
    /** Mouse position when button was pressed */
    readonly clickPosition?: TupplePoint,
    /**
     * The MouseEvent.button read-only property indicates which button was pressed on the mouse to trigger the event.
     * @type {MouseEvent['button']}
     * @link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
     */
    readonly button: number,
    /**
     * The MouseEvent.buttons read-only property indicates which buttons are pressed on the mouse (or other input device) when a mouse event is triggered.
     * @type {MouseEvent['buttons']}
     * @link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
     */
    readonly buttons: number,

    readonly clickButton?: number,
    readonly clickButtons?: number,
}

export interface ControlPointDragEvent {
    start: TupplePoint,
    end: TupplePoint,
}

export interface KeyboardTrackerEvent {
    key: string,
    direction: 'down' | 'up',
    shift: boolean,
    ctrl: boolean,
    alt: boolean,
    meta: boolean,
}