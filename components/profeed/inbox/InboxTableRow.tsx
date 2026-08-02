"use client";

import { FileText, Mic } from "lucide-react";

import type { InboxRow } from "./inbox-types";
import {
  HelpfulBadge,
  StarRating,
  TeamBadge,
  WriterAvatar,
} from "./inbox-badges";
import { AttachmentThumb } from "./AttachmentThumb";
import { InboxStatusCell } from "./InboxStatusCell";

export function InboxTableRow({
  row,
  expanded,
  onToggle,
  canTriage,
  canOpenFileLinks,
}: {
  row: InboxRow;
  expanded: boolean;
  onToggle: () => void;
  canTriage: boolean;
  canOpenFileLinks: boolean;
}) {
  const primaryAuthor = row.authors[0];
  const firstAttachment = row.attachments[0];

  return (
    <>
      <tr
        onClick={onToggle}
        className="group cursor-pointer border-b border-white/5 transition-colors hover:bg-white/[0.03]"
      >
        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">
          {new Date(row.created_at).toLocaleString()}
        </td>
        <td
          className="max-w-[120px] truncate px-4 py-3 font-mono text-xs text-purple-300"
          title={row.page_path}
        >
          {row.page_path}
        </td>
        <td className="max-w-[160px] px-4 py-3 text-xs text-slate-400">
          {row.section_anchor ? (
            <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-slate-300">
              {row.section_anchor}
            </span>
          ) : (
            <span className="text-slate-600">—</span>
          )}
        </td>
        <td className="px-4 py-3">
          <HelpfulBadge rating={row.rating} />
        </td>
        <td className="px-4 py-3">
          {row.star_rating ? (
            <StarRating count={row.star_rating} />
          ) : (
            <span className="text-slate-600">—</span>
          )}
        </td>
        <td className="px-4 py-3">
          {primaryAuthor ? (
            <div className="flex min-w-0 items-center gap-1.5">
              <WriterAvatar name={primaryAuthor} image={row.writer_image} />
              <span className="truncate text-xs text-slate-300">
                {primaryAuthor}
              </span>
            </div>
          ) : (
            <span className="text-slate-600">—</span>
          )}
        </td>
        <td className="px-4 py-3">
          {row.teams.length ? (
            <div className="flex flex-wrap gap-1">
              {row.teams.map((t) => (
                <TeamBadge key={t} name={t} />
              ))}
            </div>
          ) : (
            <span className="text-slate-600">—</span>
          )}
        </td>
        <td className="px-4 py-3 text-center text-sm text-slate-400">
          {row.highlights_count || "—"}
        </td>
        <td className="max-w-[200px] px-4 py-3">
          {row.message ? (
            <span className="line-clamp-2 text-xs text-slate-300">
              {row.message}
            </span>
          ) : (
            <span className="text-slate-600">—</span>
          )}
        </td>
        <td className="px-4 py-3 text-center">
          {row.voice_transcript ? (
            <Mic size={14} className="mx-auto text-purple-400" />
          ) : (
            <span className="text-slate-600">—</span>
          )}
        </td>
        <td className="px-4 py-3 text-center">
          {firstAttachment ? (
            <AttachmentThumb
              attachment={firstAttachment}
              canOpen={canOpenFileLinks}
            />
          ) : (
            <span className="text-slate-600">—</span>
          )}
        </td>
        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
          <InboxStatusCell
            id={row.id}
            status={row.status}
            canTriage={canTriage}
          />
        </td>
      </tr>
      {expanded ? (
        <tr className="border-b border-white/5 bg-purple-950/20">
          <td colSpan={12} className="px-6 py-4">
            <div className="grid gap-6 text-sm md:grid-cols-3">
              <div>
                <p className="mb-1 text-xs text-slate-500">FULL MESSAGE</p>
                <p className="text-slate-200">{row.message || "No message"}</p>
                {row.voice_transcript ? (
                  <p className="mt-3 text-xs text-slate-400">
                    <Mic size={12} className="mr-1 inline" />
                    {row.voice_transcript}
                  </p>
                ) : null}
              </div>
              <div>
                <p className="mb-1 text-xs text-slate-500">PAGE PATH</p>
                <p className="font-mono text-slate-200">{row.page_path}</p>
                {row.attachments.length > 1 ? (
                  <ul className="mt-3 space-y-1">
                    {row.attachments.slice(1).map((a) => (
                      <li key={a.id} className="flex items-center gap-1 text-xs">
                        <FileText size={12} className="text-purple-400" />
                        {canOpenFileLinks ? (
                          <AttachmentThumb
                            attachment={a}
                            canOpen
                            showName
                          />
                        ) : (
                          <span className="text-slate-400">{a.file_name}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <div>
                <p className="mb-1 text-xs text-slate-500">SUBMITTED</p>
                <p className="text-slate-200">
                  {new Date(row.created_at).toLocaleString()}
                </p>
                <a
                  href={`/profeed/feedback/${row.id}`}
                  className="mt-3 inline-block text-xs font-medium text-purple-400 hover:text-purple-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  Open detail view →
                </a>
              </div>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}
