import Ember from 'ember';

import Entry from './resources/entry';

export default Ember.Object.extend(
  Entry,
  {
    get(uri, options = {}) {
      if (options.objectClass) {
        options.deserializer = this._createDeserializer(options.objectClass);
      }
      return this.api.get(uri, options).then(this._getDataFromResponse);
    },

    update(obj, data) {
      const uri = this._getUri(obj);
      if (uri == null) {
        throw new Error(
          `Repository cannot update an object without a uri: '${obj}'`
        );
      }
      return this.api.put(uri, data);
    },

    delete(obj) {
      const uri = this._getUri(obj);
      if (uri == null) {
        throw new Error(
          `Repository cannot delete an object without a uri: '${obj}'`
        );
      }
      return this.api.delete(uri);
    },

    _get(route, ...args) {
      let {args: argsWithoutOptions, options} = this._extractOptions(args);
      if (options.objectClass) {
        options.deserializer = this._createDeserializer(options.objectClass);
      }
      return route
        .call(this.api, ...argsWithoutOptions, options)
        .then(this._getDataFromResponse);
    },

    // Get the full response in order to get the response headers. i.e. x-total-count for pagination
    _getFullResponse(route, ...args) {
      let {args: argsWithoutOptions, options} = this._extractOptions(args);
      if (options.objectClass) {
        options.deserializer = this._createDeserializer(options.objectClass);
      }
      return route.call(this.api, ...argsWithoutOptions, options);
    },

    _getFirst(route, ...args) {
      return this._get(route, ...args).then(this._getFirstFromResponse);
    },

    _createDeserializer(objectClass) {
      return data => objectClass.deserialize(data);
    },

    _getDataFromResponse(response) {
      return response.data;
    },

    _getFirstFromResponse(collection) {
      let length = 0;
      if (collection != null) {
        length = collection.length;
      }
      if (length !== 1) {
        throw new Error(
          `Collection was expected to contain 1 result, but had ${length}.`
        );
      }
      return collection[0];
    },

    _setUriFromResponse(obj, idMatcher = null) {
      return response => {
        const uri = response.getHeader('location');
        Ember.set(obj, 'uri', uri);
        if (uri && idMatcher) {
          const match = uri.match(idMatcher);
          if (match) {
            Ember.set(obj, 'id', match[1]);
          }
        }
        return response;
      };
    },

    _expandCollection(getter, options = {}) {
      return response => {
        const collection = options.fullResponse ? response.data : response;
        return Ember.RSVP
          .all(collection.map(item => getter.call(this, item)))
          .then(expandedCollection => {
            if (options.fullResponse) {
              response.data = expandedCollection;
              return response;
            }
            return expandedCollection;
          });
      };
    },

    _extractOptions(args = []) {
      let options = {};
      if (args.length > 0) {
        options = args[args.length - 1];
        args = args.slice(0, args.length - 1);
      }
      return {args, options};
    },

    _getUri(object) {
      return get(object, 'uri');
    }
  }
);
