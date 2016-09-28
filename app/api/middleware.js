export function deserializeObject(deserializer) {
  return function(response) {
    response.data = deserializer(response.data);
    return response;
  };
}

export function deserializeCollection(deserializer) {
  return function(response) {
    if (response.data === null || response.data.length === null) {
      throw new Error(
        `deserializeCollection expects an array, received '${response.data}'`
      );
    }
    response.data = response.data.map(deserializer);
    return response;
  };
}

export function extractData(key) {
  return function(response) {
    const extractedData = response.data[key];
    if (extractedData === null) {
      throw new Error(
        `extractData could not find data at '${key}' on '${response.data}'`
      );
    }
    response.data = extractedData;
    return response;
  };
}
