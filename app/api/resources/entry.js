export default {
  getEntries(query, options) {
    if (query === null) {
      query = {};
    }
    if (options === null) {
      options = {};
    }
    options = Object.assign(options, {
      collectionKey: 'entries'
    });
    return this._getCollection('/entries/', query, options);
  }
};
