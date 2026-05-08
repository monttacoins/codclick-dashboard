import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Settings, Plus, Trash2, Wrench, Loader2, Save, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Ferramenta = {
  id: string;
  nome: string;
  icone_url: string | null;
  link: string;
  ordem: number;
};

async function uploadIcon(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "png";
  const path = `icons/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("ferramentas")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from("ferramentas").getPublicUrl(path);
  return data.publicUrl;
}

export function ToolsDashboard() {
  const [tools, setTools] = useState<Ferramenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("CodClick Marketing");
  const [logo, setLogo] = useState<string>("");
  const [configId, setConfigId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const loadAll = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id ?? null;
    setUserId(uid);
    const [{ data: tts }, { data: cfg }, orderRes] = await Promise.all([
      supabase.from("ferramentas").select("*").order("ordem", { ascending: true }),
      supabase.from("empresa_config").select("*").order("created_at", { ascending: true }).limit(1),
      uid
        ? supabase.from("user_tool_order").select("ferramenta_id, ordem").eq("user_id", uid)
        : Promise.resolve({ data: [] as { ferramenta_id: string; ordem: number }[] }),
    ]);
    const list = tts ?? [];
    const orderMap = new Map<string, number>();
    (orderRes.data ?? []).forEach((r) => orderMap.set(r.ferramenta_id, r.ordem));
    const sorted = [...list].sort((a, b) => {
      const ao = orderMap.has(a.id) ? orderMap.get(a.id)! : 1000 + a.ordem;
      const bo = orderMap.has(b.id) ? orderMap.get(b.id)! : 1000 + b.ordem;
      return ao - bo;
    });
    setTools(sorted);
    if (cfg && cfg.length > 0) {
      const row = cfg[0];
      setConfigId(row.id);
      if (row.nome) setCompanyName(row.nome);
      if (row.logo) setLogo(row.logo);
    } else {
      setConfigId(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 2000, tolerance: 16 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tools.findIndex((t) => t.id === active.id);
    const newIndex = tools.findIndex((t) => t.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = arrayMove(tools, oldIndex, newIndex);
    setTools(reordered);
    if (!userId) return;
    const rows = reordered.map((t, i) => ({
      user_id: userId,
      ferramenta_id: t.id,
      ordem: i,
    }));
    const { error } = await supabase
      .from("user_tool_order")
      .upsert(rows, { onConflict: "user_id,ferramenta_id" });
    if (error) toast.error("Erro ao salvar ordem");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-tile)]">
              {logo ? (
                <img src={logo} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-primary-foreground">C</span>
              )}
            </div>
            <h1 className="text-base font-semibold tracking-tight sm:text-lg">{companyName}</h1>
          </div>
          <div className="flex items-center gap-1">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Configurações"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <SettingsDialog
                tools={tools}
                companyName={companyName}
                logo={logo}
                configId={configId}
                onChanged={loadAll}
                onClose={() => setOpen(false)}
              />
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Sair"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {loading ? (
          <div className="flex justify-center py-20 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : tools.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
            <Wrench className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              Nenhum atalho ainda. Abra as configurações para adicionar.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={tools.map((t) => t.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-3 gap-4 sm:gap-6 md:grid-cols-5">
                {tools.map((tool) => (
                  <SortableTile key={tool.id} tool={tool} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </main>
    </div>
  );
}

function SortableTile({ tool }: { tool: Ferramenta }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tool.id });
  const dragClickRef = useRef(false);

  useEffect(() => {
    if (isDragging) {
      dragClickRef.current = true;
      return;
    }

    if (!dragClickRef.current) return;
    const timeout = window.setTimeout(() => {
      dragClickRef.current = false;
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [isDragging]);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : undefined,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex touch-pan-y flex-col items-center gap-3 rounded-2xl border border-border bg-card p-4 text-center transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--shadow-tile)]"
      onClick={(e) => {
        if (isDragging || dragClickRef.current) {
          e.preventDefault();
          return;
        }
        if (tool.link) window.open(tool.link, "_blank", "noopener,noreferrer");
        e.preventDefault();
      }}
    >
      <div
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className="flex h-16 w-16 cursor-grab touch-pan-y items-center justify-center overflow-hidden rounded-2xl bg-muted ring-1 ring-border transition-all group-hover:ring-primary/50 active:cursor-grabbing sm:h-20 sm:w-20"
      >
        {tool.icone_url ? (
          <img
            src={tool.icone_url}
            alt={tool.nome}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <Wrench className="h-7 w-7 text-muted-foreground" />
        )}
      </div>
      <span className="line-clamp-2 text-xs font-medium text-foreground sm:text-sm">
        {tool.nome}
      </span>
    </div>
  );
}

function SettingsDialog({
  tools,
  companyName,
  logo,
  configId,
  onChanged,
  onClose,
}: {
  tools: Ferramenta[];
  companyName: string;
  logo: string;
  configId: string | null;
  onChanged: () => Promise<void>;
  onClose: () => void;
}) {
  const [name, setName] = useState(companyName);
  const [logoUrl, setLogoUrl] = useState(logo);
  const [savingCompany, setSavingCompany] = useState(false);
  const [adding, setAdding] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(companyName);
    setLogoUrl(logo);
  }, [companyName, logo]);

  const saveCompany = async () => {
    setSavingCompany(true);
    try {
      if (configId) {
        const { error } = await supabase
          .from("empresa_config")
          .update({ nome: name, logo: logoUrl })
          .eq("id", configId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("empresa_config")
          .insert({ nome: name, logo: logoUrl });
        if (error) throw error;
      }
      toast.success("Empresa atualizada");
      await onChanged();
    } catch (e: unknown) {
      toast.error((e as Error).message);
    } finally {
      setSavingCompany(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    try {
      const url = await uploadIcon(file);
      setLogoUrl(url);
      toast.success("Logo enviado");
    } catch (e: unknown) {
      toast.error((e as Error).message);
    }
  };

  const addTool = async () => {
    setAdding(true);
    try {
      const nextOrdem = tools.length;
      const { error } = await supabase.from("ferramentas").insert({
        nome: `Ferramenta ${nextOrdem + 1}`,
        link: "",
        ordem: nextOrdem,
      });
      if (error) throw error;
      await onChanged();
      toast.success("Atalho adicionado");
    } catch (e: unknown) {
      toast.error((e as Error).message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Configurações</DialogTitle>
      </DialogHeader>

      <ScrollArea className="max-h-[65vh] pr-4">
        <div className="space-y-6">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Empresa</h3>
            <div className="space-y-2">
              <Label htmlFor="company">Nome da empresa</Label>
              <Input id="company" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-muted ring-1 ring-border">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="h-full w-full object-cover" />
                  ) : (
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleLogoUpload(f);
                  }}
                />
                <Button variant="outline" size="sm" onClick={() => logoInputRef.current?.click()}>
                  Enviar imagem
                </Button>
                {logoUrl && (
                  <Button variant="ghost" size="sm" onClick={() => setLogoUrl("")}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <Button onClick={saveCompany} disabled={savingCompany} size="sm">
              {savingCompany ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Salvar empresa
            </Button>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Atalhos ({tools.length})</h3>
              <Button size="sm" onClick={addTool} disabled={adding}>
                <Plus className="mr-1 h-4 w-4" /> Adicionar
              </Button>
            </div>
            <div className="space-y-3">
              {tools.map((tool) => (
                <ToolRow key={tool.id} tool={tool} onChanged={onChanged} />
              ))}
              {tools.length === 0 && (
                <p className="text-xs text-muted-foreground">Nenhum atalho cadastrado.</p>
              )}
            </div>
          </section>
        </div>
      </ScrollArea>

      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>
          Fechar
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function ToolRow({ tool, onChanged }: { tool: Ferramenta; onChanged: () => Promise<void> }) {
  const [nome, setNome] = useState(tool.nome);
  const [link, setLink] = useState(tool.link);
  const [iconUrl, setIconUrl] = useState(tool.icone_url ?? "");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNome(tool.nome);
    setLink(tool.link);
    setIconUrl(tool.icone_url ?? "");
  }, [tool]);

  const dirty = nome !== tool.nome || link !== tool.link || iconUrl !== (tool.icone_url ?? "");

  const save = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("ferramentas")
        .update({ nome, link, icone_url: iconUrl || null })
        .eq("id", tool.id);
      if (error) throw error;
      await onChanged();
      toast.success("Atalho salvo");
    } catch (e: unknown) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm(`Remover "${tool.nome}"?`)) return;
    setRemoving(true);
    try {
      const { error } = await supabase.from("ferramentas").delete().eq("id", tool.id);
      if (error) throw error;
      await onChanged();
      toast.success("Atalho removido");
    } catch (e: unknown) {
      toast.error((e as Error).message);
    } finally {
      setRemoving(false);
    }
  };

  const handleIcon = async (file: File) => {
    try {
      const url = await uploadIcon(file);
      setIconUrl(url);
    } catch (e: unknown) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-card/50 p-3">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted ring-1 ring-border hover:ring-primary"
        aria-label="Enviar ícone"
      >
        {iconUrl ? (
          <img src={iconUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <Plus className="h-4 w-4 text-muted-foreground" />
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleIcon(f);
          }}
        />
      </button>
      <div className="flex-1 space-y-2">
        <Input value={nome} placeholder="Nome" onChange={(e) => setNome(e.target.value)} />
        <Input value={link} placeholder="https://..." onChange={(e) => setLink(e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <Button size="sm" onClick={save} disabled={!dirty || saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        </Button>
        <Button size="sm" variant="ghost" onClick={remove} disabled={removing} aria-label="Remover">
          {removing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4 text-destructive" />
          )}
        </Button>
      </div>
    </div>
  );
}
