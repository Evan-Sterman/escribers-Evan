var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ComplexBase } from '@syncfusion/ej2-react-base';
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
var ItemDirective = /** @class */ (function (_super) {
    __extends(ItemDirective, _super);
    function ItemDirective() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemDirective.moduleName = 'item';
    return ItemDirective;
}(ComplexBase));
export { ItemDirective };
var ItemsDirective = /** @class */ (function (_super) {
    __extends(ItemsDirective, _super);
    function ItemsDirective() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemsDirective.propertyName = 'items';
    ItemsDirective.moduleName = 'items';
    return ItemsDirective;
}(ComplexBase));
export { ItemsDirective };
