export type BreadcrumbItem = {
  label: string;
  url: string;
};

function normalizePathname(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

function toTitleCase(segment: string) {
  return segment.replace(/[-_]+/g, " ").replace(/\b\w/g, (character) => {
    return character.toUpperCase();
  });
}

function decodeSegment(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function isExactPathMatch(pathname: string, url: string) {
  return normalizePathname(pathname) === normalizePathname(url);
}

export function getPathnameState(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);
  const segments = normalizedPathname.split("/").filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = "";

  for (const segment of segments) {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      label: toTitleCase(decodeSegment(segment)),
      url: currentPath,
    });
  }

  const isExactPath = (url: string) => {
    return normalizedPathname === normalizePathname(url);
  };

  return {
    normalizedPathname,
    segments,
    breadcrumbs,
    isExactPath,
  };
}
