type SnippetKeyword = string;

type CharBuffer = string;

interface SnippetItem {
  name: string;
  keyword: string;
  snippet: string;
  useAutoExpand: boolean;
  collection: string;
}
