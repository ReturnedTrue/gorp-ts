--[[

	A generic layer for ECS to make implementing support for other ECS modules
	for Gorp easier.

	By default we do not include support for any library and this has to be
	manually implemented by the user.

]]

type World = any
type Component = any
type Entity = any

return {

	--- This function is called whenever a new world is hooked onto
	on_hook_world = function(world)
		return world
	end,

	--- This function is called in order to display to the user what id some entity is associated with.
	--- Feel free to format this in any way
	id = function(id)
		return tostring(id)
	end,

	--- This function will be used to get a value from a component
	get = function(world, id, ctype)
		return "no impl"
	end,

	--- This function will be used to iterate over a given query.
	query = function(world, included, excluded)
		local i = 1
		local m = 10000
		return function()
			i += 1
			if m == i then return nil end
			return i --math.random(1, 10000)
		end
	end,

	--- This function will be used to write a value to an entity of the world
	write = function(world, id, ctypes)
		warn("no impl", id, ctypes)
	end,

	--- This function should be called to listen for whenever a ctype change happens, and then run the callback.
	--- It will then return a function that can be used to disconnect the callback.
	--- This has to be implemented in order to allow the registry to update live.
	on_change = function(world, ctype, callback)
		return function() end
	end,

	--- This function will get all components of an entity
	get_all_components = function(world, id)
		return {
			["_gorp_long_key_no_one_will_likely_use_❤❤"] = "no impl",
		}
	end,

	--- system_labels are a collection of functions used to add extra categories and labels to systems.
	--- These extra labels will then be displayed under the Performance widget of each system.
	system_labels = {},
} :: {

	--- This function is called whenever a new world is hooked onto
	on_hook_world: (world: World) -> World,

	--- This function will be used when displaying the registry.
	id: (id: Entity) -> string,
	--- This function will be used to get a value from a component
	get: (world: World, id: Entity, component: Component) -> unknown?,
	--- This function will be used to iterate over a given query.
	--- When no included components or excluded components are given, this function expects to iterate over all the entities in the world.
	query: (world: World, included: { Component }, excluded: { Component }) -> () -> Entity,
	--- This function will be used to write a value to the world
	write: (world: World, id: Entity, values: { [Component]: unknown }) -> (),
	--- This function should be called to listen for whenever a ctype change happens, and then run the callback.
	--- It will then return a function that can be used to disconnect the callback
	on_change: (world: World, component: Component, callback: (id: Entity) -> ()) -> () -> (),
	--- This function will get all components of an entity
	get_all_components: (world: World, id: Entity) -> { [Component]: unknown },

	system_labels: {
		{
			category: string,

			capture: (resume: () -> ()) -> any,
			decode: (any, { [number]: string }) -> { string },
		}
	},
}
