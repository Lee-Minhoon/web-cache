import { deleteCache, call } from "./utilities/cache";

const url =
  "https://www.7timer.info/bin/astro.php?lon=113.2&lat=23.1&ac=0&unit=metric&output=json&tzshift=0" as const;

const storage = "testStorage" as const;

function App() {
  const handleCall = () => {
    call(storage, url, (res, resType) => console.log(resType, res));
  };

  const handleDeleteCache = () => {
    deleteCache(storage, url);
  };

  return (
    <div style={{ display: "flex", padding: 50, gap: 20 }}>
      <button onClick={handleCall}>API 호출</button>
      <button onClick={handleDeleteCache}>캐시 제거</button>
    </div>
  );
}

export default App;
