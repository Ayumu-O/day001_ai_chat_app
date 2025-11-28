import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  children: string;
};

type AnchorProps = ComponentPropsWithoutRef<"a"> & {
  node?: unknown;
};

type CodeProps = ComponentPropsWithoutRef<"code"> & {
  className?: string;
  children?: ReactNode;
};

function AnchorTag({ children, ...props }: AnchorProps) {
  try {
    new URL(props.href ?? "");
    props.target = "_blank";
    props.rel = "noopener noreferrer";
  } catch (error) {
    // noop for relative links
  }

  return <a {...props}>{children}</a>;
}

// 参考: https://github.com/remarkjs/react-markdown?tab=readme-ov-file#use-custom-components-syntax-highlight
function CodeBlock({ className, children, ...props }: CodeProps) {
  const match = /language-(\w+)/.exec(className || "");
  return match ? (
    <SyntaxHighlighter
      {...props}
      PreTag="div"
      children={String(children).replace(/\n$/, "")}
      language={match[1]}
      style={atomDark}
    />
  ) : (
    <code {...props} className={className}>
      {children}
    </code>
  );
}

const markdownComponents: Components = {
  a: AnchorTag,
  code: CodeBlock,
};

export function MarkdownRenderer({ children }: Props) {
  return (
    <ReactMarkdown components={markdownComponents}>{children}</ReactMarkdown>
  );
}
