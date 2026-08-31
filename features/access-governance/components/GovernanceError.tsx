import Notice from "@/global-components/ui/Notice";

export default function GovernanceError({ error }: { error?: string }) {
  if (!error) return null;
  return <Notice tone="danger">{error}</Notice>;
}
