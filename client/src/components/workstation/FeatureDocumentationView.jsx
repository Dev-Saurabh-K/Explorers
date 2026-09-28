import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CheckIcon, ChevronLeftIcon, CodeIcon, CopyIcon, DownloadIcon, EyeIcon, FileCodeIcon, ListUnorderedIcon, SyncIcon } from "@primer/octicons-react";

const slugify = (text) => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function Source({ value }) {
  return <pre className="vscode-markdown-source" aria-label="Markdown source">{value.split("\n").map((line, index) => <code key={`${index}-${line}`}><span className="vscode-line-number">{index + 1}</span><span>{line || " "}</span></code>)}</pre>;
}

export function FeatureDocumentationView({ feature, repoName = "main", onBack = () => {}, onRegenerate = () => {}, isRegenerating = false }) {
  const [view, setView] = useState("preview");
  const [copied, setCopied] = useState(false);
  if (!feature) return null;

  const filename = `${feature.id || feature.feature_id || "feature"}.md`;
  const title = feature.name || feature.feature_name || "Feature documentation";
  const markdown = feature.markdown_content || feature.documentation?.markdown || `# ${title}\n\n${feature.summary || "No documentation has been generated for this feature yet."}`;
  const headings = markdown.split("\n").flatMap((line) => {
    const match = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    return match ? [{ level: match[1].length, text: match[2], id: slugify(match[2]) }] : [];
  });
  const copy = async () => {
    await navigator.clipboard?.writeText(markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([markdown], { type: "text/markdown;charset=utf-8" }));
    const anchor = Object.assign(document.createElement("a"), { href: url, download: filename });
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const heading = (Tag, level) => ({ children }) => {
    const text = String(children).replace(/\[object Object\]/g, "");
    const id = slugify(text);
    return <Tag id={id} className={`vscode-md-h${level}`}><a href={`#${id}`} aria-label={`Link to ${text}`}>{children}</a></Tag>;
  };

  return <section className="vscode-markdown flex-1 min-h-0 flex flex-col" aria-label="Documentation viewer">
    <header className="vscode-markdown-titlebar">
      <div className="min-w-0 flex items-center gap-2"><button onClick={onBack} className="github-button github-button-invisible github-button-sm" aria-label="Back to feature"><ChevronLeftIcon size={16} /></button><FileCodeIcon size={16} className="shrink-0" /><span className="truncate">{repoName}</span><span className="vscode-muted">/</span><strong className="truncate">{filename}</strong></div>
      <div className="flex items-center gap-2 shrink-0"><button onClick={() => onRegenerate(feature)} disabled={isRegenerating} className="github-button github-button-sm" title="Regenerate documentation"><SyncIcon size={14} className={isRegenerating ? "animate-spin" : ""} /><span className="hidden sm:inline">Regenerate</span></button><button onClick={copy} className="github-button github-button-sm" title="Copy Markdown">{copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}<span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span></button><button onClick={download} className="github-button github-button-sm" title="Download Markdown"><DownloadIcon size={14} /><span className="hidden sm:inline">Download</span></button></div>
    </header>
    <div className="vscode-markdown-tabs"><button onClick={() => setView("preview")} className={view === "preview" ? "active" : ""}><EyeIcon size={14} /> Preview</button><button onClick={() => setView("source")} className={view === "source" ? "active" : ""}><CodeIcon size={14} /> Source</button></div>
    <div className="flex-1 min-h-0 flex overflow-hidden">
      <main className="vscode-markdown-document">{view === "preview" ? <article className="vscode-markdown-preview"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{ h1: heading("h1", 1), h2: heading("h2", 2), h3: heading("h3", 3), a: ({ href, children }) => <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{children}</a>, code: ({ className, children }) => className ? <pre className="vscode-code-block"><code className={className}>{children}</code></pre> : <code>{children}</code>, table: ({ children }) => <div className="vscode-table-wrap"><table>{children}</table></div> }}>{markdown}</ReactMarkdown></article> : <Source value={markdown} />}</main>
      {headings.length > 0 && <aside className="vscode-markdown-outline"><div className="vscode-outline-title"><ListUnorderedIcon size={14} /> Outline</div>{headings.map((item) => <a key={`${item.id}-${item.level}`} href={`#${item.id}`} className={`vscode-outline-level-${item.level}`}>{item.text}</a>)}</aside>}
    </div>
  </section>;
}
