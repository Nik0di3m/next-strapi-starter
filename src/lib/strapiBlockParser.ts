type TextNode = {
  type: "text";
  text: string;
  bold?: boolean;
};

type ChildNode = TextNode | LinkNode;

type HeadingNode = {
  type: "heading";
  children: TextNode[];
  level: number;
};

type ParagraphNode = {
  type: "paragraph";
  children: ChildNode[];
};

type ListItemNode = {
  type: "list-item";
  children: TextNode[];
};

type ListNode = {
  type: "list";
  format: "ordered" | "unordered";
  children: ListItemNode[];
};

type ImageNode = {
  type: "image";
  image: {
    url: string;
    alternativeText: string;
    caption?: string;
    width?: number;
    height?: number;
  };
  children: TextNode[];
};

type QuoteNode = {
  type: "quote";
  children: TextNode[];
};

type LinkNode = {
  type: "link";
  url: string;
  children: TextNode[];
};

type ContentNode =
  | HeadingNode
  | ParagraphNode
  | ListNode
  | ImageNode
  | QuoteNode
  | LinkNode;

function parseChildNodes(nodes: ChildNode[]): string {
  return nodes
    .map((node) => {
      if (node.type === "text") {
        return node.bold ? `<strong>${node.text}</strong>` : node.text;
      } else if (node.type === "link") {
        return `<a href="${node.url}">${parseTextNodes(node.children)}</a>`;
      }
      return "";
    })
    .join("");
}

function parseTextNodes(nodes: TextNode[]): string {
  return parseChildNodes(nodes as ChildNode[]);
}

function parseListItem(item: ListItemNode): string {
  return `<li>${parseTextNodes(item.children)}</li>`;
}

// Parser
export function parseContent(content: ContentNode[]): string {
  return content
    .map((node) => {
      switch (node.type) {
        case "heading":
          return `<h${node.level}>${parseTextNodes(node.children)}</h${
            node.level
          }>`;
        case "paragraph":
          return `<p>${parseTextNodes(node.children as TextNode[])}</p>`;
        case "list":
          const tag = node.format === "ordered" ? "ol" : "ul";
          return `<${tag}>${node.children
            .map(parseListItem)
            .join("")}</${tag}>`;
        case "image":
          return `<img src="${node.image.url}" alt="${node.image.alternativeText}" width="${node.image.width}" height="${node.image.height}" />`;
        case "quote":
          return `<blockquote>${parseTextNodes(node.children)}</blockquote>`;
        default:
          return "";
      }
    })
    .join("");
}
