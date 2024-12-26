import { ComplexBase } from '@syncfusion/ej2-react-base';
import { TimelineItemModel } from '@syncfusion/ej2-layouts';
/**
 * `ItemDirective` represents a item of the React Timeline.
 * It must be contained in a Timeline component(`TimelineComponent`).
 * ```tsx
 * <TimelineComponent>
 *  <ItemsDirective>
 *   <ItemDirective dotCss= { 'e-icons e-folder' } content= { 'Item 1' } />
 *   <ItemDirective dotCss= { 'e-icons e-folder' } content= { 'Item 2' } />
 *  </ItemsDirective>
 * </TimelineComponent>
 * ```
 */
export declare class ItemDirective extends ComplexBase<TimelineItemModel & {
    children?: React.ReactNode;
}, TimelineItemModel> {
    static moduleName: string;
}
export declare class ItemsDirective extends ComplexBase<{}, {}> {
    static propertyName: string;
    static moduleName: string;
}
