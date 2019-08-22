export interface ScoreboardElement {
    id: string;
    endTime: string;
    endTimeUnix: number;
    completed: boolean;
    startTime: string;
    startTimeUnix: number;
    name: string;
    score: number;
    currentStage: number;
    durationTimeSec?: number;
    cameraDeviceId?: string;
    noCamera?: boolean;
    hideInScoreboard?: boolean;
}
