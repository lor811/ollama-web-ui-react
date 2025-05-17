import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { PrismAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import atomDark from 'react-syntax-highlighter/dist/esm/styles/prism/atom-dark';

type MarkdownRenderer = {
    children: string | null | undefined
}

export default function MarkdownRenderer({ children }: MarkdownRenderer) {
  return (
    <Markdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeRaw]}
    children={ children }
    components={{
        code(props) {
            const {children, className, node, ...rest} = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
                <SyntaxHighlighter
                    children={String(children)}
                    language={match[1]}
                    style={ atomDark }
                />
        
            ) : (
                <code {...rest} className={className}>
                    {children}
                </code>
            );
        },
        ol: ({ node, className, children, ...props }) => (
            <ol className={className} style={{ listStyleType: 'decimal' }} {...props}>
                {children}
            </ol>
        ),
        ul: ({ node, className, children, ...props }) => (
            <ul className={className} style={{ listStyleType: 'disc' }} {...props}>
                {children}
            </ul>
        )
    }} />
  );
}