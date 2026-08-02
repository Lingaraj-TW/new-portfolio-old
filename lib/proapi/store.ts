"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { allEndpoints, mockCategories } from "./mock-data";
import type {
  ApiCategory,
  ApiEndpoint,
  ApiVersion,
  PlaygroundRequest,
} from "./types";

type ProApiState = {
  apiVersion: ApiVersion;
  selectedEndpointId: string;
  apiKey: string;
  serverId: string;
  categories: ApiCategory[];
  importedTitle: string | null;
  playgroundHistory: PlaygroundRequest[];
  playgroundCollections: { id: string; name: string; requests: PlaygroundRequest[] }[];
  setApiVersion: (v: ApiVersion) => void;
  setSelectedEndpoint: (id: string) => void;
  setApiKey: (key: string) => void;
  setServerId: (id: string) => void;
  setCategories: (categories: ApiCategory[], title?: string) => void;
  resetCategories: () => void;
  getEndpointsForVersion: () => ApiEndpoint[];
  getSelectedEndpoint: () => ApiEndpoint | undefined;
  addPlaygroundHistory: (req: PlaygroundRequest) => void;
  saveToCollection: (collectionId: string, req: PlaygroundRequest) => void;
  addCollection: (name: string) => string;
};

export const useProApiStore = create<ProApiState>()(
  persist(
    (set, get) => ({
      apiVersion: "v1",
      selectedEndpointId: allEndpoints[0]?.id ?? "create-feedback",
      apiKey: "",
      serverId: "production",
      categories: mockCategories,
      importedTitle: null,
      playgroundHistory: [],
      playgroundCollections: [{ id: "default", name: "My Collection", requests: [] }],
      setApiVersion: (v) => set({ apiVersion: v }),
      setSelectedEndpoint: (id) => set({ selectedEndpointId: id }),
      setApiKey: (key) => set({ apiKey: key }),
      setServerId: (id) => set({ serverId: id }),
      setCategories: (categories, title) =>
        set({ categories, importedTitle: title ?? "Imported API" }),
      resetCategories: () => set({ categories: mockCategories, importedTitle: null }),
      getEndpointsForVersion: () => {
        const { categories, apiVersion } = get();
        return categories
          .flatMap((c) => c.endpoints)
          .filter((e) => e.version === apiVersion || (apiVersion === "v2" && e.deprecated));
      },
      getSelectedEndpoint: () => {
        const eps = get().getEndpointsForVersion();
        const all = get().categories.flatMap((c) => c.endpoints);
        return (
          eps.find((e) => e.id === get().selectedEndpointId) ??
          all.find((e) => e.id === get().selectedEndpointId) ??
          eps[0]
        );
      },
      addPlaygroundHistory: (req) =>
        set((s) => ({
          playgroundHistory: [req, ...s.playgroundHistory].slice(0, 50),
        })),
      saveToCollection: (collectionId, req) =>
        set((s) => ({
          playgroundCollections: s.playgroundCollections.map((c) =>
            c.id === collectionId
              ? { ...c, requests: [req, ...c.requests].slice(0, 20) }
              : c,
          ),
        })),
      addCollection: (name) => {
        const id = `col-${Date.now()}`;
        set((s) => ({
          playgroundCollections: [...s.playgroundCollections, { id, name, requests: [] }],
        }));
        return id;
      },
    }),
    {
      name: "proapi-portal",
      partialize: (s) => ({
        apiVersion: s.apiVersion,
        apiKey: s.apiKey,
        serverId: s.serverId,
        playgroundHistory: s.playgroundHistory,
        playgroundCollections: s.playgroundCollections,
      }),
    },
  ),
);
