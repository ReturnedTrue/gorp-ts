import ecr, { Component, Registry } from "@rbxts/ecr"
import { VideSource } from "./vide";

export declare const enum WidgetType {
	// EntityClientView = "entity_client_view",
	RegistrySelector = "registry_selector"
}

declare class Scheduler {
	constructor(scheduler_name?: string, hide?: boolean, max?: number); 
	
	/**
	 * this should be called before a system runs.
	 */
	public before(given_name: string): void;

	/**
	 * this should be called after a system runs.
	 * 
	 * we'll automatically infer context based on the first call.
	 */
	public after(custom_time?: number): void;

	public system<T extends unknown[]>(name: string, system: (...args: T) => void, ...args: T): void;

	public finish(): void;
}

declare namespace gorp {
	export const enabled: VideSource<boolean>;

	export { 
		Scheduler as scheduler 
	}

	/**
	 * adds a world to the list of worlds.
	 */
	export function add_world(world: Registry, name?: string): void;

	/**
	 * allows the user to add a callback which would check if a user can or can't use the debugger.
	 * 
	 * this will be called on both the server and client.
	 */
	export function check_if_user_allowed(callback: (player: Player) => boolean): void;

	/**
	 * spawns a new widget
	 */
	export function spawn_widget(name: WidgetType): void;

	/**
	 * compatibility for ecr versions that didn't have ecr.get_names()
	 */
	export function compat_set_cts(user_cts: Record<string, Component>): void;

	export function server_init(actor?: Actor): void;

	// TS EXCLUSIVE

	/**
	 * **Must be called for gorp-ts to function!**
	 */
	export function set_ecr(assigned_ecr: typeof ecr): void;
}

export default gorp;