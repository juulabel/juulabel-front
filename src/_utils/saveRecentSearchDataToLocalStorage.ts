interface ISaveRecentSearchDataToLocalStorage {
  localStorageKey: string;
  searchData: string;
}

export default function saveRecentSearchDataToLocalStorage({
  localStorageKey,
  searchData,
}: ISaveRecentSearchDataToLocalStorage) {
  const recentSearchList = localStorage.getItem(localStorageKey);
  const parsedRecentSearchList = recentSearchList
    ? JSON.parse(recentSearchList)
    : [];
  const searchDataExist = parsedRecentSearchList.indexOf(searchData);
  if (searchDataExist !== -1) parsedRecentSearchList.splice(searchDataExist, 1);
  if (parsedRecentSearchList.length === 10) parsedRecentSearchList.pop();
  parsedRecentSearchList.unshift(searchData);
  localStorage.setItem(localStorageKey, JSON.stringify(parsedRecentSearchList));
}
