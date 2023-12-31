local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
--[[

	Binds all things to the remotes

]]

local cts = require(script.cts)
local registry = require(script.registry)
local remotes = require(script.Parent.remotes)
local rolling_average = require(script.Parent.rolling_average)
local scheduler = require(script.scheduler)
local state = require(script.Parent.state)
local system = require(script.system)

if state.actor_id == 1 then
	local id = 0
	local function invoke_actor(remote: any, actor: number, ...: any): ...any
		if remote:IsA("RemoteEvent") then
			remote.actor:Fire(actor, ...)
			return
		end

		id += 1
		local stored = id

		local connection
		local packed

		-- watch this not work because coroutine.yield breaks things
		connection = remote.ReturnData.Event:Connect(function(actor_id, ...)
			if actor_id ~= stored then return end

			connection:Disconnect()
			packed = { ... }
		end)

		remote.actor:Fire(actor, stored, ...)

		while not packed do
			task.wait()
		end

		return unpack(packed)
	end

	remotes.get_server_schedulers.OnServerInvoke = scheduler.get_schedulers
	remotes.get_server_registries.OnServerInvoke =
		registry.get_server_registries
	remotes.get_server_cts.OnServerInvoke = cts.get_server_cts

	-- i hate working with this
	remotes.stop_flow_system_performance_data.OnServerEvent:Connect(
		function(player: Player, index: number, sys: number)
			local entry = (state.all_schedulers.entries :: any)[index]
			if entry.actor ~= state.actor_id then
				return invoke_actor(
					remotes.stop_flow_system_performance_data,
					entry.actor,
					player,
					entry.index,
					sys
				)
			else
				return system.disconnect(player, entry.index, sys)
			end
		end
	)

	remotes.subscribe_scheduler_data.OnServerInvoke = function(
		player,
		scheduler_index
	)
		local entry = (state.all_schedulers.entries :: any)[scheduler_index]
		if entry.actor ~= state.actor_id then
			return invoke_actor(
				remotes.subscribe_scheduler_data,
				entry.actor,
				player,
				entry.index,
				scheduler_index
			)
		else
			return scheduler.subscribe_scheduler_data(
				player,
				entry.index,
				scheduler_index
			)
		end
	end

	remotes.unsubscribe_scheduler_data.OnServerInvoke = function(
		player,
		scheduler_index
	)
		local entry = (state.all_schedulers.entries :: any)[scheduler_index]
		if entry.actor ~= state.actor_id then
			return invoke_actor(
				remotes.unsubscribe_scheduler_data,
				entry.actor,
				player,
				entry.index
			)
		else
			return scheduler.unsubscribe_scheduler_data(player, entry.index)
		end
	end

	remotes.get_system_performance_data.OnServerInvoke = function(
		player,
		index,
		sys
	)
		local entry = (state.all_schedulers.entries :: any)[index]
		if entry.actor ~= state.actor_id then
			return invoke_actor(
				remotes.get_system_performance_data,
				entry.actor,
				player,
				entry.index,
				sys,

				index
			)
		else
			return system.get_system_performance_data(
				player,
				entry.index,
				sys,
				index
			)
		end
	end

	remotes.pause_scheduler_system.OnServerEvent:Connect(
		function(player, index, sys)
			local entry = (state.all_schedulers.entries :: any)[index]
			if entry.actor ~= state.actor_id then
				return invoke_actor(
					remotes.pause_scheduler_system,
					entry.actor,
					player,
					entry.index,
					sys
				)
			else
				return system.pause_system(player, entry.index, sys)
			end
		end
	)

	remotes.resume_scheduler_system.OnServerEvent:Connect(
		function(player, index, sys)
			local entry = (state.all_schedulers.entries :: any)[index]
			if entry.actor ~= state.actor_id then
				return invoke_actor(
					remotes.resume_scheduler_system,
					entry.actor,
					player,
					entry.index,
					sys
				)
			else
				return system.resume_system(player, entry.index, sys)
			end
		end
	)

	remotes.set_query.OnServerInvoke = function(
		player,
		query_id,
		reg_index,
		query
	)
		local entry = (state.all_worlds.entries :: any)[reg_index]
		if entry.actor ~= state.actor_id then
			return invoke_actor(
				remotes.set_query,
				entry.actor,
				player,
				query_id,
				entry.index,
				query
			)
		else
			return registry.set_query(player, query_id, entry.index, query)
		end
	end

	remotes.get_all_entity_values.OnServerInvoke = function(
		player,
		reg_index,
		ent
	)
		local entry = (state.all_worlds.entries :: any)[reg_index]
		if entry.actor then
			return invoke_actor(
				remotes.get_all_entity_values,
				entry.actor,
				player,
				entry.index,
				ent
			)
		else
			return registry.get_all_entity_values(player, entry.index, ent)
		end
	end

	remotes.update_entities.OnServerEvent:Connect(
		function(player, reg_index, changed, removing)
			local entry = (state.all_worlds.entries :: any)[reg_index]
			if entry.actor then
				invoke_actor(
					remotes.update_entities,
					entry.actor,
					player,
					entry.index,
					changed,
					removing
				)
			else
				registry.update_entities(player, entry.index, changed, removing)
			end
		end
	)

	local average = rolling_average.new(20)
	local i = 0

	RunService.Heartbeat:Connect(function(dt)
		average:add(dt)

		i += 1

		if i % 5 ~= 0 then return end

		for _, player in Players:GetPlayers() do
			if state.can_use_debugger(player) == false then continue end
			remotes.share_server_fps:FireClient(player, average:average())
		end
	end)
else
	-- mental sanity is dripping away
	local function bind_actor_to(remote: any, callback: (...any) -> ...any)
		if remote:IsA("RemoteEvent") then
			remote.actor.Event:Connect(function(actor, ...)
				if actor ~= state.actor_id then return end
				callback(...)
			end)
		else
			remote.actor.Event:Connect(function(actor, id, ...)
				if actor ~= state.actor_id then return end
				remote.ReturnData:Fire(id, callback(...))
			end)
		end
	end

	bind_actor_to(remotes.set_query, registry.set_query)
	bind_actor_to(remotes.get_all_entity_values, registry.get_all_entity_values)
	bind_actor_to(remotes.stop_flow_system_performance_data, system.disconnect)
	bind_actor_to(
		remotes.subscribe_scheduler_data,
		scheduler.subscribe_scheduler_data
	)
	bind_actor_to(
		remotes.unsubscribe_scheduler_data,
		scheduler.unsubscribe_scheduler_data
	)
	bind_actor_to(
		remotes.get_system_performance_data,
		system.get_system_performance_data
	)

	bind_actor_to(remotes.update_entities, registry.update_entities)
	bind_actor_to(remotes.get_all_entity_values, registry.get_all_entity_values)

	bind_actor_to(remotes.pause_scheduler_system, system.pause_system)
	bind_actor_to(remotes.resume_scheduler_system, system.resume_system)
end

return {

	registry = registry,
	scheduler = scheduler,
	cts = cts.get_server_cts,
}
