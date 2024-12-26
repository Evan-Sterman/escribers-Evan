import { ComplexBase, applyMixins, ComponentBase } from '@syncfusion/ej2-react-base';
import { createElement, Component } from 'react';
import { Splitter, DashboardLayout, Timeline } from '@syncfusion/ej2-layouts';
export * from '@syncfusion/ej2-layouts';

/**
 * PanesDirective` represent a panes of the react splitter.
 * It must be contained in a Splitter component(`SplitterComponent`).
 * ```tsx
 * <SplitterComponent>
 *   <PaneSettingsDirective>
 *     <PaneDirective size={this.Pane1Size}></PaneDirective>
 *     <PaneDirective size={this.Pane2Size}></PaneDirective>
 *   <PaneSettingsDirective>
 * </SplitterComponent>
 * ```
 */
class PaneDirective extends ComplexBase {
}
PaneDirective.moduleName = 'pane';
class PanesDirective extends ComplexBase {
}
PanesDirective.propertyName = 'paneSettings';
PanesDirective.moduleName = 'panes';

/**
 * Represents the React Splitter Component
 * ```html
 * <Splitter></Splitter>
 * ```
 */
class SplitterComponent extends Splitter {
    constructor(props) {
        super(props);
        this.initRenderCalled = false;
        this.checkInjectedModules = false;
        this.directivekeys = { 'panes': 'pane' };
        this.statelessTemplateProps = null;
        this.templateProps = null;
        this.immediateRender = false;
        this.isReactMock = true;
        this.portals = [];
    }
    render() {
        this.isReactMock = false;
        if (((this.element && !this.initRenderCalled) || this.refreshing) && !this.isReactForeceUpdate) {
            super.render();
            this.initRenderCalled = true;
        }
        else {
            return createElement('div', this.getDefaultAttributes(), [].concat(this.props.children, this.portals));
        }
    }
}
applyMixins(SplitterComponent, [ComponentBase, Component]);

/**
 * `PanelsDirective` represent a presets of the react dashboardlayout.
 * It must be contained in a dashboardlayout component(`DashBoardLayoutComponent`).
 * ```tsx
 * <DashBoardLayoutComponent>
 * <PanelsDirective>
 * <PanelDirective></PanelDirective>
 * <PanelDirective></PanelDirective>
 * </PanelsDirective>
 * </DashBoardLayoutComponent>
 * ```
 */
class PanelDirective extends ComplexBase {
}
PanelDirective.moduleName = 'panel';
PanelDirective.complexTemplate = { 'panels.header': 'panels.header', 'panels.content': 'panels.content' };
class PanelsDirective extends ComplexBase {
}
PanelsDirective.propertyName = 'panels';
PanelsDirective.moduleName = 'panels';

/**
 * Represents the Essential JS 2 React DashboardLayout Component.
 * ```ts
 * <DashBoardLayoutComponent></DashBoardLayoutComponent>
 * ```
 */
class DashboardLayoutComponent extends DashboardLayout {
    constructor(props) {
        super(props);
        this.initRenderCalled = false;
        this.checkInjectedModules = false;
        this.directivekeys = { 'panels': 'panel' };
        this.statelessTemplateProps = null;
        this.templateProps = null;
        this.immediateRender = false;
        this.isReactMock = true;
        this.portals = [];
    }
    render() {
        this.isReactMock = false;
        if (((this.element && !this.initRenderCalled) || this.refreshing) && !this.isReactForeceUpdate) {
            super.render();
            this.initRenderCalled = true;
        }
        else {
            return createElement('div', this.getDefaultAttributes(), [].concat(this.props.children, this.portals));
        }
    }
}
applyMixins(DashboardLayoutComponent, [ComponentBase, Component]);

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
class ItemDirective extends ComplexBase {
}
ItemDirective.moduleName = 'item';
class ItemsDirective extends ComplexBase {
}
ItemsDirective.propertyName = 'items';
ItemsDirective.moduleName = 'items';

/**
 * `TimelineComponent` represents the react Timeline Component.
 * ```ts
 * <TimelineComponent items={timelineItems} />
 * ```
 */
class TimelineComponent extends Timeline {
    constructor(props) {
        super(props);
        this.initRenderCalled = false;
        this.checkInjectedModules = false;
        this.directivekeys = { 'items': 'item' };
        this.statelessTemplateProps = null;
        this.templateProps = null;
        this.immediateRender = false;
        this.isReactMock = true;
        this.portals = [];
    }
    render() {
        this.isReactMock = false;
        if (((this.element && !this.initRenderCalled) || this.refreshing) && !this.isReactForeceUpdate) {
            super.render();
            this.initRenderCalled = true;
        }
        else {
            return createElement('div', this.getDefaultAttributes(), [].concat(this.props.children, this.portals));
        }
    }
}
applyMixins(TimelineComponent, [ComponentBase, Component]);

export { DashboardLayoutComponent, ItemDirective, ItemsDirective, PaneDirective, PanelDirective, PanelsDirective, PanesDirective, SplitterComponent, TimelineComponent };
//# sourceMappingURL=ej2-react-layouts.es2015.js.map
