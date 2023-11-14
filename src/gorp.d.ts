import ecr, { Component, Registry } from "@rbxts/ecr";
import { VideSource } from "./vide";

export declare const enum WidgetType {
	RegistrySelector = "registry_selector",
	EntityClientView = "entity_client_view",
	EntityServerView = "entity_server_view",
	JSONEditor = "json_editor",
	SchedulerClientView = "scheduler_view",
	SchedulerServerView = "scheduler_server_view",
	SystemClientView = "system_view",
	SystemServerView = "system_server_view",
}

export interface WidgetTypeProps {
	[WidgetType.RegistrySelector]: [];

	[WidgetType.EntityClientView]: [
		props: {
			world: { world: Registry; name: string };
			cleanup?: () => void;
			get_components?: (id: number) => number[];
		}
	];

	[WidgetType.EntityServerView]: [name: string, registry: number];

	[WidgetType.JSONEditor]: [
		props: {
			name: string;
			text: string;
			updated: (text: string) => void;
			prettify?: boolean;
		}
	];

	[WidgetType.SchedulerClientView]: [
		scheduler: Scheduler,
		cleanup?: () => void
	];

	[WidgetType.SchedulerServerView]: [name: string, scheduler: number];

	[WidgetType.SystemClientView]: [scheduler: Scheduler, system: number];

	[WidgetType.SystemServerView]: [
		scheduler_index: number,
		index: number,
		name: string
	];
}

export declare const enum CustomWidgetRealm {
	Server = "server",
	Client = "client",
	None = "none",
}

export declare interface GorpStyle {
	/**
	 * The primary background color.
	 */
	background: Color3;
  
	/**
	 * The primary foreground color.
	 */
	foreground: Color3;
  
	/**
	 * The color of the close button when hovered.
	 */
	close_button: Color3;
  
	/**
	 * The color of the close button when pressed.
	 */
	close_button_pressed: Color3;
  
	/**
	 * The background color of any text input object.
	 */
	input: Color3;
  
	/**
	 * The background color of a button.
	 */
	button: Color3;
  
	/**
	 * The background color of a button when hovered.
	 */
	button_hovering: Color3;
  
	/**
	 * The background color of a button when pressed.
	 */
	button_pressed: Color3;
  
	/**
	 * The background color of a tab.
	 */
	tab_background: Color3;
  
	/**
	 * The background color of a tab when hovered.
	 */
	tab_hovering: Color3;
  
	/**
	 * The background color of a tab when selected.
	 */
	tab_selected: Color3;
  
	/**
	 * The border color for everything.
	 */
	border: Color3;
  
	/**
	 * The border color when an object is selected.
	 */
	border_selected: Color3;
  
	/**
	 * The default color of text.
	 */
	text: Color3;
  
	/**
	 * The default color of any less important text.
	 */
	sub_text: Color3;
  
	/**
	 * The default font of all text.
	 */
	font: Enum.Font;
  
	/**
	 * The size of the text.
	 */
	font_size: number;
  
	/**
	 * The color of the scrollbar in scrolling frames.
	 */
	scroll_bar: Color3;
  
	/**
	 * Default padding.
	 */
	padding: UDim;
  
	/**
	 * Default corner radius.
	 */
	corner_radius: UDim;
  
	/**
	 * The color at the top of the profiler bar in the system view.
	 */
	microprofiler_bar_top: Color3;
  
	/**
	 * The color at the bottom of the profiler bar in the system view.
	 */
	microprofiler_bar_bot: Color3;
  }

export declare interface GorpConfig {
	/**
	 * Allows systems to yield. The time spent yielding is not ignored by the scheduler.
	 */
	allow_yielding: boolean
}

export declare interface GorpComponents {
	widget(this: void, props: {
		title: string, 
		size?: Vector2, 
		min_size?: Vector2, 
		closeable?: boolean,
		children?: (() => Instance | Instance[])
	}): Instance
}

declare class Scheduler {
	constructor(scheduler_name?: string, hide?: boolean, max?: number);

	/**
	 * Pauses a system that is currently running
	 */
	public pause(index: number): void;

	/**
	 * Resumes a system that is currently paused
	 */
	public resume(index: number): void;

	/**
	 * Returns if a system is currently paused or not
	 */
	public get_paused(index: number): boolean;

	/**
	 * Returns a list of indexes for systems that are paused.
	 */
	public get_all_paused(): number[];

	/**
	 * Gets the index of a system
	 */
	public get_index(name: string): number | undefined;

	/**
	 * Gets the name of a index
	 */
	public get_system(index: number): string;

	/**
	 * this should be called before a system runs.
	 * @deprecated
	 */
	public before(given_name: string): void;

	/**
	 * this should be called after a system runs.
	 *
	 * we'll automatically infer context based on the first call.
	 * @deprecated
	 */
	public after(custom_time?: number): void;


	/**
	 * Runs the given system with the provided arguments
	 */
	public system<T extends unknown[]>(
		name: string,
		system: (...args: T) => void,
		...args: T
	): void;

	/**
	 * Marks a system as skipped
	 */
	public skip(name: string): void;

	/**
	 * Marks the end of the update loop and starts the next frame in gorp
	 */
	public finish(): void;
}

declare namespace gorp {
	export const enabled: VideSource<boolean>;
	export const scale: VideSource<number>;

	/**
	 * Contains a list of all the colors for gorp. Modify this before spawning a widget to change the theme
	 */
	export const style: GorpStyle;

	export const components: GorpComponents;

	export {
		Scheduler as scheduler,
	};

	/**
	 * Configures and changes some part of gorp.
	 */
	export function pass_config(config: GorpConfig): void;

	/**
	 * adds a world to the list of worlds.
	 */
	export function add_world(world: Registry, name?: string): void;

	/**
	 * allows the user to add a callback which would check if a user can or can't use the debugger.
	 *
	 * this will be called on both the server and client.
	 */
	export function set_check_if_user_allowed(
		callback: (player: Player) => boolean
	): void;

	/**
	 * spawns a new widget
	 */
	export function spawn_widget<T extends WidgetType>(
		widget: T,
		...args: WidgetTypeProps[T]
	): () => void;

	/**
	 * Registers a custom widget which can be opened with a button in the registry selector
	 */
	export function register_custom_widget(name: string, realm: CustomWidgetRealm, callback: () => void): void;

	/**
	 * Closes all widgets
	 */
	export function clear_all(): void;

	/**
	 * compatibility for ecr versions that didn't have ecr.get_names()
	 */
	export function compat_set_cts(user_cts: Record<string, Component>): void;

	// TS EXCLUSIVE

	/**
	 * **Must be called for gorp-ts to function!**
	 */
	export function set_ecr(assigned_ecr: typeof ecr): void;
}

export default gorp;
