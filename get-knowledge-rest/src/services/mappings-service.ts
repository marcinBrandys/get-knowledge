const _ = require('lodash');
const mappingsService = {
    getTaskType(taskMainCategory: string): string {
        const taskTypesMap = {
            T: ['T_01', 'T_02'],
            W: ['W_01', 'W_02', 'W_03', 'W_04'],
            S: ['S_01', 'S_02'],
            G: ['G_01', 'G_02']
        };

        return _.get(taskTypesMap, taskMainCategory, []);
    },
    getTaskTypes(): string[] {
        return ['T_01', 'T_02', 'W_01', 'W_02', 'W_03', 'W_04', 'S_01', 'S_02', 'G_01', 'G_02'];
    }
};

module.exports = mappingsService;