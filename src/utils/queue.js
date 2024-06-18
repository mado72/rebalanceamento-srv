exports.Queue = class Queue {
  static queue = [];

  static enqueue(promise, resolve, reject, data) {
    return new Promise((resolveQueue, rejectQueue) => {
      this.queue.push({
        promise,
        resolve: resolve,
        reject: reject,
        data: data
      });
      this.dequeue(resolveQueue, rejectQueue);
    });
  }

  static dequeue(resolve, reject) {
    try {
      if (this.workingOnPromise) {
        return false;
      }
      const item = this.queue.shift();
      if (!item) {
        resolve();
        return false;
      }
      try {
        this.workingOnPromise = true;
        item.promise()
          .then((value) => {
            this.workingOnPromise = false;
            item.resolve(value, item.data);
            this.dequeue(resolve, reject);
          })
          .catch(err => {
            this.workingOnPromise = false;
            item.reject(err, item.data);
            this.dequeue(resolve, reject);
          })
      } catch (err) {
        this.workingOnPromise = false;
        item.reject(err, item.data);
        this.dequeue(resolve, reject);
      }
      return true;
    } catch (e) {
      reject(e);
      return false;
    }
  }
}