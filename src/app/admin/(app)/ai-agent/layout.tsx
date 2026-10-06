import AgentTabs from "./AgentTabs";

export default function AiAgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-black tracking-tight text-stone-900">AI Agent</h1>
      <p className="mt-1 text-sm font-medium text-stone-500">
        The website&apos;s chat assistant: every conversation, what it knows, and the numbers it uses to size solar systems.
      </p>
      <AgentTabs />
      <div className="mt-6">{children}</div>
    </div>
  );
}
