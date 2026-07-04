import { createFileRoute, Navigate } from "@tanstack/react-router";
import { FileText, Download, Upload, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/providers/auth-provider";
import { TENANT_NAV } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useLocalCollection } from "@/lib/local-store";
import { pickFile, downloadText, shortId } from "@/lib/actions";

export const Route = createFileRoute("/_authenticated/tenant/documents")({
  head: () => ({ meta: [{ title: "Documents · Hostly" }] }),
  component: DocumentsPage,
});

type DocStatus = "verified" | "pending" | "missing";
type Doc = {
  id: string;
  name: string;
  type: string;
  size?: string;
  uploaded?: string;
  status: DocStatus;
};

const SEED: Doc[] = [
  {
    id: "d1",
    name: "Rental Agreement.pdf",
    type: "Agreement",
    size: "412 KB",
    uploaded: "May 09, 2025",
    status: "verified",
  },
  {
    id: "d2",
    name: "Aadhaar Card.pdf",
    type: "ID Proof",
    size: "220 KB",
    uploaded: "May 09, 2025",
    status: "verified",
  },
  {
    id: "d3",
    name: "Employment Letter.pdf",
    type: "Address Proof",
    size: "180 KB",
    uploaded: "May 10, 2025",
    status: "verified",
  },
  { id: "d4", name: "Police Verification", type: "Verification", status: "missing" },
];
const STATUS: Record<DocStatus, { label: string; className: string; Icon: typeof CheckCircle2 }> = {
  verified: { label: "Verified", className: "bg-success/10 text-success", Icon: CheckCircle2 },
  pending: { label: "Pending review", className: "bg-warning/10 text-warning", Icon: AlertCircle },
  missing: {
    label: "Not uploaded",
    className: "bg-muted text-muted-foreground",
    Icon: AlertCircle,
  },
};

function DocumentsPage() {
  const { user } = useAuth();
  const { items, add, update, remove } = useLocalCollection<Doc>("hostly.tenant.docs", SEED);

  if (!user) return null;
  if (user.role !== "tenant") return <Navigate to="/unauthorized" />;

  async function upload(existing?: Doc) {
    const file = await pickFile("application/pdf,image/*");
    if (!file) return;
    const size = `${Math.max(1, Math.round(file.size / 1024))} KB`;
    const uploaded = new Date().toLocaleDateString("en-IN", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    if (existing) {
      update(existing.id, { name: file.name, size, uploaded, status: "pending" });
      toast.success(`${file.name} uploaded — pending review`);
    } else {
      add({ id: shortId("d"), name: file.name, type: "Other", size, uploaded, status: "pending" });
      toast.success(`${file.name} uploaded`);
    }
  }
  function download(d: Doc) {
    downloadText(
      `${d.name}.txt`,
      `Document: ${d.name}\nType: ${d.type}\nUploaded: ${d.uploaded ?? "—"}\nStatus: ${d.status}`,
    );
    toast.success(`${d.name} downloaded`);
  }

  return (
    <DashboardShell
      title="Documents"
      subtitle="Your KYC, agreements and verifications"
      navGroups={TENANT_NAV}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {items.filter((d) => d.status === "verified").length} of {items.length} verified
        </p>
        <Button size="sm" onClick={() => upload()}>
          <Upload className="mr-1 h-4 w-4" /> Upload document
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((d) => {
          const s = STATUS[d.status];
          const Icon = s.Icon;
          return (
            <Card key={d.id} className="border-border/70">
              <CardContent className="flex items-start gap-3 p-4">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{d.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.type}
                        {d.uploaded ? ` · Uploaded ${d.uploaded}` : ""}
                        {d.size ? ` · ${d.size}` : ""}
                      </p>
                    </div>
                    <Badge variant="secondary" className={cn("shrink-0", s.className)}>
                      <Icon className="mr-1 h-3 w-3" /> {s.label}
                    </Badge>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {d.status === "missing" ? (
                      <Button size="sm" variant="outline" onClick={() => upload(d)}>
                        <Upload className="mr-1 h-3.5 w-3.5" /> Upload
                      </Button>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={() => download(d)}>
                          <Download className="mr-1 h-3.5 w-3.5" /> Download
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => upload(d)}>
                          Replace
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            remove(d.id);
                            toast.success(`${d.name} removed`);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardShell>
  );
}
