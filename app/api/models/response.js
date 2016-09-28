/* global parseLinks */

export default class Response {
  constructor(xhr, client, requestOptions) {
    this._xhr = xhr;
    this._client = client;
    this._requestOptions = requestOptions;
    this.status = this._xhr.status;
    this.data = this._xhr.responseJSON;
    this.totalCount = this._parseTotalCount();
  }

  getHeader(key) {
    return this._xhr.getResponseHeader(key);
  }

  _parseTotalCount() {
    let totalCount;
    totalCount = this.getHeader('x-total-count');
    if (totalCount) {
      return parseInt(totalCount);
    }
    else {
      return null;
    }
  }
}
