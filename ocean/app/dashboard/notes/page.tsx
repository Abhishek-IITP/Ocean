import { requireUser } from "@/app/lib/hook";
import prisma from "@/app/lib/db";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { NotesBoard, NoteView } from "@/components/notes/NotesBoard";

export default async function NotesPage() {
  const session = await requireUser();
  const notes = await prisma.note.findMany({
    where: { userId: session.user!.id as string, archived: false },
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
    take: 200,
  });

  const mapped: NoteView[] = notes.map((n) => ({
    id: n.id,
    title: n.title,
    content: n.content,
    color: n.color,
    pinned: n.pinned,
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Notes"
        description="A calm place for thoughts, lists and fragments. Pin what matters; edits save as you type."
      />
      <NotesBoard notes={mapped} />
    </div>
  );
}
