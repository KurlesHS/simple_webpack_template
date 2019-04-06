import {GetBacon} from './utils';

const baconEl = document.querySelector('.bacon');
GetBacon()
  .then(res => {

      // noinspection JSUnusedAssignment
      baconEl.innerHTML = res.reduce((acc, val) => (acc += `<p>${val}</p>`), '');
  }).catch(err => (baconEl.innerHTML = err));