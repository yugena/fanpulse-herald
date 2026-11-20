// FanPulse Herald: three heralds arrive 4, 3 and 2 waves before every guardian (boss) wave,
// on the boss's own schedule, so players can see a boss coming and prepare.
const LEADS = [4, 3, 2];

function heraldify(spawns, herald){
    // already applied (e.g. a saved game). find(), not contains(): Rhino resolves contains(fn) to contains(Object).
    if(spawns.find(g => g.type == herald) != null) return 0;
    var added = 0;
    spawns.select(g => g.effect == StatusEffects.boss && g.type != herald).each(boss => {
        LEADS.forEach(lead => {
            var h = new SpawnGroup(herald);
            h.unitAmount = 1;
            h.begin = boss.begin - lead;
            h.spacing = boss.spacing;
            h.end = SpawnGroup.never;
            h.max = 4;
            h.unitScaling = boss.spacing;
            h.shieldScaling = boss.shieldScaling;
            h.effect = StatusEffects.boss;
            spawns.add(h);
            added++;
        });
    });
    return added;
}

Events.on(WorldLoadEvent, e => {
    if(!Vars.state.rules.waves || Vars.net.client()) return;
    var n = heraldify(Vars.state.rules.spawns, Vars.content.unit("fanpulse-herald-herald"));
    if(n > 0) Log.info("[FanPulse] Heralds added before @ guardian wave groups.", n / LEADS.length);
});
