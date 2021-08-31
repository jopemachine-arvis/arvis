type SnippetKeyword = string;

type CharBuffer = string;

type CollectionName = string;

interface SnippetItem {
  name: string;
  keyword: string;
  snippet: string;
  useAutoExpand: boolean;
  collection: string;
}
