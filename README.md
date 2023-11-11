<div align="center">
	<h1>gorp-ts</h1>
</div>

___

Fork of [gorp](https://github.com/Aloroid/gorp) for Roblox-ts.

# Differences to Luau version
- gorp by default relies on it being alongside ecr in the wally packages directory. To replicate this behaviour, you must call `gorp.set_ecr(ecr)` before working with gorp. 
- This package is versioned with `<gorp version>-ts.<x>` where x is incremented for any changes to the TS version in particular 

# Code sample

Server

```ts
import gorp from "@rbxts/gorp";

// Required for gorp to setup permission remotes, etc
gorp.server_init();

```

Client
```ts
import gorp, { WidgetType } from "@rbxts/gorp";
import ecr, { Registry } from "@rbxts/ecr";

const RunService = game.GetService("RunService");

const Position = ecr.component(() => Vector3.zero);
const Velocity = ecr.component<Vector3>();

// Required for the TS version to access your ecr 
gorp.set_ecr(ecr);

// Assigns names for the components
gorp.compat_set_cts({
	"Position": Position,
	"Velocity": Velocity,
})

// Must clone the ecr registry for gorp to be able to access more
const world = table.clone(ecr.registry());

const entity = world.create();
world.add(entity, Position)
world.set(entity, Velocity, new Vector3(10, 0, 0))

gorp.add_world(world, "main_world");
gorp.spawn_widget(WidgetType.RegistrySelector);

const scheduler = new gorp.scheduler("main_scheduler");

function position_system(registry: Registry, dt: number) {
	for (const [id, pos, vel] of registry.view(Position, Velocity)) {
		registry.set(id, Position, pos.add(vel.mul(dt)));
	}
}

RunService.RenderStepped.Connect((dt) => {
	// Run our system with a given name
	scheduler.system("position_system", position_system, world, dt);

	// Tells the scheduler our game loop is finished
	scheduler.finish();
})

// Shows all the gorp widgets, enabling could be controlled by key input
gorp.enabled(true);
```