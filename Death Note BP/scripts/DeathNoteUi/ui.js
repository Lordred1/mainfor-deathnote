import { Player, world, system, EquipmentSlot, GameRule } from "@minecraft/server";
import { ActionFormData, ModalFormData} from "@minecraft/server-ui";

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
    const sneak = player.isSneaking;
    const jumping = player.isJumping;



    const deathNoteUi = new ActionFormData();
    deathNoteUi.title("The Death Note")
    .button("Select A Victim")
    

    deathNoteUi.show(player).then(r =>{
        if(r.selection == 0) {dropDownUI(player)}
    })
   
}

function dropDownUI(player){
    const playerDropDown = new ModalFormData()
    .textField("PLACE HOLDER LABEL","HUH","")

    playerDropDown.show(player).then(response =>{
        if(response.canceled){
        console.warn("menu closed")       
        }
        const victim = response.formValues[0]
        console.warn("Victim:  ",victim)
    })
}