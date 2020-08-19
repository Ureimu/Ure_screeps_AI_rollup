let link_sp_m = {
    run: function () {
        let linkFrom: StructureLink[] = [
            Game.getObjectById('5f0cf8a0f326cd3e1ebb9232'),
            //Game.getObjectById('5f09c71ff1837985d4e0693f')
        ];
        let linkTo: StructureLink[] = [
            Game.getObjectById('5f09c71ff1837985d4e0693f'),
            //Game.getObjectById('5f0e9cbec50bbd684eab3b02')
        ];
        for (let i = 0, j = linkFrom.length; i < j; i++) {
            if (linkFrom[i] != null && linkTo[i] != null) {
                linkFrom[i].transferEnergy(linkTo[i]);
            }
        }
    }
};

module.exports = link_sp_m;