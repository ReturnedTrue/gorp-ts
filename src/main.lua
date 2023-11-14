-- Empty proxy table
local gorp = {}

-- Empty proxy table which gorp internally requires
local ecr = require(script.Parent.bundled.ecr);

gorp.set_ecr = function(assigned_ecr)
	-- Assigns the keys of the ecr proxy table 
	for key, value in pairs(assigned_ecr) do
		ecr[key] = value;
	end

	-- Assigns the keys of the gorp proxy table
	-- This is required as gorp faces race conditions without ecr assigned
	for key, value in pairs(require(script.Parent.bundled.gorp)) do
		gorp[key] = value;
	end
end

return {
	default = gorp,
};
