<div align="center">
	<h1>gorp-ts</h1>
</div>

Fork of [gorp](https://github.com/Aloroid/gorp) for Roblox-ts.

# Differences to Luau version
- This package is versioned with `<gorp version>-ts.<x>` where x is incremented for any changes to the TS version in particular.

# Code sample with ecr

The following requires the [gorp-ecr](https://github.com/ReturnedTrue/gorp-ecr-ts) package

Server

```ts
import ecr from "@rbxts/ecr";
import gorp from "@rbxts/gorp";
import gorp_ecr from "@rbxts/gorp-ecr";

// Required, sets up the ecs layer for ecr
gorp_ecr.init({ ecr, gorp });
```

Client
```ts
import ecr from "@rbxts/ecr";
import gorp from "@rbxts/gorp";
import gorp_ecr from "@rbxts/gorp-ecr";

// Required, sets up the ecs layer for ecr
gorp_ecr.init({ ecr, gorp });

// Create components
const Position = ecr.component(() => Vector3.zero);
const Velocity = ecr.component<Vector3>();

// Assign names to components
gorp.names({ pos: Position, vel: Velocity });

// Create world and assign name
const world = ecr.registry();
gorp.hook_world(world, "main_world");

// Get the client and mount the selector interface
const client = gorp.get_client();
client.gorp_selector();

// Create entity, assign components
const ent = world.create();
world.add(ent, Position);
world.set(ent, Velocity, Vector3.xAxis);

// Create scheduler
const scheduler = gorp.scheduler("main_scheduler");

function position_system(dt: number) {
	for (const [id, pos, vel] of world.view(Position, Velocity)) {
		world.set(id, Position, pos.add(vel.mul(dt)));
	}
}

// Run the system every frame in the scheduler
game.GetService("RunService").RenderStepped.Connect((dt) => {
	scheduler.system("position_system", position_system, dt);
	scheduler.finish();
});

// Connect F keybind to toggle the interface
game.GetService("UserInputService").InputBegan.Connect((input) => {
	if (input.KeyCode === Enum.KeyCode.F) {
		client.enabled(!client.enabled());
	}
});

```