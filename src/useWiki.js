import { useEffect, useState } from "react";

import riverPhotos from "./riverPhotos.json";

const cache = {
  Puerto_Princesa_Underground_River: riverPhotos.map((photo) => ({
    ...photo, src: `${import.meta.env.BASE_URL}${photo.src}`,
  })),
};
const pending = {};
const localPhoto = {
  src: `${import.meta.env.BASE_URL}images/port-barton.jpg`,
  page: "https://commons.wikimedia.org/wiki/File:Port_Barton_Beach,_Palawan,_Philippines.jpg",
  credit: "Vyacheslav Argenberg · CC BY 4.0",
};

function loadPhotos(title) {
  if (cache[title]) return Promise.resolve(cache[title]);
  if (!pending[title]) {
    const params = new URLSearchParams({
      action: "query", redirects: "1", generator: "images", titles: title.replaceAll("_", " "),
      gimlimit: "50", prop: "imageinfo", iiprop: "url", iiurlwidth: "1280",
      format: "json", origin: "*",
    });
    pending[title] = fetch(`https://en.wikipedia.org/w/api.php?${params}`)
      .then((response) => { if (!response.ok) throw new Error("Photo request failed"); return response.json(); })
      .then((result) => Object.values(result.query?.pages || {})
        .filter((page) => /\.(jpe?g|webp)$/i.test(page.title) && !/flag|map|logo|seal|coat.of.arms|locator|montage|collage/i.test(page.title))
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((page) => ({ src: page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url, page: page.imageinfo?.[0]?.descriptionurl, caption: page.title.replace(/^File:/, "").replace(/\.[^.]+$/, "").replaceAll("_", " ") }))
        .filter((photo) => photo.src))
      .catch(() => [])
      .then((photos) => {
        if (title === "Port_Barton") photos.unshift(localPhoto);
        const unique = photos.filter((photo, index) => photos.findIndex((other) => other.src === photo.src) === index);
        cache[title] = unique;
        return unique;
      });
  }
  return pending[title];
}

export function useWikiPhotos(title) {
  const [result, setResult] = useState(null);
  useEffect(() => {
    let live = true;
    loadPhotos(title).then((photos) => { if (live) setResult({ title, photos }); });
    return () => { live = false; };
  }, [title]);
  return cache[title] ?? (result?.title === title ? result.photos : null);
}

export default function useWiki(title, photoIndex = 0) {
  const photos = useWikiPhotos(title);
  return photos === null ? null : photos[photoIndex % photos.length] || { src: null, page: null };
}
