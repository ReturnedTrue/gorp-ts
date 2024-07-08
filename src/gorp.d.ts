type World = unknown;
type Component = unknown;
type Entity = number;

type VideSource<T> = (() => T) & ((value: T) => T)

declare class GorpScheduler {
	readonly name: string;

	system<T extends unknown[]>(name: string, callback: (...args: T) => void, ...args: T): void;

	skip(name: string): void;
	finish(): void;
}

declare interface GorpSystemLabel {
	category: string;

	capture: (resume: () => void) => unknown;
	decode: (packet: unknown, names: Record<number, string>) => string[];
}

declare namespace GorpECSLayer {
	export let on_hook_world: (world: World) => World;
	export let id: (id: number) => number;
	export let get: (world: World, id: Entity, ctype: Component) => unknown | undefined;
	export let query: (world: World, included: Component[], excluded: Component[]) => IterableFunction<unknown[]>;
	export let write: (world: World, id: Entity, values: Map<Component, unknown>) => void;
	export let on_change: (world: World, ctype: Component, callback: (id: Entity, ctype: Component) => void) => (() => void);
	export let get_all_components: (world: World, id: Entity) => Map<Component, unknown>;

	export let system_labels: GorpSystemLabel[];
}

declare interface GorpClient {
	enabled: VideSource<boolean>;
	gorp_selector: () => void;
}

declare namespace gorp {
	export function hook_world<T>(world: T, name?: string): T;
	export function scheduler(scheduler_name: string, max?: number): GorpScheduler;
	export function names<T extends Record<string, Component>>(components: T): T;
	export function get_worlds<T>(): T[];

	export const components: Map<string, Component>;
	export const map_ctype_to_index: Map<Component, number>;
	export const map_index_to_ctype: Map<number, Component>;

	export function overwrite_check_function(new_callback: (player: Player) => boolean): void;

	export function convert_scale(value: number, unit: string): string;

	export function get_client(): GorpClient;

	export {
		GorpECSLayer as ecs_layer
	}
}

export default gorp;
