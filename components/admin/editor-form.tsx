"use client";
import type { ProfileDraft } from "@/data/draft-types";
import { Panel } from "@/components/admin/ui/panel";
import { IdentityEditor } from "./editors/identity-editor";
import { AppearanceEditor } from "./editors/appearance-editor";
import { PhotoEditor } from "./editors/photo-editor";
import { ContactInfoEditor } from "./editors/contact-info-editor";
import { FeaturedCardEditor } from "./editors/featured-card-editor";
import { TilesEditor } from "./editors/tiles-editor";
import { ShortcutsEditor } from "./editors/shortcuts-editor";

interface Props {
  draft: ProfileDraft;
  onChange: (draft: ProfileDraft) => void;
}

export function EditorForm({ draft, onChange }: Props) {
  return (
    <div className="space-y-3 px-4 pb-8 pt-4">
      <Panel title="Identity" defaultOpen>
        <IdentityEditor value={draft} onChange={onChange} />
      </Panel>
      <Panel title="Appearance" defaultOpen>
        <AppearanceEditor value={draft} onChange={onChange} />
      </Panel>
      <Panel title="Photo" defaultOpen>
        <PhotoEditor value={draft} onChange={onChange} />
      </Panel>
      <Panel title="Contact info">
        <ContactInfoEditor value={draft} onChange={onChange} />
      </Panel>
      <Panel title="Featured card">
        <FeaturedCardEditor value={draft} onChange={onChange} />
      </Panel>
      <Panel title="Contact tiles">
        <TilesEditor
          value={draft.contacts}
          onChange={contacts => onChange({ ...draft, contacts })}
          label="Tile"
        />
      </Panel>
      <Panel title="Shortcut buttons">
        <ShortcutsEditor
          value={draft.shortcuts}
          onChange={shortcuts => onChange({ ...draft, shortcuts })}
        />
      </Panel>
    </div>
  );
}
