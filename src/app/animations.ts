import {
    trigger,
    animate,
    transition,
    style,
    query,
    group
} from '@angular/animations';

const optional = { optional: true };
export const fadeAnimation = trigger('fadeAnimation', [
    transition('* <=> slideIn', [
        // Set a default  style for enter and leave
        query(':enter, :leave', [
            style({
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%'
            }),
        ], optional),
        // Animate the new page in
        query(':enter', [
            style({ right: '-100%' })
        ], optional),
        group([
            query(':leave', [
                animate('600ms ease', style({ right: '100%' }))
            ], optional),
            query(':enter', [
                animate('600ms ease', style({ right: '0%' }))
            ], optional)
        ]),
    ]),
    transition('* <=> slideIn2', [
        // Set a default  style for enter and leave
        query(':enter, :leave', [
            style({
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%'
            }),
        ], optional),
        // Animate the new page in
        query(':enter', [
            style({ right: '-100%' })
        ], optional),
        group([
            query(':leave', [
                animate('600ms ease', style({ right: '100%' }))
            ], optional),
            query(':enter', [
                animate('600ms ease', style({ right: '0%' }))
            ], optional)
        ]),
    ]),
]);
