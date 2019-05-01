export class AppController {
    getAppStatus(req, res) {
        res.json({
            status: 'running'
        });
    }
}