const statsService = {

    countStats: function (solutions: any[]): object {
        let result = {
            pointsWeightedAvg: 0,
            successRatio: 0,
            avgDuration: 0,
            numberOfCorrectSolutions: 0,
            numberOfSolutions: 0
        };
        let numberOfCorrectSolutions: number = 0;
        let numberOfSolutions: number = solutions.length || 0;
        let counter: number = 0;
        let denominator: number = 0;
        let duration: number = 0;
        for (let solution of solutions) {
            const taskWeight: number = solution.task.taskWeight;
            const taskPoints: number = solution.task.taskPoints;
            denominator += taskWeight;
            if (solution.isCorrect) {
                counter += taskWeight * taskPoints;
                numberOfCorrectSolutions++;
                duration += solution.duration;
            }
        }
        if (denominator) result.pointsWeightedAvg = counter / denominator;
        if (numberOfSolutions) result.successRatio = numberOfCorrectSolutions / numberOfSolutions;
        result.numberOfCorrectSolutions = numberOfCorrectSolutions;
        result.numberOfSolutions = numberOfSolutions;
        result.avgDuration = Math.round((duration / numberOfCorrectSolutions) / 1000);

        return result;
    }

};

module.exports = statsService;