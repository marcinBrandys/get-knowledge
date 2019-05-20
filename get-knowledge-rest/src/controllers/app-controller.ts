const statsService = require('../services/stats-service');
const mappingsService = require('../services/mappings-service');
let Solution = require('../models/solution-model');
const _ = require('lodash');
const config = require('../config/config')

export class AppController {
    getAppStatus(req, res) {
        res.json({
            status: 'running'
        });
    }

    getAppStats(req, res) {
        const bannedNicksForTTypeExercises = config.BANNED_T_TYPE_NICKS;
        const solutions1Query: object = {path: 'task', populate: {path: 'taskGroup'}};
        const solutions2Query: object = {path: 'student'};
        const taskTypes: string[] = mappingsService.getTaskTypes();
        let taskTypesStats = {};
        let testTaskTypesStats = {};

        for (let taskType of taskTypes) {
            taskTypesStats[taskType] = {
                solutions: [],
                stats: null
            };
            testTaskTypesStats[taskType] = {
                solutions: [],
                stats: null
            };
        }

        Solution.find({})
            .populate(solutions1Query)
            .populate(solutions2Query)
            .then(function (solutions) {
            console.log(solutions[0]);

            for (let solution of solutions) {
                const taskType: string = solution.task.taskType;
                const isTestTask: boolean = solution.task.taskGroup.isTestTaskGroup;
                if ((_.indexOf(bannedNicksForTTypeExercises, solution.student.nick.toString()) > -1
                    && _.includes(taskType, 'T') && !isTestTask)
                    || _.indexOf(taskTypes, taskType) < 0) continue;
                isTestTask ?
                    testTaskTypesStats[taskType].solutions.push(solution) : taskTypesStats[taskType].solutions.push(solution)
            }

            for (let taskTypeStat of _.keys(taskTypesStats)) {
                taskTypesStats[taskTypeStat].stats
                    = statsService.countStats(taskTypesStats[taskTypeStat].solutions);
                delete taskTypesStats[taskTypeStat].solutions;
            }

            for (let testTaskTypesStat of _.keys(testTaskTypesStats)) {
                testTaskTypesStats[testTaskTypesStat].stats
                    = statsService.countStats(testTaskTypesStats[testTaskTypesStat].solutions);
                delete testTaskTypesStats[testTaskTypesStat].solutions;
            }

            res.json({
                stats: taskTypesStats,
                testStats: testTaskTypesStats
            });
        }).catch(function (error) {
            console.log(error);
            res.json({
                error: error
            });
        });
    }
}