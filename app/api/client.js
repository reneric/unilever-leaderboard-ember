/* global $ JSON */

import Ember from 'ember';
import Response from './models/response';
import {deserializeObject, deserializeCollection, extractData} from './middleware';
import Entry from './resources/entry';

class Client {
  request(url, options = {}) {
    let result = this._ajax(url, options);
    const {middleware = []} = options;
    middleware.forEach(m => result = result.then(m));
    return result;
  }

  get(url, options = {}) {
    options = Object.assign(options, {
      type: 'GET',
      contentType: 'application/json',
      accept: 'application/json',
      authorization: 'Token notasecrettoken'
    });
    return this.request(url, options);
  }

  post(url, data, options = {}) {
    options = Object.assign(options, {
      type: 'POST',
      data: JSON.stringify(data),
      processData: false,
      contentType: 'application/json'
    });
    return this.request(url, options);
  }

  put(url, data, options = {}) {
    options = Object.assign(options, {
      type: 'PUT',
      data: JSON.stringify(data),
      processData: false,
      contentType: 'application/json'
    });
    return this.request(url, options);
  }

  delete(url, options = {}) {
    options = Object.assign(options, {
      type: 'DELETE'
    });
    return this.request(url, options);
  }

  _ajax(url, options = {}) {
    options = Object.assign(options, {
      dataType: 'json'
    });
    return new Ember.RSVP.Promise((resolve, reject) => {
      return $.ajax(url, options)
        .done((data, status, xhr) => {
          return resolve(new Response(xhr, this, options));
        })
        .fail((xhr/*, status, error*/) => {
          return reject(new Response(xhr, this, options));
        });
    });
  }

  _getObject(url, options = {}) {
    let middleware = [];
    if (options.objectKey) {
      middleware.push(extractData(options.objectKey));
    }
    if (options.deserializer) {
      middleware.push(deserializeObject(options.deserializer));
    }
    options.middleware = middleware.concat(options.middleware || []);
    return this.get(url, options);
  }

  _getCollection(url, query = {}, options = {}) {
    let middleware = [];
    if (options.collectionKey) {
      middleware.push(extractData(options.collectionKey));
    }
    if (options.deserializer) {
      middleware.push(deserializeCollection(options.deserializer));
    }
    options.middleware = middleware.concat(options.middleware || []);
    options.data = Object.assign(options.data || {}, query);
    return this.get(url, options);
  }
}

[
  Entry,
].forEach(mixin => Client.prototype = Object.assign(Client.prototype, mixin));

export default Client;
