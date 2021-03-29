

const queueConfig = {
   redis: {
      host: 'redis-11974.c241.us-east-1-4.ec2.cloud.redislabs.com',
      port: 11974,
      password: 'nC1SMA5DdItGZya6SjUzYTnlxngjErOG'
   },
   isWorker: false,
   removeOnSuccess: true,
   getEvents: true,
   sendEvents: true,
   storeJobs: true
};


module.exports = queueConfig;

