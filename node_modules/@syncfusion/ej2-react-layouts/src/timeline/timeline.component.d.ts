import * as React from 'react';
import { Timeline, TimelineModel } from '@syncfusion/ej2-layouts';
import { DefaultHtmlAttributes } from '@syncfusion/ej2-react-base';
export interface TimelineTypecast {
    template?: string | Function | any;
    content?: string | Function | any;
    oppositeContent?: string | Function | any;
}
/**
 * `TimelineComponent` represents the react Timeline Component.
 * ```ts
 * <TimelineComponent items={timelineItems} />
 * ```
 */
export declare class TimelineComponent extends Timeline {
    state: Readonly<{
        children?: React.ReactNode | React.ReactNode[];
    }> & Readonly<TimelineModel | DefaultHtmlAttributes | TimelineTypecast>;
    setState: any;
    private getDefaultAttributes;
    initRenderCalled: boolean;
    private checkInjectedModules;
    directivekeys: {
        [key: string]: Object;
    };
    private statelessTemplateProps;
    private templateProps;
    private immediateRender;
    private isReactMock;
    props: Readonly<{
        children?: React.ReactNode | React.ReactNode[];
    }> & Readonly<TimelineModel | DefaultHtmlAttributes | TimelineTypecast>;
    forceUpdate: (callBack?: () => any) => void;
    context: Object;
    portals: any;
    isReactComponent: Object;
    refs: {
        [key: string]: React.ReactInstance;
    };
    constructor(props: any);
    render(): any;
}
