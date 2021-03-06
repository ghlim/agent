import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import {
    MacroAction,
    DelayMacroAction,
    KeyMacroAction,
    ScrollMouseMacroAction,
    MoveMouseMacroAction,
    MouseButtonMacroAction,
    TextMacroAction,
    MacroActionHelper
} from 'uhk-common';
import { MacroDelayTabComponent, MacroMouseTabComponent, MacroKeyTabComponent, MacroTextTabComponent } from './tab';

enum TabName {
    Keypress,
    Text,
    Mouse,
    Delay
}

@Component({
    selector: 'macro-action-editor',
    templateUrl: './macro-action-editor.component.html',
    styleUrls: ['./macro-action-editor.component.scss'],
    host: { 'class': 'macro-action-editor' }
})
export class MacroActionEditorComponent implements OnInit {
    @Input() macroAction: MacroAction;

    @Output() save = new EventEmitter<MacroAction>();
    @Output() cancel = new EventEmitter<void>();

    @ViewChild('tab') selectedTab: MacroTextTabComponent | MacroKeyTabComponent | MacroMouseTabComponent | MacroDelayTabComponent;

    editableMacroAction: MacroAction;
    activeTab: TabName;
    /* tslint:disable:variable-name: It is an enum type. So it can start with uppercase. */
    TabName = TabName;
    /* tslint:enable:variable-name */
    isSelectedMacroValid = false;

    ngOnInit() {
        this.updateEditableMacroAction();
        const tab: TabName = this.getTabName(this.editableMacroAction);
        this.activeTab = tab;
    }

    ngOnChanges() {
        this.ngOnInit();
    }

    onCancelClick(): void {
        this.cancel.emit();
    }

    onSaveClick(): void {
        try {
            // TODO: Refactor after getKeyMacroAction has been added to all tabs
            const action = this.selectedTab instanceof MacroKeyTabComponent ?
                this.selectedTab.getKeyMacroAction() :
                this.selectedTab.macroAction;
            this.save.emit(action);
        } catch (e) {
            // TODO: show error dialog
            console.error(e);
        }
    }

    onValid = (isMacroValid: boolean) => this.isSelectedMacroValid = isMacroValid;

    selectTab(tab: TabName): void {
        this.activeTab = tab;
        if (tab === this.getTabName(this.macroAction)) {
            this.updateEditableMacroAction();
        } else {
            this.editableMacroAction = undefined;
            this.isSelectedMacroValid = false;
        }
    }

    getTabName(action: MacroAction): TabName {
        if (action instanceof DelayMacroAction) {
            return TabName.Delay;
        } else if (action instanceof TextMacroAction) {
            return TabName.Text;
        } else if (action instanceof KeyMacroAction) {
            return TabName.Keypress;
        } else if (action instanceof MouseButtonMacroAction ||
            action instanceof MoveMouseMacroAction ||
            action instanceof ScrollMouseMacroAction) {
            return TabName.Mouse;
        }
        return undefined;
    }

    private updateEditableMacroAction() {
        const macroAction: MacroAction = this.macroAction ? this.macroAction : new TextMacroAction();
        this.editableMacroAction = MacroActionHelper.createMacroAction(macroAction);
    }

}
