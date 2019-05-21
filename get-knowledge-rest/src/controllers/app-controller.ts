const statsService = require('../services/stats-service');
const mappingsService = require('../services/mappings-service');
let Solution = require('../models/solution-model');
const _ = require('lodash');
const config = require('../config/config');
const json2csv = require('json2csv').parse;

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
        const gender: string = _.get(req, 'params.gender');
        const paramsAge: string = _.get(req, 'params.age');
        const age: number = paramsAge ? Number.parseInt(paramsAge) : -1;

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

            for (let solution of solutions) {
                if (gender !== undefined && gender !== solution.student.gender) continue;
                if (age > -1 && age !== solution.student.age) continue;
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

            const result = {
                stats: taskTypesStats,
                testStats: testTaskTypesStats
            };

            let formattedResult = [];

            for (let key of _.keys(result)) {
                for (let taskTypeStat of _.keys(result[key])) {
                    const stats = result[key][taskTypeStat]['stats'];
                    const statsKeys = _.keys(stats);
                    let statsObject = {};
                    statsObject['taskTypeName'] = key === 'testStats' ? 'test_' + taskTypeStat : taskTypeStat;
                    for (let statKey of statsKeys) {
                        statsObject[statKey] = stats[statKey];
                    }
                    formattedResult.push(statsObject);
                }
            }

            try {
                const keys = _.keys(formattedResult[0]);
                const csv = json2csv(formattedResult, keys);
                res.setHeader('Content-disposition', 'attachment; filename=data.csv');
                res.set('Content-Type', 'text/csv');
                res.status(200).send(csv);
            } catch (error) {
                console.log(error);
                res.json({
                    error: error
                });
            }
        }).catch(function (error) {
            console.log(error);
            res.json({
                error: error
            });
        });
    }
}