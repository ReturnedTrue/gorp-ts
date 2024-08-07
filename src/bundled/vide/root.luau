if not game then script = require "test/relative-string" end

local throw = require(script.Parent.throw)
local graph = require(script.Parent.graph)
type Node<T> = graph.Node<T>
local create_node = graph.create_node
local push_scope = graph.push_scope
local pop_scope = graph.pop_scope
local destroy = graph.destroy

local refs = {}

local function root<T...>(fn: (destroy: () -> ()) -> T...): T...
    local node = create_node(false, false, false)

    refs[node] = true -- prevent gc of root node

    local destroy = function()
        if not refs[node] then throw "root already destroyed" end
        refs[node] = nil
        destroy(node)
    end

    push_scope(node)

    local result = { pcall(fn, destroy) }

    pop_scope()

    if not result[1] then
        refs[node] = nil
        throw(`mount error\n{result[2]}`)
    end

    return unpack(result :: any, 2)
end

return root :: (<T...>(fn: (destroy: () -> ()) -> T...) -> T...) & ((fn: (destroy: () -> ()) -> ()) -> ())
