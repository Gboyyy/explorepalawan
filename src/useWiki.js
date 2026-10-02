import { useEffect, useState } from "react";

const cache = {
  Port_Barton: {
    src: `${import.meta.env.BASE_URL}images/port-barton.jpg`,
    page: "https://commons.wikimedia.org/wiki/File:Port_Barton_Beach,_Palawan,_Philippines.jpg",
    credit: "Vyacheslav Argenberg ? CC BY 4.0",
  },
};
export default function useWiki(title) {
  const [data, setData] = useState(cache[title] ?? null);
  useEffect(() => {
    if (cache[title]) return;
    let live = true;
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => ({ src: j.thumbnail?.source || null, page: j.content_urls?.desktop?.page || null }))
      .catch(() => ({ src: null, page: null }))
      .then((out) => { cache[title] = out; if (live) setData(out); });
    return () => { live = false; };
  }, [title]);
  return cache[title] ?? data; // null while loading
}

