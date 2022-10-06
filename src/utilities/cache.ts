/**
 * 해당 이름을 가진 스토리지를 반환한다.
 * 만들어져 있다면, 만들어진 스토리지를, 없다면 만들어서 반환한다.
 * @param storageName
 * @returns
 */
export const openCache = async (storageName: string): Promise<Cache> => {
  const storage = await window.caches.open(storageName);
  return storage;
};

/**
 * 스토리지 안에 URL을 키로, 데이터를 저장한다.
 * @param storageName
 * @param url
 * @param res
 */
export const putCache = async (
  storageName: string,
  url: string,
  res: Response
) => {
  const storage = await window.caches.open(storageName);
  storage.put(url, res);
};

/**
 * 스토리지 안에 URL를 키로 가진 캐시 데이터를 삭제한다.
 * @param storageName
 * @param url
 */
export const deleteCache = async (storageName: string, url: string) => {
  const storage = await openCache(storageName);
  storage.delete(url);
};

/**
 * 스토리지 안에 요청한 URL을 키로 가진 캐시 데이터가 있는지 확인한다.
 * @param storageName
 * @param url
 * @returns 캐시 데이터가 없다면 undefined를 반환한다.
 */
export const matchCache = async (storageName: string, url: string) => {
  const storage = await openCache(storageName);
  return storage.match(url);
};

/**
 * 스토리지 안에 URL를 키로 가진 캐시 데이터가 있는지 확인 후,
 * 있다면 캐시 데이터를 반환하고
 * 없다면 API를 요청해 response를 반환한다.
 * @param storageName
 * @param requestUrl
 * @param callback
 */
export const call = async <T>(
  storageName: string,
  requestUrl: string,
  callback?: (res: T, resType: string) => void
) => {
  const cacheData = await matchCache(storageName, requestUrl);
  if (cacheData) {
    cacheData.json().then((res: T) => {
      callback && callback(res, "cache data");
    });
  } else {
    fetch(requestUrl).then((res) => {
      putCache(storageName, requestUrl, res);
      res
        .clone()
        .json()
        .then((res: T) => {
          callback && callback(res, "api response");
        });
    });
  }
};
