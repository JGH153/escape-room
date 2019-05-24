export interface ScoreboardElement {
    endTime: string;
    endTimeUnix: number;
    completed: boolean;
    startTime: string;
    startTimeUnix: number;
    name: string;
    score: number;
    stageCompleted: number;
    durationTimeSec: number;
}
