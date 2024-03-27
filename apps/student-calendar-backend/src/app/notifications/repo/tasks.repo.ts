import { CloudTasksClient } from '@google-cloud/tasks';
import { differenceInSeconds } from 'date-fns';

export class CloudTasksRepo {
  client = new CloudTasksClient();
  async scheduleTask(
    requestUrl: string,
    payload: Record<string, any>,
    scheduleTime: Date
  ) {
    const project = process.env.GOOGLE_CLOUD_PROJECT.trim();
    const queue = process.env.CLOUD_TASKS_QUEUE.trim();
    const location = process.env.GOOGLE_CLOUD_LOCATION.trim();
    const baseUrl = process.env.BASE_URL.trim();
    const inSeconds = differenceInSeconds(scheduleTime, new Date());

    const url = `${baseUrl}${requestUrl}`;

    const parent = this.client.queuePath(project, location, queue);
    console.log("Creating task", {
      parent,
      task: {
        scheduleTime: {
          seconds: inSeconds,
        },
        httpRequest: {
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': Buffer.from(process.env.API_KEY.trim()).toString('base64')
          },
          httpMethod: 'POST',
          url,
          body: Buffer.from(JSON.stringify(payload)).toString("base64"),
        },
      },
    })
    const [response] = await this.client.createTask({
      parent,
      task: {
        scheduleTime: {
          seconds: inSeconds,
        },
        httpRequest: {
          headers: {
            'Content-Type': 'application/json',
          },
          httpMethod: 'POST',
          url,
          body: Buffer.from(JSON.stringify(payload)).toString("base64"),
        },
      },
    });
    console.log('task created', response.name)
  }
}
