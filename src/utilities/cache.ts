import axios from "axios";

export const openCache = async (storageName: string): Promise<Cache> => {
  const storage = await window.caches.open(storageName);
  return storage;
};

export const addCache = async (storageName: string, requestUrl: string) => {
  const storage = await openCache(storageName);
  storage.add(requestUrl);
};

export const matchCache = async (storageName: string, requestUrl: string) => {
  const storage = await openCache(storageName);
  return storage.match(requestUrl);
};

export const putCache = async (storageName: string, word, callback) => {
  const url = `http://localhost:4000/sick?q=${word}`;
  console.log("search...", word);
  const exist = await matchCache(storageName, url);
  if (exist) {
    // 캐시 있으면
    exist.json().then((res) => {
      // 그대로 콜백에 쏴줌 (setData)
      console.log("cache res:", res);
      callback(res);
    });
  } else {
    // 캐시없으면 fetch함 페치한거를 콜백에 쏴주고 (setData)
    // 그리고 캐시에 넣음 addCache
    fetch(url).then((res) => {
      res.json().then((res) => {
        console.log("api call res:", res);
        callback(res);
      });
      addCache(storageName, url);
    });
  }
  //   matchCache('cache', url).then(async (res) => {
  //     if (res) {
  //       console.log('hit cache');
  //       const data = res.json();
  //       return data;
  //     } else {
  //       console.log('api call');
  //       return addCache('cache', url);
  //     }
  //   });
};
