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


export declare const enum CustomWidgetType {
	server = "server",
	client = "client",
	none = "none",
}


declare class Scheduler {
	constructor(scheduler_name?: string, hide?: boolean, max?: number);

	public pause(index: number): void;
	public resume(index: number): void;

	public get_paused(index: number): boolean;
	public get_all_paused(): [number];

	public get_index(name: string): number | undefined;
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


	public system<T extends unknown[]>(
		name: string,
		system: (...args: T) => void,
		...args: T
	): void;
	public skip(name: string): void;

	public finish(): void;
}

declare interface Style {
	background: Color3;
	foreground: Color3;

	close_button: Color3;
	close_button_pressed: Color3;

	input: Color3;

	button: Color3;
	button_hovering: Color3;
	button_pressed: Color3;

	tab_background: Color3;
	tab_hovering: Color3;
	tab_selected: Color3;

	border: Color3;
	border_selected: Color3;

	text: Color3;
	sub_text: Color3;
	font: Enum.Font;
	font_size: number;

	scroll_bar: Color3;

	padding: UDim;

	corner_radius: UDim;

	microprofiler_bar_top: Color3;
	microprofiler_bar_bot: Color3;
}

declare interface Config {
	allow_yielding: boolean

}

declare interface Components {

	widget(props: {title: string, size?: Vector2, min_size?: Vector2, closeable?: boolean}): Instance

}

export interface WidgetTypeProps {
	[WidgetType.RegistrySelector]: [];
	[WidgetType.EntityClientView]: [
		props: {
			world: { world: Registry; name: string };
			cleanup?: () => void;
			get_components?: (id: number) => Array<number>;
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

declare namespace gorp {
	export const enabled: VideSource<boolean>;
	export const scale: VideSource<number>;

	export {
		Scheduler as scheduler,
		Style as style,
		Components as components
	};

	export function pass_config(config: Config): void;

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
	 * Closes all widgets
	 */
	export function clear_all(): void;

	/**
	 * compatibility for ecr versions that didn't have ecr.get_names()
	 */
	export function compat_set_cts(user_cts: Record<string, Component>): void;

	export function register_custom_widget(name: string, type: CustomWidgetType, callback: () => void): void;

	// TS EXCLUSIVE

	/**
	 * **Must be called for gorp-ts to function!**
	 */
	export function set_ecr(assigned_ecr: typeof ecr): void;
}

export default gorp;
