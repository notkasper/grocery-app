#!/usr/bin/env node
require('request-promise')({
  url: 'http://lumtest.com/myip.json',
  proxy:
    'http://lum-customer-hl_db37e9dc-zone-static:ktnz7vj4n8qt@zproxy.lum-superproxy.io:22225',
}).then(
  function (data) {
    console.log(data);
  },
  function (err) {
    console.error(err);
  }
);
