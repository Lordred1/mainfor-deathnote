import { Player, world, system, EquipmentSlot, GameRule } from "@minecraft/server";

let lastMarkedPlayer = null;

world.afterEvents.entityHitEntity.subscribe(({ damagingEntity: player, hitEntity: target }) => {
    if (player.typeId !== 'minecraft:player' || target.typeId !== 'minecraft:player') return;

    const hand = player.getComponent('minecraft:equippable')?.getEquipment(EquipmentSlot.Mainhand);
    if (hand?.typeId === "dn:death_note") {
        const markedPlayer = target;
        if (markedPlayer?.addTag) {
            markedPlayer.addTag("marked");
            lastMarkedPlayer = markedPlayer;
        }
    }
});

world.beforeEvents.itemUse.subscribe((data) => {
    const player = data.source;
    if (data.itemStack.typeId === "dn:death_note") {
        system.run(() => main(player));
    }
});

function main(player) {
    console.warn("step 1 done");

    const markedPlayers = [...world.getPlayers({ tags: ["marked"] })];
    const sneak = player.isSneaking;
    const jumping = player.isJumping;

    if (markedPlayers.length > 0) {
        if (jumping) {
            player.runCommand("function instarespawnFalse");
            //player.runCommand("w @a[tag=marked] You Are Going To Die");
            player.runCommand("function deathMessage")
            player.runCommand("effect @a[tag=marked] instant_damage 1 1 true");
            player.runCommand("effect @a[tag=marked] fatal_poison 100 1 true");
            player.runCommand("schedule delay add backup 10s");
            player.runCommand("schedule delay add irf 12s");
        }

        if (sneak) {
            for (const marked of markedPlayers) {
                const loc = marked.location;
                player.dimension.createExplosion(loc, 2, { breaksBlocks: false });
            }
            player.runCommand("function instarespawnFalse");
            player.runCommand("kill @a[tag=marked]");
            //player.runCommand("w @a[tag=marked] You Were Killed By The Death Note");
            player.runCommand("function deathMessage")
            player.runCommand("schedule delay add backup 2s");
        
        }
        if(sneak == false && jumping == false){
        player.runCommand("schedule delay add instarespawnFalse 40s");
        player.runCommand("schedule delay add killPlayer2 41s");
        player.runCommand("schedule delay add killPlayer3 42s");
        player.runCommand("schedule delay add backup 44s");
        console.warn("heart attack")
        }
        console.warn("D");
    } else {
        player.runCommand("w @s No one is marked for death");
    }
}
