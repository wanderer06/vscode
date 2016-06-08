/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'vs/css!./media/terminal.contribution';
import nls = require('vs/nls');
import {KeyMod, KeyCode} from 'vs/base/common/keyCodes';
import {SyncActionDescriptor} from 'vs/platform/actions/common/actions';
import {registerSingleton} from 'vs/platform/instantiation/common/extensions';
import {IWorkbenchActionRegistry, Extensions as ActionExtensions} from 'vs/workbench/common/actionRegistry';
import {TerminalService} from 'vs/workbench/parts/terminal/electron-browser/terminalService';
import {FocusTerminalAction, ToggleTerminalAction} from 'vs/workbench/parts/terminal/electron-browser/terminalActions';
import {ITerminalService, TERMINAL_PANEL_ID, TERMINAL_DEFAULT_SHELL_LINUX, TERMINAL_DEFAULT_SHELL_OSX, TERMINAL_DEFAULT_SHELL_WINDOWS} from 'vs/workbench/parts/terminal/electron-browser/terminal';
import * as panel from 'vs/workbench/browser/panel';
import {Registry} from 'vs/platform/platform';
import {Extensions, IConfigurationRegistry} from 'vs/platform/configuration/common/configurationRegistry';

let configurationRegistry = <IConfigurationRegistry>Registry.as(Extensions.Configuration);
configurationRegistry.registerConfiguration({
	'id': 'terminal',
	'order': 100,
	'title': nls.localize('terminalIntegratedConfigurationTitle', "Integrated terminal configuration"),
	'type': 'object',
	'properties': {
		'terminal.integrated.shell.linux': {
			'description': nls.localize('terminal.integrated.shell.linux', "The path of the shell that the terminal uses on Linux."),
			'type': 'string',
			'default': TERMINAL_DEFAULT_SHELL_LINUX
		},
		'terminal.integrated.shellArgs.linux': {
			'description': nls.localize('terminal.integrated.shellArgs.linux', "The command line arguments to use when on the Linux terminal."),
			'type': 'array',
			'items': {
				'type': 'string'
			},
			'default': []
		},
		'terminal.integrated.shell.osx': {
			'description': nls.localize('terminal.integrated.shell.osx', "The path of the shell that the terminal uses on OS X."),
			'type': 'string',
			'default': TERMINAL_DEFAULT_SHELL_OSX
		},
		'terminal.integrated.shellArgs.osx': {
			'description': nls.localize('terminal.integrated.shellArgs.osx', "The command line arguments to use when on the OS X terminal."),
			'type': 'array',
			'items': {
				'type': 'string'
			},
			'default': []
		},
		'terminal.integrated.shell.windows': {
			'description': nls.localize('terminal.integrated.shell.windows', "The path of the shell that the terminal uses on Windows."),
			'type': 'string',
			'default': TERMINAL_DEFAULT_SHELL_WINDOWS
		},
		'terminal.integrated.shellArgs.windows': {
			'description': nls.localize('terminal.integrated.shellArgs.windows', "The command line arguments to use when on the Windows terminal."),
			'type': 'array',
			'items': {
				'type': 'string'
			},
			'default': []
		},
		'terminal.integrated.fontFamily': {
			'description': nls.localize('terminal.integrated.fontFamily', "Controls the font family of the terminal, this defaults to editor.fontFamily's value."),
			'type': 'string'
		},
		'terminal.integrated.fontSize': {
			'description': nls.localize('terminal.integrated.fontSize', "Controls the font size of the terminal, this defaults to editor.fontSize's value."),
			'type': 'number'
		},
		'terminal.integrated.lineHeight': {
			'description': nls.localize('terminal.integrated.lineHeight', "Controls the line height of the terminal, this defaults to editor.lineHeight's value."),
			'type': 'number'
		}
	}
});

registerSingleton(ITerminalService, TerminalService);

(<panel.PanelRegistry>Registry.as(panel.Extensions.Panels)).registerPanel(new panel.PanelDescriptor(
	'vs/workbench/parts/terminal/electron-browser/terminalPanel',
	'TerminalPanel',
	TERMINAL_PANEL_ID,
	nls.localize('terminal', "Terminal"),
	'terminal'
));

let actionRegistry = <IWorkbenchActionRegistry>Registry.as(ActionExtensions.WorkbenchActions);
actionRegistry.registerWorkbenchAction(new SyncActionDescriptor(ToggleTerminalAction, ToggleTerminalAction.ID, ToggleTerminalAction.LABEL, {
	primary: KeyMod.CtrlCmd | KeyCode.US_BACKTICK,
	// on mac cmd+` is reserved to cycle between windows
	mac: { primary: KeyMod.WinCtrl | KeyCode.US_BACKTICK }
}), 'View: ' + ToggleTerminalAction.LABEL, nls.localize('viewCategory', "View"));
actionRegistry.registerWorkbenchAction(new SyncActionDescriptor(FocusTerminalAction, FocusTerminalAction.ID, FocusTerminalAction.LABEL), FocusTerminalAction.LABEL);
