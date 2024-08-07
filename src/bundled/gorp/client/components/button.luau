--[[

	This button lets you bind an action to a visual interface

]]

local actions = require(script.Parent.Parent.actions)
local style = require(script.Parent.Parent.style)
local vide = require(script.Parent.Parent.Parent.Parent.vide)

local border = require(script.Parent.border)
local container = require(script.Parent.container)
local corner = require(script.Parent.corner)

local create = vide.create
local source = vide.source
local read = vide.read

type Button = {

	text: string | () -> string,
	font: (Enum.Font | () -> Enum.Font)?,
	text_size: (number | () -> number)?,
	color: (Color3 | () -> Color3)?,
	alignment: (Enum.TextXAlignment | () -> Enum.TextXAlignment)?,
	padding: number?,
	disabled: (boolean | () -> boolean)?,

	layout: vide.vTextButton?,
	child: vide.vFrame?,

	activated: (() -> ())?,
}

local function button(props: Button)
	local hovering = source(false)
	local pressed = source(false)
	local disabled = props.disabled or false

	local background = style.button

	return create "TextButton" {

		Size = UDim2.new(1, 0, 0, 24),
		AutomaticSize = Enum.AutomaticSize.Y,

		Active = function()
			return not read(disabled)
		end,

		BackgroundColor3 = function()
			if read(disabled) then
				return style.button_disabled
			elseif pressed() then
				return style.button_pressed
			elseif hovering() then
				return style.button_hovering
			else
				return background
			end
		end,
		AutoButtonColor = false,

		Activated = props.activated,

		actions.hovering(hovering),
		actions.pressed(pressed),

		corner {},
		border {
			Color = function()
				if read(disabled) then
					return style.border_disabled
				else
					return style.border
				end
			end,
		},

		container {

			create "TextLabel" {

				AutomaticSize = Enum.AutomaticSize.XY,
				Position = UDim2.fromScale(0, 0.5),
				AnchorPoint = Vector2.new(0, 0.5),

				BackgroundTransparency = 1,

				Text = props.text,
				TextColor3 = props.color or style.text,
				TextSize = props.text_size or 16,
				Font = props.font or style.font,
			},

			props.child,
		},

		create "UIPadding" {

			PaddingLeft = UDim.new(0, props.padding or 6),
			PaddingRight = UDim.new(0, props.padding or 6),
		},

		props.layout :: any,
	}
end

return button
