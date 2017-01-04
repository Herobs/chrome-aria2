<template>
  <div id="yaac">
    <md-tabs>
      <md-tab id="active" md-label="正在下载">
        <md-list>
          <md-list-item v-for="active in tasks.active">
            {{ active.file }} / {{ active.downloadSpeed | byte }}/s
          </md-list-item>
        </md-list>
      </md-tab>
      <md-tab id="waiting" md-label="等待下载">
      </md-tab>
    </md-tabs>
</template>

<script>
import Aria2 from './aria2';

export default {
  name: 'yaac',
  props: ['settings'],
  data() {
    return {
      tasks: {
        active: [],
        waiting: []
      }
    };
  },
  created() {
    const aria2 = new Aria2();

    const $alert = this.notify('正在连接到 aria2 服务器。。。');
    aria2.connect(this.settings.path, this.settings.secret)
      .then(result => {
        this.notify(result);
        this.getTasks();
      })
      .catch(err => {
        this.notify(err);
      });

    this.aria2 = aria2;
  },
  methods: {
    notify: message => {
      console.log(message);
    },
    getTasks() {
      // get active tasks
      this.aria2.request('tellActive')
        .then(active => {
          for (let task of active) {
            task.file = task.files[0].path.split('/').pop();
          }
          this.tasks.active = active;
        })
        .catch(err => {
          this.notify(err);
        });
      // get waiting tasks
      this.aria2.request('tellWaiting', 0, 10)
        .then(waiting => {
          this.tasks.waiting = waiting;
        })
        .catch(err => {
          this.notify(err);
        });

      setTimeout(() => {
        this.getTasks();
      }, 1000);
    }
  },
  filters: {
    byte: size => {
      const units = ['B', 'K', 'M', 'G', 'T'];
      for (let unit of units) {
        if (size < 1024) {
          return Math.round(size * 100) / 100 + ' ' + unit;
        }
        size /= 1024;
      }
      return Math.round(size * 100) / 100 + ' T';
    }
  }
}
</script>

<style>
</style>
